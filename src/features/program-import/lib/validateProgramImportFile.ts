import { z } from 'zod'

import {
  PROGRAM_IMPORT_ALLOWED_EXTENSIONS,
  PROGRAM_IMPORT_COLUMNS,
  PROGRAM_IMPORT_COURSE_TYPES,
  PROGRAM_IMPORT_MAX_SIZE_MB,
} from '../model/constants'

const bytesInMegabyte = 1024 * 1024
const allowedCourseTypes = new Set<string>(PROGRAM_IMPORT_COURSE_TYPES)

const importCourseRowSchema = z.object({
  course_title: z.string().trim().min(1, 'не указано значение course_title'),
  course_description: z.string().trim().optional(),
  course_type: z
    .string()
    .trim()
    .transform((value) => value.toLowerCase())
    .refine(
      (value) => allowedCourseTypes.has(value),
      'course_type должен быть required или elective',
    ),
  prerequisite_titles: z.string().trim().optional(),
})

const getFileExtension = (file: File) => file.name.split('.').pop()?.toLowerCase()

const normalizeCell = (value: unknown) =>
  String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()

const normalizeHeader = (value: unknown) => normalizeCell(value).toLowerCase()

const normalizeTitle = (value: string) => normalizeCell(value).toLowerCase()

const createColumnIndexMap = (headers: string[]) =>
  new Map(headers.map((header, index) => [header, index]))

const validateFileMeta = (file: File | null) => {
  if (!file) {
    return 'Выберите файл для импорта.'
  }

  const extension = getFileExtension(file)
  const isAllowedExtension = PROGRAM_IMPORT_ALLOWED_EXTENSIONS.some((item) => item === extension)

  if (!isAllowedExtension) {
    return 'Загрузите файл в формате CSV, XLS или XLSX.'
  }

  if (file.size > PROGRAM_IMPORT_MAX_SIZE_MB * bytesInMegabyte) {
    return `Файл должен быть до ${PROGRAM_IMPORT_MAX_SIZE_MB} МБ.`
  }

  return null
}

const readProgramImportRows = async (file: File) => {
  try {
    const { read, utils } = await import('xlsx')
    const extension = getFileExtension(file)
    const workbook =
      extension === 'csv'
        ? read(await file.text(), { type: 'string' })
        : read(await file.arrayBuffer(), { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]

    if (!firstSheetName) {
      return {
        rows: [],
        error: 'В файле нет листов с данными.',
      }
    }

    const sheet = workbook.Sheets[firstSheetName]
    const rows = utils
      .sheet_to_json<unknown[]>(sheet, {
        blankrows: false,
        defval: '',
        header: 1,
        raw: false,
      })
      .map((row) => row.map(normalizeCell))
      .filter((row) => row.some(Boolean))

    return { rows, error: null }
  } catch {
    return {
      rows: [],
      error: 'Не удалось прочитать файл. Проверьте формат и повторите попытку.',
    }
  }
}

const validateProgramImportRows = (rows: string[][]) => {
  const headers = rows[0]?.map(normalizeHeader) || []

  if (!headers.length) {
    return 'Файл пустой.'
  }

  const columnIndexMap = createColumnIndexMap(headers)
  const missingColumns = PROGRAM_IMPORT_COLUMNS.filter((column) => !columnIndexMap.has(column))

  if (missingColumns.length) {
    return `В файле не хватает колонок: ${missingColumns.join(', ')}.`
  }

  if (rows.length < 2) {
    return 'В файле должен быть хотя бы один курс.'
  }

  const courseTitles = new Set<string>()
  const rowsToCheck: Array<{
    rowNumber: number
    title: string
    normalizedTitle: string
    prerequisiteTitles: string[]
  }> = []

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex]
    const rowNumber = rowIndex + 1
    const rowValues = Object.fromEntries(
      PROGRAM_IMPORT_COLUMNS.map((column) => [column, row[columnIndexMap.get(column) ?? -1] || '']),
    )
    const parsedRow = importCourseRowSchema.safeParse(rowValues)

    if (!parsedRow.success) {
      return `В строке ${rowNumber} ${parsedRow.error.issues[0]?.message || 'некорректные данные'}.`
    }

    const title = parsedRow.data.course_title
    const normalizedTitle = normalizeTitle(title)

    if (courseTitles.has(normalizedTitle)) {
      return `Курс "${title}" дублируется в файле.`
    }

    courseTitles.add(normalizedTitle)

    rowsToCheck.push({
      rowNumber,
      title,
      normalizedTitle,
      prerequisiteTitles: (parsedRow.data.prerequisite_titles || '')
        .split('|')
        .map(normalizeCell)
        .filter(Boolean),
    })
  }

  for (const row of rowsToCheck) {
    const duplicatedPrerequisites = new Set<string>()

    for (const prerequisiteTitle of row.prerequisiteTitles) {
      const normalizedPrerequisiteTitle = normalizeTitle(prerequisiteTitle)

      if (normalizedPrerequisiteTitle === row.normalizedTitle) {
        return `В строке ${row.rowNumber} курс "${row.title}" не может быть пререквизитом самого себя.`
      }

      if (duplicatedPrerequisites.has(normalizedPrerequisiteTitle)) {
        return `В строке ${row.rowNumber} пререквизит "${prerequisiteTitle}" повторяется.`
      }

      if (!courseTitles.has(normalizedPrerequisiteTitle)) {
        return `Пререквизит "${prerequisiteTitle}" должен быть отдельной строкой в файле.`
      }

      duplicatedPrerequisites.add(normalizedPrerequisiteTitle)
    }
  }

  return null
}

export const validateProgramImportFile = async (file: File | null) => {
  const metaError = validateFileMeta(file)

  if (metaError || !file) {
    return metaError
  }

  const { rows, error } = await readProgramImportRows(file)

  if (error) {
    return error
  }

  return validateProgramImportRows(rows)
}

import type { Program } from '@/entities/program'
import { createProgramImportFormData } from './createProgramImportFormData'
import type { ImportProgramValues } from '../model/validation'

interface ImportProgramFromFileParams {
  values: ImportProgramValues
  file: File
}

interface ImportProgramFromFileResult {
  program: Program
}

const submitProgramImport = async (formData: FormData): Promise<ImportProgramFromFileResult> => {
  if (!formData.get('file')) {
    throw new Error('Файл для импорта не выбран.')
  }

  throw new Error('Импорт Excel/CSV пока недоступен: backend endpoint еще не подключен.')
}

export const importProgramFromFile = async ({
  values,
  file,
}: ImportProgramFromFileParams): Promise<ImportProgramFromFileResult> => {
  const formData = createProgramImportFormData({ values, file })

  return submitProgramImport(formData)
}

import { Roles, useUserState, useUserStore } from '@/entities/user'
import { useProgramsActions, useProgramsStore } from '@/features/programs'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { FormModal } from '@/shared/ui/FormModal'
import { InputField } from '@/shared/ui/InputField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { UploadOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import type { ChangeEventHandler } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { importProgramFromFile } from '../lib/importProgramFromFile'
import { validateProgramImportFile } from '../lib/validateProgramImportFile'
import {
  PROGRAM_IMPORT_ACCEPT,
  PROGRAM_IMPORT_COLUMNS,
  PROGRAM_IMPORT_EXAMPLE_ROWS,
} from '../model/constants'
import { importProgramSchema, type ImportProgramValues } from '../model/validation'
import styles from './ImportProgramButton.module.css'

interface ImportProgramButtonProps {
  children?: string
  className?: string
}

type FileStatus = 'success' | 'error' | null

export const ImportProgramButton = ({ className, children }: ImportProgramButtonProps) => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const { resetCatalog } = useProgramsStore(useShallow(useProgramsActions))
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [fileStatus, setFileStatus] = useState<FileStatus>(null)
  const { control, handleSubmit, reset } = useForm<ImportProgramValues>({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(importProgramSchema),
  })

  const canImport = user?.role === Roles.TEACHER || user?.role === Roles.ADMIN

  if (!canImport) {
    return null
  }

  const resetState = () => {
    reset()
    setFile(null)
    setFileError(null)
    setFileStatus(null)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    resetState()
    setIsOpen(false)
  }

  const validateSelectedFile = async (selectedFile: File | null, shouldNotify = false) => {
    const validationError = await validateProgramImportFile(selectedFile)

    setFileError(validationError)
    setFileStatus(validationError ? 'error' : selectedFile ? 'success' : null)

    if (shouldNotify) {
      if (validationError) {
        notifyError('Файл не подходит', validationError)
      } else {
        notifySuccess('Файл готов к импорту', 'Можно создавать программу.')
      }
    }

    return !validationError
  }

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selectedFile = event.target.files?.[0] || null

    setFile(selectedFile)
    setFileStatus(null)
    validateSelectedFile(selectedFile, Boolean(selectedFile))
  }

  const onSubmit = async (values: ImportProgramValues) => {
    const isFileValid = await validateSelectedFile(file)

    if (!isFileValid || !file) {
      return
    }

    setIsSubmitting(true)

    try {
      const { program } = await importProgramFromFile({ values, file })

      notifySuccess('Программа импортирована', 'Открываю страницу программы.')
      resetCatalog()
      resetState()
      setIsOpen(false)
      navigate(`${ROUTES.PROGRAMS}/${program.id}`)
    } catch (error) {
      notifyError(
        'Не удалось импортировать программу',
        getErrorMessage(error, 'Проверьте файл и повторите попытку.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={className}>
        <Button
          className={styles.button}
          color="default"
          disabled={isSubmitting}
          htmlType="button"
          icon={<UploadOutlined />}
          variant="solid"
          onClick={handleOpen}
        >
          {children || 'Импорт Excel/CSV'}
        </Button>
      </div>

      <FormModal
        description="Укажите метаинформацию программы и приложите CSV или Excel-файл со списком курсов. После проверки на сервере новая программа откроется автоматически."
        eyebrow="Импорт программы"
        isSubmitting={isSubmitting}
        open={isOpen}
        submitIcon={<UploadOutlined />}
        submitLabel="Импортировать"
        title="Создать программу из файла"
        onCancel={handleClose}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          control={control}
          name="title"
          placeholder="Название программы"
          title="Название"
          disabled={isSubmitting}
        />

        <TextAreaField
          control={control}
          name="description"
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Например: программа для изучения базовых дисциплин, импортированная из учебного плана"
          title="Описание"
          disabled={isSubmitting}
        />

        <div className={styles.fileField}>
          <span className={styles.fileTitle}>Файл</span>

          <div
            className={clsx(
              styles.fileControl,
              fileStatus === 'success' && styles.fileControlSuccess,
              fileStatus === 'error' && styles.fileControlError,
              isSubmitting && styles.fileControlDisabled,
            )}
          >
            <span className={styles.fileName}>{file?.name || 'Выберите CSV или Excel-файл'}</span>
            <span className={styles.fileMeta}>CSV, XLS, XLSX</span>
            <input
              accept={PROGRAM_IMPORT_ACCEPT}
              className={styles.fileInput}
              disabled={isSubmitting}
              key={file?.name || 'empty-file'}
              type="file"
              onChange={handleFileChange}
            />
          </div>

          <p className={styles.fileHint}>Колонки файла: {PROGRAM_IMPORT_COLUMNS.join(', ')}.</p>
          {fileError ? <span className={styles.fileError}>{fileError}</span> : null}
        </div>

        <div className={styles.csvFormat}>
          <span className={styles.csvFormatTitle}>Формат файла</span>
          <div className={styles.csvTableWrapper}>
            <table className={styles.csvTable}>
              <thead>
                <tr>
                  {PROGRAM_IMPORT_COLUMNS.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROGRAM_IMPORT_EXAMPLE_ROWS.map((row) => (
                  <tr key={row.course_title}>
                    {PROGRAM_IMPORT_COLUMNS.map((column) => (
                      <td key={column}>{row[column] || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FormModal>
    </>
  )
}

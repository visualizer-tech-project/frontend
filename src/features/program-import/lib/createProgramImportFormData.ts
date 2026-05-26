import type { ImportProgramValues } from '../model/validation'

interface CreateProgramImportFormDataParams {
  values: ImportProgramValues
  file: File
}

export const createProgramImportFormData = ({
  values,
  file,
}: CreateProgramImportFormDataParams) => {
  const formData = new FormData()
  const description = values.description?.trim()

  formData.append('title', values.title.trim())

  if (description) {
    formData.append('description', description)
  }

  formData.append('file', file)

  return formData
}

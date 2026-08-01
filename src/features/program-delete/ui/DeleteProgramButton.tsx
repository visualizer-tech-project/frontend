import type { Program } from '@/entities/program'
import { Roles, useUserState, useUserStore } from '@/entities/user'
import { useProgramsActions, useProgramsStore } from '@/features/programs'
import { deleteProgramApiV1ProgramsProgramIdDelete } from '@/shared/api/generated'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { DeleteOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import { useState, type MouseEvent } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './DeleteProgramButton.module.css'

interface DeleteProgramButtonProps {
  program: Program
}

export const DeleteProgramButton = ({ program }: DeleteProgramButtonProps) => {
  const { user } = useUserStore(useShallow(useUserState))
  const { resetCatalog } = useProgramsStore(useShallow(useProgramsActions))
  const [isDeleting, setIsDeleting] = useState(false)
  const canDelete = user?.role === Roles.ADMIN || program.user_id === user?.id

  if (!canDelete) {
    return null
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      if (!program.id) {
        throw new Error('Не удалось определить программу для удаления.')
      }

      const { error } = await deleteProgramApiV1ProgramsProgramIdDelete({
        path: {
          program_id: program.id,
        },
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Не удалось удалить программу.'))
      }

      setIsDeleting(false)
      resetCatalog()
      notifySuccess('Программа удалена', 'Она больше не отображается в каталоге.')
    } catch (error) {
      setIsDeleting(false)
      notifyError(
        'Не удалось удалить программу',
        getErrorMessage(error, 'Попробуйте повторить позже.'),
      )
    }
  }

  const stopCardEvent = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  return (
    <Popconfirm
      title="Удалить программу?"
      description="Это действие нельзя отменить."
      classNames={{
        root: 'edumap-delete-popconfirm',
        container: 'edumap-delete-popconfirm__container',
      }}
      overlayClassName="edumap-delete-popconfirm"
      placement="topRight"
      trigger="click"
      okText="Удалить"
      cancelText="Отмена"
      okButtonProps={{ danger: true, loading: isDeleting }}
      onConfirm={handleDelete}
    >
      <Button
        className={styles.deleteButton}
        aria-label="Удалить программу"
        color="danger"
        disabled={isDeleting}
        htmlType="button"
        icon={<DeleteOutlined />}
        loading={isDeleting}
        shape="circle"
        title="Удалить программу"
        variant="solid"
        onClick={stopCardEvent}
      />
    </Popconfirm>
  )
}

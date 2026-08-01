import type { CareerTrack } from '@/entities/track'
import { Roles, useUserState, useUserStore } from '@/entities/user'
import { useTracksActions, useTracksStore } from '@/features/tracks'
import { deleteTrackApiV1CareerTracksTrackIdDelete } from '@/shared/api/generated'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { DeleteOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import { useState, type MouseEvent } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './DeleteTrackButton.module.css'

interface DeleteTrackButtonProps {
  track: CareerTrack
}

export const DeleteTrackButton = ({ track }: DeleteTrackButtonProps) => {
  const { user } = useUserStore(useShallow(useUserState))
  const { resetCatalog } = useTracksStore(useShallow(useTracksActions))
  const [isDeleting, setIsDeleting] = useState(false)
  const canDelete = user?.role === Roles.ADMIN || track.user_id === user?.id

  if (!canDelete) {
    return null
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      if (!track.id) {
        throw new Error('Не удалось определить трек для удаления.')
      }

      const { error } = await deleteTrackApiV1CareerTracksTrackIdDelete({
        path: {
          track_id: track.id,
        },
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Не удалось удалить трек.'))
      }

      setIsDeleting(false)
      resetCatalog()
      notifySuccess('Трек удален', 'Он больше не отображается в каталоге.')
    } catch (error) {
      setIsDeleting(false)
      notifyError('Не удалось удалить трек', getErrorMessage(error, 'Попробуйте повторить позже.'))
    }
  }

  const stopCardEvent = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  return (
    <Popconfirm
      title="Удалить трек?"
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
        aria-label="Удалить трек"
        color="danger"
        disabled={isDeleting}
        htmlType="button"
        icon={<DeleteOutlined />}
        loading={isDeleting}
        shape="circle"
        title="Удалить трек"
        variant="solid"
        onClick={stopCardEvent}
      />
    </Popconfirm>
  )
}

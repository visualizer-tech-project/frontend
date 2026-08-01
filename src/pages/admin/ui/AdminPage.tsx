import { roleLabels, Roles, useUserActions, useUserState, useUserStore } from '@/entities/user'
import {
  getUsersApiV1UsersGet,
  escalateUserRoleApiV1UsersUserIdEscalatePost,
  type AccountStatus,
  type UserPublic,
  type UserRole,
} from '@/shared/api/generated'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { SelectField } from '@/shared/ui/SelectField'
import { ReloadOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'
import styles from './AdminPage.module.css'

type RoleFilter = UserRole | 'all'

interface AdminFiltersFormValues {
  roleFilter: RoleFilter
}

interface UserRoleFormValues {
  role: UserRole
}

const ROLE_OPTIONS = [
  { label: roleLabels[Roles.STUDENT], value: Roles.STUDENT },
  { label: roleLabels[Roles.TEACHER], value: Roles.TEACHER },
  { label: roleLabels[Roles.ADMIN], value: Roles.ADMIN },
]

const ROLE_FILTER_OPTIONS = [{ label: 'Все роли', value: 'all' }, ...ROLE_OPTIONS]

const statusLabels: Record<AccountStatus, string> = {
  blocked: 'Заблокирован',
  confirmed: 'Подтвержден',
  created: 'Создан',
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))

interface UserRoleSelectProps {
  disabled: boolean
  user: UserPublic
  onRoleChange: (user: UserPublic, role: UserRole) => void
}

const UserRoleSelect = ({ disabled, onRoleChange, user }: UserRoleSelectProps) => {
  const { control, reset } = useForm<UserRoleFormValues>({
    defaultValues: {
      role: user.role ?? Roles.STUDENT,
    },
  })

  useEffect(() => {
    reset({
      role: user.role ?? Roles.STUDENT,
    })
  }, [reset, user.role])

  return (
    <SelectField<UserRoleFormValues, UserRole>
      className={styles.roleSelect}
      control={control}
      disabled={disabled}
      loading={disabled}
      name="role"
      options={ROLE_OPTIONS}
      prefix={<UserSwitchOutlined />}
      onChange={(role) => onRoleChange(user, role)}
    />
  )
}

export const AdminPage = () => {
  const { user: currentUser } = useUserStore(useShallow(useUserState))
  const { setUser } = useUserStore(useShallow(useUserActions))
  const [users, setUsers] = useState<UserPublic[]>([])
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [loading, setLoading] = useState(true)
  const [updatingUserIds, setUpdatingUserIds] = useState<number[]>([])
  const { control: filterControl } = useForm<AdminFiltersFormValues>({
    defaultValues: {
      roleFilter: 'all',
    },
  })

  const visibleUsers = useMemo(
    () => (roleFilter === 'all' ? users : users.filter((user) => user.role === roleFilter)),
    [roleFilter, users],
  )
  const stats = useMemo(
    () => ({
      admin: users.filter((user) => user.role === Roles.ADMIN).length,
      student: users.filter((user) => user.role === Roles.STUDENT).length,
      teacher: users.filter((user) => user.role === Roles.TEACHER).length,
      total: users.length,
    }),
    [users],
  )

  const loadUsers = async () => {
    setLoading(true)

    try {
      const { data, error } = await getUsersApiV1UsersGet({
        query: {
          limit: 100,
        },
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Не удалось загрузить пользователей.'))
      }

      setUsers(data ?? [])
    } catch (error) {
      notifyError(
        'Не удалось загрузить пользователей',
        getErrorMessage(error, 'Попробуйте обновить страницу.'),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleRoleChange = async (targetUser: UserPublic, role: UserRole) => {
    const targetUserId = targetUser.id

    if (!targetUserId) {
      notifyError('Не удалось назначить роль', 'Не удалось определить пользователя.')
      return
    }

    if (targetUser.role === role) {
      return
    }

    setUpdatingUserIds((current) =>
      current.includes(targetUserId) ? current : [...current, targetUserId],
    )

    try {
      const { data, error } = await escalateUserRoleApiV1UsersUserIdEscalatePost({
        path: {
          user_id: targetUserId,
        },
        body: {
          role_name: role,
        },
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Не удалось назначить роль.'))
      }

      if (!data) {
        throw new Error('Роль назначена, но профиль не обновился.')
      }

      setUsers((current) => current.map((user) => (user.id === data.id ? data : user)))

      if (currentUser?.id === data.id) {
        setUser(data)
      }

      notifySuccess('Роль обновлена', `${data.email}: ${roleLabels[data.role ?? role]}.`)
    } catch (error) {
      notifyError(
        'Не удалось назначить роль',
        getErrorMessage(error, 'Проверьте права администратора и повторите попытку.'),
      )
    } finally {
      setUpdatingUserIds((current) => current.filter((id) => id !== targetUserId))
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Администрирование</p>
            <h1 className={styles.title}>Пользователи</h1>
          </div>

          <div className={styles.toolbar}>
            <SelectField<AdminFiltersFormValues, RoleFilter>
              className={styles.roleFilter}
              control={filterControl}
              name="roleFilter"
              options={ROLE_FILTER_OPTIONS}
              onChange={setRoleFilter}
            />
            <Button
              className={styles.refreshButton}
              color="default"
              htmlType="button"
              icon={<ReloadOutlined />}
              loading={loading}
              size="small"
              variant="solid"
              onClick={loadUsers}
            >
              Обновить
            </Button>
          </div>
        </header>

        <section className={styles.stats} aria-label="Статистика пользователей">
          <div className={styles.stat}>
            <span>Всего</span>
            <strong>{stats.total}</strong>
          </div>
          <div className={styles.stat}>
            <span>Студенты</span>
            <strong>{stats.student}</strong>
          </div>
          <div className={styles.stat}>
            <span>Преподаватели</span>
            <strong>{stats.teacher}</strong>
          </div>
          <div className={styles.stat}>
            <span>Администраторы</span>
            <strong>{stats.admin}</strong>
          </div>
        </section>

        <section className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Создан</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id ?? user.email}>
                  <td>
                    <div className={styles.userCell}>
                      <strong>
                        {user.first_name} {user.last_name}
                      </strong>
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <UserRoleSelect
                      disabled={Boolean(user.id && updatingUserIds.includes(user.id))}
                      user={user}
                      onRoleChange={handleRoleChange}
                    />
                  </td>
                  <td>
                    <span className={styles.status}>
                      {statusLabels[user.status ?? 'created']}
                    </span>
                  </td>
                  <td className={styles.muted}>
                    {user.created_at ? formatDate(user.created_at) : 'Дата неизвестна'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && visibleUsers.length === 0 ? (
            <div className={styles.empty}>Пользователи не найдены.</div>
          ) : null}
        </section>
      </div>
    </main>
  )
}

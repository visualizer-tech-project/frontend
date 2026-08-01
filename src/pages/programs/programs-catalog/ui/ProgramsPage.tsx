import { Roles, useUserState, useUserStore } from '@/entities/user'
import { CreateProgramButton } from '@/features/program-create'
import { ImportProgramButton } from '@/features/program-import'
import { useProgramsActions, useProgramsState, useProgramsStore } from '@/features/programs'
import { getProgramsApiV1ProgramsGet } from '@/shared/api/generated'
import { getErrorMessage, notifyError } from '@/shared/lib/notify'
import { PageHero } from '@/widgets/page-hero'
import { ProgramsGrid } from '@/widgets/programs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './ProgramsPage.module.css'

export const ProgramsPage = () => {
  const { user } = useUserStore(useShallow(useUserState))
  const {
    items: programs,
    isFullyLoaded,
    limit,
    loadedCount,
    searchValue,
    totalCount,
  } = useProgramsStore(useShallow(useProgramsState))
  const { appendItems, replaceItems } = useProgramsStore(useShallow(useProgramsActions))
  const [isProgramsLoading, setIsProgramsLoading] = useState(programs.length === 0)
  const [isMoreLoading, setIsMoreLoading] = useState(false)
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue)
  const [hasLoadFailed, setHasLoadFailed] = useState(false)
  const activeProgramsRequestKeyRef = useRef<string | null>(null)
  const isLoadErrorNotificationShownRef = useRef(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [searchValue])

  const loadPrograms = useCallback(
    async (skip: number, search = debouncedSearchValue) => {
      const normalizedSearch = search.trim()
      const requestKey = `${skip}:${normalizedSearch}`

      if (activeProgramsRequestKeyRef.current === requestKey) {
        return
      }

      activeProgramsRequestKeyRef.current = requestKey
      const isInitialLoading = skip === 0
      setIsProgramsLoading(isInitialLoading)
      setIsMoreLoading(!isInitialLoading)

      try {
        const { data, error } = await getProgramsApiV1ProgramsGet({
          query: {
            limit,
            skip,
            title: normalizedSearch || undefined,
          },
        })

        if (error) {
          throw new Error(getErrorMessage(error, 'Не удалось загрузить программы.'))
        }

        const items = data?.items ?? []
        const nextTotalCount = items.length < limit ? skip + items.length : (data?.info.total ?? 0)

        if (isInitialLoading) {
          replaceItems(items, nextTotalCount)
        } else {
          appendItems(items, nextTotalCount)
        }

        setHasLoadFailed(false)
        isLoadErrorNotificationShownRef.current = false
      } catch (error) {
        setHasLoadFailed(true)
        if (isInitialLoading) {
          replaceItems([], 0)
        }

        if (!isLoadErrorNotificationShownRef.current) {
          notifyError(
            'Не удалось загрузить программы',
            getErrorMessage(error, 'Попробуйте обновить страницу.'),
          )
          isLoadErrorNotificationShownRef.current = true
        }
      } finally {
        if (activeProgramsRequestKeyRef.current === requestKey) {
          activeProgramsRequestKeyRef.current = null
        }
        setIsProgramsLoading(false)
        setIsMoreLoading(false)
      }
    },
    [appendItems, debouncedSearchValue, limit, replaceItems],
  )

  useEffect(() => {
    loadPrograms(0, debouncedSearchValue)
  }, [debouncedSearchValue, loadPrograms])

  const hasMorePrograms =
    !hasLoadFailed && !isFullyLoaded && loadedCount >= limit && programs.length >= limit

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <PageHero
          description="Выбирайте направление, сравнивайте формат обучения и открывайте граф программы, чтобы увидеть структуру дисциплин и связи между ними."
          eyebrow="Каталог программ"
          title="Образовательные программы"
        >
          {user?.role === Roles.TEACHER || user?.role === Roles.ADMIN ? (
            <div className={styles.heroActions}>
              <CreateProgramButton>Создать программу</CreateProgramButton>
              <ImportProgramButton>Импорт Excel/CSV</ImportProgramButton>
            </div>
          ) : null}
        </PageHero>

        <section className={styles.catalog} aria-labelledby="programs-title">
          <div className={styles.catalogHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Список</p>
              <h2 id="programs-title" className={styles.sectionTitle}>
                Все программы
              </h2>
            </div>
            <p>
              Поиск работает по названию программы и использует параметры API.
            </p>
          </div>

          <ProgramsGrid
            actionLabel="Открыть граф"
            programs={programs}
            isLoading={isProgramsLoading}
            isMoreLoading={isMoreLoading}
            loadedCount={loadedCount}
            totalCount={totalCount}
            hasMore={hasMorePrograms}
            onLoadMore={() => loadPrograms(loadedCount)}
          />
        </section>
      </div>
    </section>
  )
}

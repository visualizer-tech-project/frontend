import clsx from 'clsx'
import type { ReactNode } from 'react'
import styles from './CatalogList.module.css'

interface CatalogListProps<T> {
  items: T[]
  className?: string
  emptyTitle?: string
  emptyDescription?: string
  renderItem: (item: T) => ReactNode
  getKey: (item: T) => string | number
  isLoading?: boolean
  loadingItems?: number
}

export const CatalogList = <T,>({
  items,
  className,
  emptyTitle = 'Ничего не найдено',
  emptyDescription = 'Попробуйте изменить параметры поиска.',
  renderItem,
  getKey,
  isLoading = false,
  loadingItems = 6,
}: CatalogListProps<T>) => {
  return (
    <div className={clsx(styles.root, className)}>
      {isLoading ? (
        <div className={styles.grid} aria-busy="true" aria-label="Загрузка списка">
          {Array.from({ length: loadingItems }).map((_, index) => (
            <div className={styles.skeletonCard} key={index}>
              <div className={styles.skeletonMeta}>
                <span />
                <span />
              </div>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
              <div className={styles.skeletonButton} />
            </div>
          ))}
        </div>
      ) : items.length ? (
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={getKey(item)}>{renderItem(item)}</div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
        </div>
      )}
    </div>
  )
}

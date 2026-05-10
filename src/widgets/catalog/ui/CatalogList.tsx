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
}

export const CatalogList = <T,>({
  items,
  className,
  emptyTitle = 'Ничего не найдено',
  emptyDescription = 'Попробуйте изменить параметры поиска.',
  renderItem,
  getKey,
}: CatalogListProps<T>) => {
  return (
    <div className={clsx(styles.root, className)}>
      {items.length ? (
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

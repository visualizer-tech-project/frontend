import { useUserStore } from '@/entities/user'
import { CourseSuggestionForm } from '@/features/course-suggestion'
import styles from './CourseSuggestionPage.module.css'

export const CourseSuggestionPage = () => {
  const user = useUserStore((state) => state.user)
  const userKey = user ? String(user.id ?? user.email) : ''

  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Предложить курс</h1>
        {user && <CourseSuggestionForm key={userKey} userId={userKey} email={user.email} />}
      </div>
    </section>
  )
}

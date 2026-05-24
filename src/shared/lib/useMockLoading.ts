import { useEffect, useState, type DependencyList } from 'react'
import { wait } from './wait'

const DEFAULT_MOCK_LOADING_DELAY_MS = 450

// АНАЛОГИЧНО wait.ts
export const useMockLoading = (
  dependencies: DependencyList = [],
  delayMs = DEFAULT_MOCK_LOADING_DELAY_MS,
) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)

    wait(delayMs).then(() => {
      if (isMounted) {
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, dependencies)

  return isLoading
}

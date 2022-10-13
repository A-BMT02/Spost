import { useEffect, DependencyList } from 'react'

export function useDebounceEffect(
  fn: any,
  waitTime: any,
  deps: any,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}

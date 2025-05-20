// src/hooks/useDebounce.ts
import { ref, watch } from 'vue'

// 防抖hook
export const useDebounce = <T>(value: T, delay: number = 300) => {
  const debouncedValue = ref<T>(value as T)

  let timeout: ReturnType<typeof setTimeout> | null = null

  watch(() => value, () => {
    if (timeout)
      clearTimeout(timeout)

    timeout = setTimeout(() => {
      debouncedValue.value = value
    }, delay)
  })

  return debouncedValue
}

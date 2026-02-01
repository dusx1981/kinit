export const setStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('localStorage set error:', e)
  }
}

export const getStorage = <T = any>(key: string, defaultValue?: T): T | undefined => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.error('localStorage get error:', e)
    return defaultValue
  }
}

export const removeStorage = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error('localStorage remove error:', e)
  }
}

export const clearStorage = () => {
  try {
    localStorage.clear()
  } catch (e) {
    console.error('localStorage clear error:', e)
  }
}

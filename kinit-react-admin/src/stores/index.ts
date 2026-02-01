import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  roles: string[]
  permissions?: string[]
  deptId?: string
  deptName?: string
}

interface UserState {
  token: string | null
  userInfo: UserInfo | null
  isLogin: boolean
  setToken: (token: string | null) => void
  setUserInfo: (userInfo: UserInfo | null) => void
  clearUserInfo: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      isLogin: false,
      setToken: (token) => set({ token, isLogin: !!token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      clearUserInfo: () => set({ token: null, userInfo: null, isLogin: false }),
    }),
    {
      name: 'user-storage',
    }
  )
)

interface AppState {
  collapsed: boolean
  theme: 'light' | 'dark'
  primaryColor: string
  language: 'zh-CN' | 'en-US'
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setPrimaryColor: (color: string) => void
  setLanguage: (language: 'zh-CN' | 'en-US') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      collapsed: false,
      theme: 'light',
      primaryColor: '#1890ff',
      language: 'zh-CN',
      setCollapsed: (collapsed) => set({ collapsed }),
      toggleCollapsed: () => set({ collapsed: !get().collapsed }),
      setTheme: (theme) => set({ theme }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'app-storage',
    }
  )
)

interface TabState {
  activeKey: string
  tabs: Array<{
    key: string
    label: string
    path: string
    closable?: boolean
  }>
  addTab: (tab: { key: string; label: string; path: string; closable?: boolean }) => void
  removeTab: (key: string) => void
  setActiveKey: (key: string) => void
  clearTabs: () => void
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      activeKey: '',
      tabs: [],
      addTab: (tab) => {
        const { tabs } = get()
        if (!tabs.find((t) => t.key === tab.key)) {
          set({ tabs: [...tabs, tab] })
        }
        set({ activeKey: tab.key })
      },
      removeTab: (key) => {
        const { tabs, activeKey } = get()
        const newTabs = tabs.filter((t) => t.key !== key)
        if (activeKey === key && newTabs.length > 0) {
          set({ activeKey: newTabs[newTabs.length - 1].key, tabs: newTabs })
        } else {
          set({ tabs: newTabs })
        }
      },
      setActiveKey: (key) => set({ activeKey: key }),
      clearTabs: () => set({ tabs: [], activeKey: '' }),
    }),
    {
      name: 'tab-storage',
    }
  )
)

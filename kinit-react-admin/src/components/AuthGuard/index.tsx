import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { message } from 'antd'
import { useUserStore } from '@/stores'
import { usePermission } from '@/hooks/usePermission'

interface AuthGuardProps {
  children: React.ReactNode
  /**
   * 是否需要登录
   */
  requireAuth?: boolean
  /**
   * 需要的权限
   */
  requiredPermission?: string[]
  /**
   * 需要的角色
   */
  requiredRole?: string[]
}

/**
 * 路由权限守卫组件
 * 用于保护路由，检查登录状态和权限
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requiredPermission,
  requiredRole,
}) => {
  const location = useLocation()
  const { isLogin } = useUserStore()
  const { hasAnyPermission, hasAnyRole, isSuperAdmin } = usePermission()

  // 检查登录状态
  if (requireAuth && !isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 检查权限
  if (requireAuth && requiredPermission && requiredPermission.length > 0) {
    if (!isSuperAdmin() && !hasAnyPermission(requiredPermission)) {
      message.error('您没有权限访问该页面')
      return <Navigate to="/403" replace />
    }
  }

  // 检查角色
  if (requireAuth && requiredRole && requiredRole.length > 0) {
    if (!isSuperAdmin() && !hasAnyRole(requiredRole)) {
      message.error('您的角色无法访问该页面')
      return <Navigate to="/403" replace />
    }
  }

  // 已登录用户访问登录页，重定向到首页
  if (!requireAuth && isLogin) {
    return <Navigate to="/dashboard/workplace" replace />
  }

  return <>{children}</>
}

interface RouteGuardProps {
  children: React.ReactNode
}

/**
 * 全局路由守卫
 * 用于处理页面标题、进度条等全局逻辑
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    // 设置页面标题
    const routeTitles: Record<string, string> = {
      '/login': '登录',
      '/dashboard/workplace': '工作台',
      '/dashboard/analysis': '分析页',
      '/dashboard/map': '地图',
      '/system/user': '用户管理',
      '/system/role': '角色管理',
      '/system/dept': '部门管理',
      '/system/menu': '菜单管理',
      '/reset': '重置密码',
    }

    const title = routeTitles[location.pathname] || 'Kinit React Admin'
    document.title = title ? `${title} - Kinit React Admin` : 'Kinit React Admin'
  }, [location])

  return <>{children}</>
}

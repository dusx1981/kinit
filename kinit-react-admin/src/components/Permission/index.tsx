import React from 'react'
import { usePermission } from '@/hooks/usePermission'

interface PermissionGuardProps {
  /**
   * 需要的权限，满足任意一个即可
   */
  required?: string[]
  /**
   * 需要的角色，满足任意一个即可
   */
  roles?: string[]
  /**
   * 无权限时的显示内容
   */
  fallback?: React.ReactNode
  /**
   * 是否全部匹配（默认是任意匹配）
   */
  allMatch?: boolean
  children: React.ReactNode
}

/**
 * 权限守卫组件
 * 根据权限控制子组件的显示
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  required,
  roles,
  fallback = null,
  allMatch = false,
  children,
}) => {
  const { hasAnyPermission, hasAllPermissions, hasAnyRole, isSuperAdmin } = usePermission()

  // 超级管理员直接通过
  if (isSuperAdmin()) {
    return <>{children}</>
  }

  let hasAuth = true

  // 检查权限
  if (required && required.length > 0) {
    hasAuth = allMatch ? hasAllPermissions(required) : hasAnyPermission(required)
  }

  // 检查角色
  if (hasAuth && roles && roles.length > 0) {
    hasAuth = hasAnyRole(roles)
  }

  if (!hasAuth) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface AuthButtonProps extends PermissionGuardProps {
  /**
   * 按钮点击事件
   */
  onClick?: () => void
  /**
   * 自定义按钮组件
   */
  component?: React.ReactElement
}

/**
 * 权限按钮组件
 * 包裹按钮，根据权限控制显示
 */
export const AuthButton: React.FC<AuthButtonProps> = ({
  required,
  roles,
  fallback = null,
  allMatch = false,
  onClick,
  component,
  children,
}) => {
  const { hasAnyPermission, hasAllPermissions, hasAnyRole, isSuperAdmin } = usePermission()

  // 超级管理员直接通过
  if (isSuperAdmin()) {
    if (component) {
      return React.cloneElement(component, { onClick })
    }
    return <span onClick={onClick}>{children}</span>
  }

  let hasAuth = true

  if (required && required.length > 0) {
    hasAuth = allMatch ? hasAllPermissions(required) : hasAnyPermission(required)
  }

  if (hasAuth && roles && roles.length > 0) {
    hasAuth = hasAnyRole(roles)
  }

  if (!hasAuth) {
    return <>{fallback}</>
  }

  if (component) {
    return React.cloneElement(component, { onClick })
  }

  return <span onClick={onClick}>{children}</span>
}

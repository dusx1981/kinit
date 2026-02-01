import { useMemo } from 'react'
import { useUserStore } from '@/stores'

/**
 * 权限控制 Hook
 * 提供权限检查、角色检查等功能
 */
export const usePermission = () => {
  const { userInfo } = useUserStore()

  // 获取当前用户的权限列表
  const permissions = useMemo(() => {
    return userInfo?.permissions || []
  }, [userInfo])

  // 获取当前用户的角色列表
  const roles = useMemo(() => {
    return userInfo?.roles || []
  }, [userInfo])

  /**
   * 检查是否有指定权限
   * @param permission 权限标识
   * @returns boolean
   */
  const hasPermission = (permission: string): boolean => {
    // 超级管理员拥有所有权限
    if (roles.includes('super_admin') || permissions.includes('*')) {
      return true
    }
    return permissions.includes(permission)
  }

  /**
   * 检查是否有任意一个权限
   * @param permissionList 权限列表
   * @returns boolean
   */
  const hasAnyPermission = (permissionList: string[]): boolean => {
    if (roles.includes('super_admin') || permissions.includes('*')) {
      return true
    }
    return permissionList.some((p) => permissions.includes(p))
  }

  /**
   * 检查是否拥有所有权限
   * @param permissionList 权限列表
   * @returns boolean
   */
  const hasAllPermissions = (permissionList: string[]): boolean => {
    if (roles.includes('super_admin') || permissions.includes('*')) {
      return true
    }
    return permissionList.every((p) => permissions.includes(p))
  }

  /**
   * 检查是否有指定角色
   * @param role 角色编码
   * @returns boolean
   */
  const hasRole = (role: string): boolean => {
    return roles.includes(role)
  }

  /**
   * 检查是否有任意一个角色
   * @param roleList 角色列表
   * @returns boolean
   */
  const hasAnyRole = (roleList: string[]): boolean => {
    return roleList.some((r) => roles.includes(r))
  }

  /**
   * 检查是否是超级管理员
   * @returns boolean
   */
  const isSuperAdmin = (): boolean => {
    return roles.includes('super_admin')
  }

  return {
    permissions,
    roles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
  }
}

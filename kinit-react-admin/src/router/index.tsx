import { RouteObject, Navigate } from 'react-router-dom'
import { AuthGuard } from '@/components/AuthGuard'
import { BasicLayout } from '@/layouts/BasicLayout'
import { Login } from '@/views/Login'
import { Workplace } from '@/views/Dashboard/Workplace'
import { Analysis } from '@/views/Dashboard/Analysis'
import { MapPage } from '@/views/Dashboard/Map'
import { UserManage } from '@/views/System/UserManage'
import { DeptManage } from '@/views/System/DeptManage'
import { RoleManage } from '@/views/System/RoleManage'
import { MenuManage } from '@/views/System/MenuManage'
import { Reset } from '@/views/Reset'
import { Error404 } from '@/views/Error/404'
import { Error403 } from '@/views/Error/403'
import { Error500 } from '@/views/Error/500'

// 包装组件，添加权限守卫
const withAuth = (
  component: React.ReactNode,
  options?: {
    requireAuth?: boolean
    requiredPermission?: string[]
    requiredRole?: string[]
  }
) => {
  const { requireAuth = true, requiredPermission, requiredRole } = options || {}
  return (
    <AuthGuard
      requireAuth={requireAuth}
      requiredPermission={requiredPermission}
      requiredRole={requiredRole}
    >
      {component}
    </AuthGuard>
  )
}

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: withAuth(<Login />, { requireAuth: false }),
  },
  {
    path: '/',
    element: withAuth(<BasicLayout />),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard/workplace" replace />,
      },
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            element: <Navigate to="/dashboard/workplace" replace />,
          },
          {
            path: 'workplace',
            element: <Workplace />,
          },
          {
            path: 'analysis',
            element: <Analysis />,
          },
          {
            path: 'map',
            element: <MapPage />,
          },
        ],
      },
      {
        path: 'system',
        children: [
          {
            path: '',
            element: <Navigate to="/system/user" replace />,
          },
          {
            path: 'user',
            element: withAuth(<UserManage />, {
              requiredPermission: ['user:view', 'system:user'],
            }),
          },
          {
            path: 'role',
            element: withAuth(<RoleManage />, {
              requiredPermission: ['role:view', 'system:role'],
            }),
          },
          {
            path: 'dept',
            element: withAuth(<DeptManage />, {
              requiredPermission: ['dept:view', 'system:dept'],
            }),
          },
          {
            path: 'menu',
            element: withAuth(<MenuManage />, {
              requiredPermission: ['menu:view', 'system:menu'],
            }),
          },
        ],
      },
      {
        path: 'reset',
        element: <Reset />,
      },
    ],
  },
  {
    path: '/404',
    element: <Error404 />,
  },
  {
    path: '/403',
    element: <Error403 />,
  },
  {
    path: '/500',
    element: <Error500 />,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]

import { get, post, put, del } from '@/utils/request'
import type { Department, DepartmentFormData, DeptQueryParams } from '@/types/dept'

export const deptApi = {
  // 获取部门树
  getDeptTree: (params?: DeptQueryParams) => {
    return get<Department[]>('/dept/tree', { params })
  },

  // 获取部门列表
  getDeptList: (params?: DeptQueryParams) => {
    return get<Department[]>('/dept/list', { params })
  },

  // 获取部门详情
  getDeptDetail: (id: string) => {
    return get<Department>(`/dept/${id}`)
  },

  // 创建部门
  createDept: (data: DepartmentFormData) => {
    return post<Department>('/dept', data)
  },

  // 更新部门
  updateDept: (id: string, data: DepartmentFormData) => {
    return put<Department>(`/dept/${id}`, data)
  },

  // 删除部门
  deleteDept: (id: string) => {
    return del(`/dept/${id}`)
  },

  // 批量删除部门
  batchDeleteDept: (ids: string[]) => {
    return post('/dept/batch-delete', { ids })
  },

  // 修改部门状态
  changeDeptStatus: (id: string, status: 0 | 1) => {
    return put(`/dept/${id}/status`, { status })
  },
}

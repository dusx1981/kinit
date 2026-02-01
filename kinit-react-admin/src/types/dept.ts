// 部门管理相关类型定义

export interface Department {
  id: string
  name: string
  code: string
  parentId: string | null
  sort: number
  status: 0 | 1
  leader?: string
  phone?: string
  email?: string
  remark?: string
  createTime: string
  updateTime: string
  children?: Department[]
}

export interface DepartmentFormData {
  id?: string
  name: string
  code: string
  parentId?: string
  sort: number
  status: 0 | 1
  leader?: string
  phone?: string
  email?: string
  remark?: string
}

export interface DeptQueryParams {
  keyword?: string
  status?: number
}

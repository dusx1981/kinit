import { get, post, put, del } from '@/utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userInfo: {
    id: string;
    username: string;
    nickname: string;
    avatar?: string;
    email?: string;
    phone?: string;
    roles: string[];
  };
}

export const loginApi = {
  // 账号密码登录
  login: (params: LoginParams) => {
    return post<LoginResult>('/auth/login', params);
  },

  // 手机号登录
  loginByMobile: (mobile: string, code: string) => {
    return post<LoginResult>('/auth/login/mobile', { mobile, code });
  },

  // 登出
  logout: () => {
    return post('/auth/logout');
  },

  // 获取用户信息
  getUserInfo: () => {
    return get<LoginResult['userInfo']>('/auth/info');
  },

  // 刷新token
  refreshToken: () => {
    return post<{ token: string }>('/auth/refresh');
  },
};

export const userApi = {
  // 获取用户列表
  getUserList: (params?: { page?: number; pageSize?: number; keyword?: string }) => {
    return get<{ list: any[]; total: number }>('/user/list', { params });
  },

  // 创建用户
  createUser: (data: any) => {
    return post('/user', data);
  },

  // 更新用户
  updateUser: (id: string, data: any) => {
    return put(`/user/${id}`, data);
  },

  // 删除用户
  deleteUser: (id: string) => {
    return del(`/user/${id}`);
  },
};

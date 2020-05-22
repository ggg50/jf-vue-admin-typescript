import request from '@/utils/request'
import { ILogin } from '@/types/api/'

export const getCaptcha = () =>
  request({
    url: '/sys/login/getCaptchaImg',
    method: 'get',
  })

export const login = (data: ILogin) =>
  request({
    url: '/users/login',
    method: 'post',
    data: {
      loginName: data.username,
      password: data.password,
      verificationId: data.captchaId,
      verificationCode: data.captchaCode,
    }
  })

export const getUserInfoAndMenu = () =>
  request({
    url: '/sys/menu/views',
    method: 'get',
  })

export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params
  })

export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })

import faker from 'faker'
import { Response, Request } from 'express'
import { IUserData } from '../src/api/types'

const userList: IUserData[] = [
  {
    id: 0,
    username: 'admin',
    password: 'any',
    name: 'Super Admin',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am a super administrator',
    email: 'admin@test.com',
    phone: '1234567890',
    roles: ['admin'],
  },
  {
    id: 1,
    username: 'editor',
    password: 'any',
    name: 'Normal Editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am an editor',
    email: 'editor@test.com',
    phone: '1234567890',
    roles: ['editor'],
  }
]
const userCount = 100

for (let i = 2; i < userCount; i++) {
  userList.push({
    id: i,
    username: 'user_' + faker.random.alphaNumeric(9),
    password: faker.random.alphaNumeric(20),
    name: faker.name.findName(),
    avatar: faker.image.imageUrl(),
    introduction: faker.lorem.sentence(20),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    roles: ['visitor']
  })
}

export const getCaptcha = (req: Request, res: Response) => {
  return res.json({
    code: 'HCOM1000',
    data: {
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAAAtCAIAAABAqjw4AAAC7klEQVR42u2cO04DMRBA98BQ0VFEQqKgoUKi5wBwRRMpUrRa2+P5e8bZlQtINok9z/N3spXHuD5eL/cxvHNhOWzlvDqb44F4B1zt+/PvYThQfyD9DrXaGrYP8sey50GQ92AviVzoSvZhSnNswW1aE+ryWm4XQGyYz5441x7O06rr8377+ukN+E5S/sOAfUDuKa+nl796LJWPNUnXLJv7oHezrl/3xMx4Nl/+3VPrPcsebLvIwBn20FVhkJP2/eX7cz9U5EnjDUC9PnUIBa2RO/BuKi6wOqSiY0RUM8YgH4oUW1/D8AZyA3Xks2APhUuy7T359BQaqeiAVHV4D415b2ES3m5xGSDH+kFeHLfXDQAqhjdMnVA/B5BjnHcPLQP5ROVubtzDI5Lw7UYU0FE88iZ1P96KMZp1ZI7R0Rr8/V9JqrbH2dxbJN41dVp/rIkcH5kLc3G3eioJ2IHK9Q82714ovn9/ZLjem2ca3gB450gNo0a6vCUmne+/m4mZf9ptbdhVCmfNcI9kzOXbQoF3reI83uqKHp/3cNV4inN430hTeRsZ9hT6DWfGQXkjy23OVj2FfpdWf/rkvTLveu2HMktE3gVRXi2IsxbAZl+Y95AisrQ+gXeZfVnkYw68mzgT6PeSvItGP3vYa0nGmx2Zx4etouJ2vEmeXlO/3YgCR9iMPlfIe/jykzetiDa9+S18raT3BTdMrfIxZ6PtfwCZreLyZqid8/bgbXRY0RM5qZAg5w2zjM4bU1paBrk8sEfyZr//hqyrsBsk2VUf74xVjiQH4h0k5w5IXff8ucr5Nb49D07a2Tz0vl+iOI3JvONfETyC7hzqoExOOiJvttQWQ37omGnBXod3BOTqE7AIZtfhvSRydeqZ/LfDd9KK+4/14H81SmViyeI1H+RTagPIYpRwVltAovDpFzfkGPnabQi4HMmmni8fQ65TlwQgfTcboGJyUubfU5AD5ieR6LLWWyKE4iQXc/JOj7wk7Pb+A6YULrSBDYqZAAAAAElFTkSuQmCC',
      verificationId: '315085140499890176'
    },
    msg: '处理成功！'
  })
}

export const register = (req: Request, res: Response) => {
  return res.json({
    code: 'HCOM1000'
  })
}

export const login = (req: Request, res: Response) => {
  return res.json({
    code: 'HCOM1000',
    data: {
      token: '1589858171459_315085224239169536'
    },
    msg: '处理成功！'
  })
}

// export const login = (req: Request, res: Response) => {
//   const { username } = req.body // 可以获取 request 里面的东西。
//   for (const user of userList) {
//     if (user.username === username) {
//       return res.json({
//         code: 'HCOM1000',
//         msg: '处理成功！',
//         data: {
//           token: username + '-token'
//         },
//       })
//     }
//   }
//   return res.status(400).json({
//     code: 'HCOM9999',
//     msg: 'Invalid User'
//   })
// }

export const logout = (req: Request, res: Response) => {
  return res.json({
    code: 'HCOM1000'
  })
}

export const getUsers = (req: Request, res: Response) => {
  const { name } = req.query
  const users = userList.filter(user => {
    const lowerCaseName = user.name.toLowerCase()
    return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
  })
  return res.json({
    code: 'HCOM1000',
    data: {
      items: users
    }
  })
}

export const getUserInfo = (req: Request, res: Response) => {
  // Mock data based on access token
  return res.json({
    code: 'HCOM1000',
    data: {
      user: req.header('token') === 'admin-token' ? userList[0] : userList[1]
    }
  })
}

export const getUserByName = (req: Request, res: Response) => {
  const { username } = req.params
  for (const user of userList) {
    if (user.username === username) {
      return res.json({
        code: 'HCOM1000',
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 'HCOM9999',
    msg: 'Invalid User'
  })
}

export const updateUser = (req: Request, res: Response) => {
  const { username } = req.params
  const { user } = req.body
  for (const v of userList) {
    if (v.username === username) {
      return res.json({
        code: 'HCOM1000',
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 'HCOM9999',
    msg: 'Invalid User'
  })
}

export const deleteUser = (req: Request, res: Response) => {
  return res.json({
    code: 'HCOM1000'
  })
}

export const getUserMenu = (req: Request, res: Response) => {
  return res.json({
    code: 'HCOM1000',
    data: {
      roles: [
        {
          createTime: 1500440400000,
          createUser: '1',
          roleDesc: '系统管理员',
          roleId: '13',
          roleLevel: 1,
          roleName: 'system',
          roleSence: 'soa'
        },
        {
          createTime: 1500440400000,
          createUser: '1',
          roleDesc: '高级管理权限',
          roleId: '1',
          roleLevel: 9,
          roleName: 'admin',
          roleSence: 'soa'
        }
      ],
      menus: [
        {
          depath: 2,
          funcIds: '1,2,3',
          functions: [
            {
              funcBg: 'btn btn-success',
              funcCode: 'add',
              funcIcon: 'fa fa-plus-circle fz',
              funcName: '创建',
              funcSign: 'sys',
              id: '1'
            },
            {
              funcBg: 'btn btn-danger',
              funcCode: 'del',
              funcIcon: 'fa fa-trash',
              funcName: '删除',
              funcSign: 'sys',
              id: '3'
            }
          ],
          isLeaf: 1,
          isVisible: 0,
          mclass: '',
          menuCode: 100200,
          menuIcon: 'fa-square',
          menuId: '100',
          menuIsopen: 0,
          menuName: '资产融资',
          menuOrder: 4003,
          menuSence: 'soa',
          menuType: 'normal',
          menuUrl: '/soa/baseinfo/assetFinancing/index',
          parentId: '91',
          status: ''
        },
        {
          depath: 1,
          functions: [
            {
              funcBg: 'btn btn-success',
              funcCode: 'add',
              funcIcon: 'fa fa-plus-circle fz',
              funcName: '创建',
              funcSign: 'sys',
              id: '1'
            },
            {
              funcBg: 'btn btn-warning',
              funcCode: 'edit',
              funcIcon: 'glyphicon glyphicon-pencil',
              funcName: '修改',
              funcSign: 'sys',
              id: '2'
            }
          ],
          isLeaf: 0,
          isVisible: 0,
          menuCode: 200000,
          menuIcon: 'fa-square',
          menuId: '2',
          menuIsopen: 0,
          menuName: '系统管理',
          menuOrder: 7000,
          menuSence: 'soa',
          menuType: 'normal',
          menuUrl: '',
          parentId: '0'
        }
      ],
      user: {
        birthDay: 1218171600000,
        createTime: 1472619600000,
        createUser: '1',
        email: '121282134@qq.com',
        lastLoginTime: 1514308446000,
        loginName: 'admin',
        nickName: '管理员',
        password: 'f6fdffe48c908deb0f4c3bd36c032e72',
        phone: '13300001234',
        sex: 0,
        state: 0,
        userId: '1'
      }
    },
    msg: '处理成功！'
  })
}

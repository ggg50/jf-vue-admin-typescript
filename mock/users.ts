import faker from 'faker'
import { Response, Request } from 'express'
import { IUserData } from '../src/api/types'
import { userInfoAndMenuData, captchaData } from './testData'

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
    data: captchaData,
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

export const getUserInfoAndMenu = (req: Request, res: Response) => {
  return res.json({
    code: 'HCOM1000',
    data: userInfoAndMenuData,
    msg: '处理成功！'
  })
}

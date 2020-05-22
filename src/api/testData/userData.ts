export const userInfoAndMenuData = {
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
    phone: '13300001234',
    sex: 0,
    state: 0,
    userId: '1'
  }
}

export const roleItem = userInfoAndMenuData.roles[0]
export const menuItem = userInfoAndMenuData.menus[0]
export const action = menuItem.functions[0]
export const userBaseInfo = userInfoAndMenuData.user

export const captchaData = {
  base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAAAtCAIAAABAqjw4AAAC7klEQVR42u2cO04DMRBA98BQ0VFEQqKgoUKi5wBwRRMpUrRa2+P5e8bZlQtINok9z/N3spXHuD5eL/cxvHNhOWzlvDqb44F4B1zt+/PvYThQfyD9DrXaGrYP8sey50GQ92AviVzoSvZhSnNswW1aE+ryWm4XQGyYz5441x7O06rr8377+ukN+E5S/sOAfUDuKa+nl796LJWPNUnXLJv7oHezrl/3xMx4Nl/+3VPrPcsebLvIwBn20FVhkJP2/eX7cz9U5EnjDUC9PnUIBa2RO/BuKi6wOqSiY0RUM8YgH4oUW1/D8AZyA3Xks2APhUuy7T359BQaqeiAVHV4D415b2ES3m5xGSDH+kFeHLfXDQAqhjdMnVA/B5BjnHcPLQP5ROVubtzDI5Lw7UYU0FE88iZ1P96KMZp1ZI7R0Rr8/V9JqrbH2dxbJN41dVp/rIkcH5kLc3G3eioJ2IHK9Q82714ovn9/ZLjem2ca3gB450gNo0a6vCUmne+/m4mZf9ptbdhVCmfNcI9kzOXbQoF3reI83uqKHp/3cNV4inN430hTeRsZ9hT6DWfGQXkjy23OVj2FfpdWf/rkvTLveu2HMktE3gVRXi2IsxbAZl+Y95AisrQ+gXeZfVnkYw68mzgT6PeSvItGP3vYa0nGmx2Zx4etouJ2vEmeXlO/3YgCR9iMPlfIe/jykzetiDa9+S18raT3BTdMrfIxZ6PtfwCZreLyZqid8/bgbXRY0RM5qZAg5w2zjM4bU1paBrk8sEfyZr//hqyrsBsk2VUf74xVjiQH4h0k5w5IXff8ucr5Nb49D07a2Tz0vl+iOI3JvONfETyC7hzqoExOOiJvttQWQ37omGnBXod3BOTqE7AIZtfhvSRydeqZ/LfDd9KK+4/14H81SmViyeI1H+RTagPIYpRwVltAovDpFzfkGPnabQi4HMmmni8fQ65TlwQgfTcboGJyUubfU5AD5ieR6LLWWyKE4iQXc/JOj7wk7Pb+A6YULrSBDYqZAAAAAElFTkSuQmCC',
  verificationId: '315085140499890176'
}

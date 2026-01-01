export const discoverMenuTree = {
  message: '',
  data: [
    {
      id: 21,
      parent_id: null,
      url: '/discover/recommend',
      name: '推荐',
      icon: 'icon-recommend'
    }
  ],
  children: []
}

// 系统菜单树
export const systemMenuTree = {
  message: '',
  data: [
    {
      id: 1,
      parent_id: null,
      url: '/home',
      name: '首页',
      icon: 'icon-home'
    },
    {
      id: 2,
      parent_id: null,
      url: '/discover',
      name: '发现音乐',
      icon: 'icon-discover',
      children: discoverMenuTree.data
    },
    {
      id: 3,
      parent_id: null,
      url: '/my-music',
      name: '我的音乐',
      icon: 'icon-mymusic'
    },
    {
      id: 4,
      parent_id: null,
      url: '/follow',
      name: '关注',
      icon: 'icon-follow'
    },
    {
      id: 5,
      parent_id: null,
      url: '/musician',
      name: '音乐人',
      icon: 'icon-musician'
    },
    {
      id: 6,
      parent_id: null,
      url: '/login',
      name: '登录',
      icon: 'icon-login'
    }
  ]
}

// 转换为驼峰命名
function toCamelCase(str) {
  return str
    .trim() // 去除首尾空格
    .split(/[-_]+/) // 分隔符可以是一个或多个 '-' 或 '_'
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}
// 使用 import.meta.glob 预先获取所有组件引用
// 匹配规则：views 下的所有 index.vue
const modules = import.meta.glob('../views/**/index.vue')
// const modules = {
//   '../views/Home/index.vue': () => import('../views/Home/index.vue'),
//   '../views/Login/index.vue': () => import('../views/Login/index.vue'),
//   // ...
// }
// 辅助函数，用于动态导入组件
function importComponent(path) {
  // 转换路径以匹配 glob 的 key
  // 规则：URL路径 -> 大驼峰文件夹路径
  // 例如:
  // /home -> ../views/Home/index.vue
  // /my-music -> ../views/MyMusic/index.vue
  // /my-music/prodetail -> ../views/MyMusic/Prodetail/index.vue

  // 1. 去掉开头的 /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  // 2. 分割路径并转换为大驼峰
  const parts = cleanPath.split('/').map(part => toCamelCase(part))
  // 3. 重新拼接路径
  const camelPath = parts.join('/')

  const key = `../views/${camelPath}/index.vue`
  if (!modules[key]) {
    console.error(`未找到组件: ${key}，请确保文件存在`)
    // 返回一个简单的占位组件，防止路由崩溃
    return () =>
      Promise.resolve({
        default: { template: `<div>Component not found: ${key}</div>` }
      })
  }
  return modules[key]
}

// 生成路由
export function generateRoutesFromList(list) {
  const allRoutes = []

  // 递归处理函数
  const processItem = item => {
    // 使用完整路径生成唯一名称，防止不同模块下有同名子页面导致冲突
    // 例如: /my-music/playlist -> MyMusicPlaylist
    const componentName = toCamelCase(item.url.replace(/\//g, '-'))

    const route = {
      path: item.url,
      name: componentName,
      component: importComponent(item.url),
      meta: {
        title: item.name,
        icon: item.icon
      }
    }

    allRoutes.push(route)

    // 如果有子菜单，递归处理
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => processItem(child))
    }
  }

  list.forEach(item => processItem(item))
  return allRoutes
}
export const allRoutes = generateRoutesFromList(systemMenuTree.data)

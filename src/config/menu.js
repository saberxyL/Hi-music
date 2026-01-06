// 页面类型枚举
export const PageEnum = {
  STANDALONE: 'standalone', // 纯独立页面
  EMBEDDED: 'embedded', // 嵌入子页面
  TAB: 'tab', // 标签页子页面
  FULLSCREEN: 'fullscreen' // 全屏专用页
}

// 发现音乐菜单树
export const discoverMenuTree = {
  message: '',
  data: [
    {
      id: 21,
      parent_id: null,
      url: '/discover/hot-list',
      name: '热门歌单',
      icon: 'icon-hot-list',
      pageType: PageEnum.EMBEDDED
    },
    {
      id: 22,
      parent_id: null,
      url: '/discover/singer',
      name: '歌手',
      icon: 'icon-singer',
      pageType: PageEnum.EMBEDDED
    }
  ]
}

// 系统菜单树
export const systemMenuTree = {
  message: '',
  data: [
    {
      id: 0,
      parent_id: null,
      url: '/layout',
      name: '布局页',
      icon: 'icon-layout',
      pageType: PageEnum.STANDALONE,
      playerShow: false
    },
    {
      id: 1,
      parent_id: null,
      url: '/home',
      name: '首页',
      icon: 'icon-home',
      pageType: PageEnum.EMBEDDED
    },
    {
      id: 2,
      parent_id: null,
      url: '/login',
      name: '登录',
      icon: 'icon-login',
      pageType: PageEnum.STANDALONE,
      playerShow: false
    },
    {
      id: 3,
      parent_id: null,
      url: '/settings',
      name: '设置',
      icon: 'icon-settings',
      pageType: PageEnum.STANDALONE,
      playerShow: false
    },
    {
      id: 4,
      parent_id: null,
      url: '/discover',
      name: '发现音乐',
      icon: 'icon-discover',
      pageType: PageEnum.EMBEDDED,
      children: discoverMenuTree.data
    },
    {
      id: 5,
      parent_id: null,
      url: '/toplist',
      name: '排行榜',
      icon: 'icon-toplist',
      pageType: PageEnum.EMBEDDED
    },
    {
      id: 6,
      parent_id: null,
      url: '/recent-play',
      name: '最近播放',
      icon: 'icon-recent-play',
      pageType: PageEnum.EMBEDDED
    },
    {
      id: 7,
      parent_id: null,
      url: '/user-center',
      name: '个人中心',
      icon: 'icon-user-center',
      pageType: PageEnum.STANDALONE,
      playerShow: false
    },
    {
      id: 8,
      parent_id: null,
      url: '/music-player',
      name: '音乐播放器',
      icon: 'icon-music-player',
      pageType: PageEnum.FULLSCREEN,
      playerShow: false
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
        icon: item.icon,
        pageType: item.pageType || PageEnum.EMBEDDED, // 默认为 EMBEDDED
        playerShow: item.playerShow === false ? item.playerShow : true // 默认为显示播放器
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

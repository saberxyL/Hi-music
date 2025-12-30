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
      icon: 'icon-discover'
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

// 辅助函数，用于动态导入组件
function importComponent(parentPath, componentName) {
  return () => import(`@/views${parentPath}/${componentName}/index.vue`)
}

// 生成路由
export function generateRoutesFromList(list) {
  const allRoutes = []
  list.forEach(item => {
    if (item.children) {
      item.children.forEach(child => {
        const componentName = toCamelCase(child.url.slice(1)) // 去掉前面的斜杠并转换为驼峰命名
        allRoutes.push({
          path: child.url,
          name: componentName,
          component: importComponent(item.url, componentName), // 动态导入组件
          meta: {
            title: child.name,
            icon: child.icon
          }
        })
      })
    } else {
      const componentNames = toCamelCase(item.url.slice(1)) // 去掉前面的斜杠并转换为驼峰命名
      allRoutes.push({
        path: item.url,
        name: componentNames,
        // component:  () => import(`@/views/alert/${componentNames}/index.vue`), // 动态导入组件
        component: importComponent(item.url.split('-')[0], componentNames), // 动态导入组件
        meta: {
          title: item.name,
          icon: item.icon
        }
      })
    }
  })

  return allRoutes
}

export const allRoutes = generateRoutesFromList(systemMenuTree.data)

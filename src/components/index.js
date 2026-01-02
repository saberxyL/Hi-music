/**
 * 全局组件自动注册
 * 扫描当前目录下所有 .vue 文件并注册为全局组件
 */
export default {
  install(app) {
    // 获取当前目录下的所有 .vue 文件
    // eager: true 表示直接引入模块，而不是返回 import 函数
    const components = import.meta.glob('./**/*.vue', { eager: true })

    for (const [path, module] of Object.entries(components)) {
      const component = module.default

      // 获取组件名称
      // 优先使用组件内定义的 name，如果没有则使用文件名
      const fileName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
      const componentName = component.name || fileName

      // 注册全局组件
      app.component(componentName, component)
    }
  }
}

import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取当前命令行上下文路径
const currentDirectory = path.resolve(__dirname, '../')

console.log(`----------------------------`)
console.log(`正在准备打包为zip压缩文件...`)

// const distJoinPath = path.join(currentDirectory, '/zip/');
// if(!fs.existsSync(distJoinPath)) {
//     console.log(`zip文件夹不存在，准备创建...`)
//     fs.mkdir(distJoinPath, (err)=>{
//         if(err){
//             console.log('zip文件夹创建失败')
//         }else{
//             console.log('zip文件夹创建成功')
//         }
//     })
// }

// 创建文件输出流
console.log(`初始化zip文件流...`)
const distZipPath = path.join(currentDirectory, '/dist.zip')
let output = fs.createWriteStream(distZipPath)
let archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
})

// 文件输出流结束
output.on('close', function () {
  console.log('打包完成，zip文件位于当前文件夹下，文件名为dist.zip')
})

// 数据源是否耗尽
output.on('end', function () {
  console.log('数据源已耗尽')
})

// 存档警告
archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    console.warn('stat故障和其他非阻塞错误')
  } else {
    throw err
  }
})

// 存档出错
archive.on('error', function (err) {
  throw err
})

// 通过管道方法将输出流存档到文件
archive.pipe(output)

console.log(`正在将dist文件夹到zip中...`)

const distPath = path.join(currentDirectory, '/dist/')
console.log(`正在将dist文件夹到zip中...` + path.dirname(distPath))
console.log(
  `正在将dist文件夹到zip中...` +
    distPath.substr(path.dirname(distPath).length + 1)
)
//打包dist里面的所有文件和目录
archive.directory(distPath, distPath.substr(path.dirname(distPath).length + 1))

//完成归档
archive.finalize()

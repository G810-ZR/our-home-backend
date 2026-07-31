import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// 健康检查
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: '服务正常',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  })
})

// 根路径
app.get('/', (_req, res) => {
  res.json({
    name: 'our-home-backend',
    version: '1.0.0',
    description: '我们的家 - 后端服务'
  })
})

app.listen(PORT, () => {
  console.log(`🏠 我们的家后端服务已启动 → http://localhost:${PORT}`)
  console.log(`   健康检查: http://localhost:${PORT}/health`)
})

import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-pro'

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

// 对话接口
app.post('/api/chat', async (req, res) => {
  const { message } = req.body

  if (!message || !message.trim()) {
    return res.status(400).json({ error: '消息不能为空' })
  }

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API Key 未配置' })
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('DeepSeek API error:', response.status, err)
      return res.status(502).json({ error: 'AI 服务暂时不可用' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '（我沉默了……）'

    res.json({ reply })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

app.listen(PORT, () => {
  console.log(`🏠 我们的家后端服务已启动 → http://localhost:${PORT}`)
  console.log(`   对话接口: http://localhost:${PORT}/api/chat`)
})

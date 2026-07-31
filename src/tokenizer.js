/**
 * 简易 Token 估算器
 * 中文约 1 字符 ≈ 1.5 token，英文约 1 字符 ≈ 0.3 token
 * 这是一个近似值，用于触发压缩判断，不需要精确
 */

export function estimateTokens(text) {
  if (!text) return 0
  let chinese = 0
  let other = 0
  for (const c of text) {
    if (/[一-鿿　-〿＀-￯]/.test(c)) {
      chinese++
    } else {
      other++
    }
  }
  return Math.ceil(chinese * 1.5 + other * 0.3)
}

/**
 * 估算 messages 数组的总 token 数
 */
export function estimateMessageTokens(messages) {
  return messages.reduce((sum, m) => sum + estimateTokens(m.content), 0)
}

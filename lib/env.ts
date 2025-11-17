import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),

  // Supabase (optional)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

let cachedEnv: Env | null = null

/**
 * 延迟解析并缓存环境变量，避免在 Next.js 构建阶段因未注入变量而失败
 */
export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv
  }

  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('\n')

    throw new Error(`环境变量配置不正确，请检查以下项:\n${formattedErrors}`)
  }

  cachedEnv = result.data
  return cachedEnv
}

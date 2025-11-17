/**
 * Sentry 和日志测试 API Route
 *
 * 测试目的:
 * 1. 验证 Sentry 错误上报功能
 * 2. 验证结构化日志记录
 * 3. 验证敏感信息脱敏
 *
 * 使用方式:
 * - GET /api/test-sentry - 测试成功日志记录
 * - GET /api/test-sentry?error=true - 触发测试错误
 * - POST /api/test-sentry - 测试敏感信息脱敏
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import * as Sentry from '@sentry/nextjs'

/**
 * GET: 测试日志记录和错误上报
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const triggerError = searchParams.get('error') === 'true'

  try {
    // 记录正常日志
    logger.info('Test Sentry API called', {
      method: 'GET',
      path: '/api/test-sentry',
      timestamp: new Date().toISOString(),
      userId: 'test-user-123',
    })

    // 如果请求参数包含 error=true, 触发测试错误
    if (triggerError) {
      logger.warn('About to trigger test error', {
        intentional: true,
        source: '/api/test-sentry',
      })

      // 添加 Sentry 上下文信息
      Sentry.setContext('test_info', {
        test_type: 'intentional_error',
        trigger_source: 'GET /api/test-sentry?error=true',
      })

      Sentry.setTag('environment', 'test')
      Sentry.setUser({
        id: 'test-user-123',
        username: 'test_user',
      })

      // 抛出测试错误
      throw new Error('Test Sentry Error: This is an intentional test error')
    }

    // 正常响应
    return NextResponse.json(
      {
        success: true,
        message: 'Sentry test API working',
        instructions: {
          trigger_error: 'Add ?error=true to URL to test error reporting',
          test_redaction: 'Use POST method to test sensitive data redaction',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    // 记录错误日志
    logger.error('Test error occurred', error instanceof Error ? error : undefined, {
      method: 'GET',
      path: '/api/test-sentry',
    })

    // 手动上报错误到 Sentry (通常自动捕获,这里演示手动上报)
    if (error instanceof Error) {
      Sentry.captureException(error)
    }

    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error reported to Sentry. Check your Sentry dashboard.',
      },
      { status: 500 }
    )
  }
}

/**
 * POST: 测试敏感信息脱敏
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 记录包含敏感信息的日志 (应该被自动脱敏)
    logger.info('Testing sensitive data redaction', {
      user: {
        id: 'user-123',
        email: 'testuser@example.com', // 应该被脱敏
        phone: '13812345678', // 应该被脱敏
        password: 'should-never-see-this', // 应该被脱敏
        apiKey: 'sk_live_1234567890abcdef', // 应该被脱敏
      },
      request_data: body,
      timestamp: new Date().toISOString(),
    })

    // 测试 Sentry 上下文脱敏
    Sentry.setContext('sensitive_test', {
      username: 'test_user',
      email: 'test@example.com', // Sentry beforeSend 应该脱敏
      password: 'secret123', // Sentry beforeSend 应该脱敏
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Sensitive data logged. Check console/logs to verify redaction.',
        note: 'Sensitive fields (email, phone, password, apiKey) should be redacted in logs.',
        expected_redaction: {
          email: 't***@example.com',
          phone: '138****5678',
          password: '***REDACTED***',
          apiKey: 'sk_***...cdef',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Error in POST test-sentry', error instanceof Error ? error : undefined)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

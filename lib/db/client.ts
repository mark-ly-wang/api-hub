import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type {
  User,
  ApiKey,
  Api,
  ApiCall,
  Transaction,
  Membership,
  Subscription,
} from '@prisma/client'

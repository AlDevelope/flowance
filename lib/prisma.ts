import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;

function getExtendedUrl(url: string | undefined) {
  if (!url) return url;
  // Use a proper URL constructor to avoid issues with existing parameters
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('connect_timeout', '60');
    urlObj.searchParams.set('pool_timeout', '20');
    urlObj.searchParams.set('connection_limit', '10');
    urlObj.searchParams.set('socket_timeout', '60');
    return urlObj.toString();
  } catch (e) {
    // Fallback if URL is not standard
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}connect_timeout=60&pool_timeout=20&connection_limit=10&socket_timeout=60`;
  }
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: databaseUrl ? {
      db: {
        url: getExtendedUrl(databaseUrl),
      },
    } : undefined,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

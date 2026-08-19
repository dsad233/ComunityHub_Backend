import { PrismaClient } from '../../../generated/prisma/client';

export async function Transaction(
  prisma: PrismaClient,
  tx: Array<any>,
  options: Object,
): Promise<void> {
  await prisma.$transaction(tx, options);
}

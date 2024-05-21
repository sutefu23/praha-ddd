import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  console.log('seeder: run!')

  console.log('seeder: finish!')
}

export default seed()

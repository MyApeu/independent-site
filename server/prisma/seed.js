import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { DEFAULT_CATEGORIES, DEFAULT_FOOTER, DEFAULT_HOMEPAGE } from '../src/defaults.js'

const prisma = new PrismaClient()

async function main() {
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        image: category.image,
        description: category.description,
        sortOrder: category.sortOrder,
      },
      create: category,
    })
  }

  const homepage = await prisma.setting.findUnique({ where: { key: 'homepage' } })
  if (!homepage) {
    await prisma.setting.create({
      data: { key: 'homepage', value: JSON.stringify(DEFAULT_HOMEPAGE) },
    })
  }

  const footer = await prisma.setting.findUnique({ where: { key: 'footer' } })
  if (!footer) {
    await prisma.setting.create({
      data: { key: 'footer', value: JSON.stringify(DEFAULT_FOOTER) },
    })
  }

  console.log('Seed completed: categories, homepage, footer')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

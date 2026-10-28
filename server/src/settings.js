import { prisma } from './db.js'

export async function getSetting(key, fallback) {
  const row = await prisma.setting.findUnique({ where: { key } })
  if (!row) return fallback
  try {
    return JSON.parse(row.value)
  } catch {
    return fallback
  }
}

export async function setSetting(key, value) {
  const raw = JSON.stringify(value)
  await prisma.setting.upsert({
    where: { key },
    update: { value: raw },
    create: { key, value: raw },
  })
  return value
}

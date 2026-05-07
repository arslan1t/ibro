import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ORDERS_PATH = join(process.cwd(), 'orders.json')

export async function GET() {
  try {
    if (!existsSync(ORDERS_PATH)) {
      return NextResponse.json([])
    }
    const raw = readFileSync(ORDERS_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json([])
  }
}

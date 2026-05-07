import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const CONTENT_PATH = join(process.cwd(), 'content.json')

export async function GET() {
  try {
    const raw  = readFileSync(CONTENT_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    body.meta = { ...body.meta, lastUpdated: new Date().toISOString() }
    writeFileSync(CONTENT_PATH, JSON.stringify(body, null, 2), 'utf-8')
    return NextResponse.json({ success: true, lastUpdated: body.meta.lastUpdated })
  } catch (e) {
    return NextResponse.json({ error: 'Write failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync } from 'fs'
import { join } from 'path'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const slot = form.get('slot') as string | null   // e.g. "ibro", "jump", "location" …

    if (!file || !slot) {
      return NextResponse.json({ error: 'Missing file or slot' }, { status: 400 })
    }

    /* Only allow image types */
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
    }

    /* Keep original extension */
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const filename = `${slot}.${ext}`
    const dest = join(process.cwd(), 'public', 'images', filename)

    const buf = Buffer.from(await file.arrayBuffer())
    writeFileSync(dest, buf)

    return NextResponse.json({ success: true, path: `/images/${filename}` })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

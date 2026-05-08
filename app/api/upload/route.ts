import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync } from 'fs'
import { join } from 'path'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/mov']

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const slot = form.get('slot') as string | null
    const type = form.get('type') as string | null  // 'image' | 'video'

    if (!file || !slot) {
      return NextResponse.json({ error: 'Missing file or slot' }, { status: 400 })
    }

    const isImage = IMAGE_TYPES.includes(file.type) || file.type.startsWith('image/')
    const isVideo = VIDEO_TYPES.includes(file.type) || file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Only image or video files allowed' }, { status: 400 })
    }

    const ext  = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'png')
    const folder = isVideo ? 'footage' : 'images'
    const filename = `${slot}.${ext}`
    const dest = join(process.cwd(), 'public', folder, filename)

    const buf = Buffer.from(await file.arrayBuffer())
    writeFileSync(dest, buf)

    return NextResponse.json({ success: true, path: `/${folder}/${filename}` })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

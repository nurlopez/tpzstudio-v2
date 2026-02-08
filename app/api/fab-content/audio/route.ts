import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const audioQuery = groq`
  *[_type == "siteSettings"][0]{
    "audioUrl": backgroundAudio.url
  }
`

export async function GET() {
  try {
    const result = await client.fetch(audioQuery)

    if (!result?.audioUrl) {
      return NextResponse.json({ audioUrl: null })
    }

    return NextResponse.json({ audioUrl: result.audioUrl })
  } catch (error) {
    console.error('[API] Error fetching audio URL:', error)
    return NextResponse.json({ audioUrl: null })
  }
}

import {
  createPagesServerClient,
  createRouteHandlerClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@my/supabase/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get('code') as string
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    await supabase.auth.exchangeCodeForSession(String(code))
  }
  return NextResponse.redirect(requestUrl.origin)
}

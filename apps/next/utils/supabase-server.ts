import {
  createRouteHandlerClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import 'server-only'

import { NextRequest, NextResponse } from 'next/server'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { supabaseAdmin } from 'app/utils/supabase/admin'
export const UNAUTHORIZED_ERROR = NextResponse.json(
  {
    message: 'UNAUTHORIZED',
  },
  {
    status: 401,
  }
)
export async function getUser(cookie: ReadonlyRequestCookies, headers: Headers) {
  const auth = (headers.get('Authorization') as string).split('Bearer ').pop() as string
  const refresh_token = headers.get('refresh-token') as string
  const {
    data: { user },
  } = await supabaseAdmin.auth.setSession({
    access_token: auth,
    refresh_token,
  })
  if (!user) {
    return undefined
  }
  return user
}

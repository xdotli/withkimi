import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, createTRPCContext } from '@my/api'
import { NextRequest } from 'next/server'

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      return createTRPCContext(req)
    },
    onError(opts) {
      const { error, type, path, input, ctx, req } = opts
      console.error('Error:', error)
    },
  })
}

export { handler as GET, handler as POST }

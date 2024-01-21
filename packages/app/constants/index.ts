import { ENV } from './env'

export const IS_WEB = typeof window !== 'undefined'
export const IS_PROD = ENV === 'production'
export const IS_DEV = ENV === 'development'
export const IS_TEST = ENV === 'test'

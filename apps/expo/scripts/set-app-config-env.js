const dotenv = require('dotenv')
const { cleanEnv, str } = require('envalid')
const { join } = require('path')

const { version } = require('../package.json')

function setAppConfigEnv() {
  const ENV = process.env.STAGE ?? 'production'
  const IS_EAS_CI = process.env.EAS_BUILD === 'true'

  if (IS_EAS_CI) {
    dotenv.config({ path: process.env.ENV_FILE_COMMON })
    dotenv.config({ path: process.env[`ENV_FILE_${ENV.toUpperCase()}`] })
  } else {
    dotenv.config({ path: join(__dirname, '../../../', `.env.common`) }) // For common environment
    dotenv.config({ path: join(__dirname, '../../../', `.env.${ENV}`) }) // For specific environment
  }

  const validators = {
    APP_SCHEME: str(),
    NAKED_APP_HOST: str(),
    APP_HOST: str(),
    NAKED_OIA_HOST: str(),
    OIA_HOST: str(),
    SLUG: str(),
  }

  const env = cleanEnv(process.env, validators)

  const SLUG = env.SLUG
  const APP_SCHEME = env.APP_SCHEME
  const NAKED_APP_HOST = env.NAKED_APP_HOST
  const APP_HOST = env.APP_HOST
  const NAKED_OIA_HOST = env.NAKED_OIA_HOST
  const OIA_HOST = env.OIA_HOST

  const envConfig = {
    development: {
      name: 'Kimi',
      slug: SLUG,
      scheme: `${APP_SCHEME}.development`,
      // TODO
      // icon: './assets/icon.development.png',
      icon: './assets/icon.png',
      nakedAppHost: NAKED_APP_HOST,
      appHost: APP_HOST,
      nakedOIAHost: NAKED_OIA_HOST,
      oiaHost: OIA_HOST,
    },
    test: {
      name: 'Kimi',
      slug: SLUG,
      scheme: `${APP_SCHEME}.test`,
      // TODO
      // icon: './assets/icon.test.png',
      icon: './assets/icon.png',
      nakedAppHost: NAKED_APP_HOST,
      appHost: APP_HOST,
      nakedOIAHost: NAKED_OIA_HOST,
      oiaHost: OIA_HOST,
    },
    production: {
      name: 'Kimi',
      slug: SLUG,
      scheme: APP_SCHEME,
      icon: './assets/icon.png',
      nakedAppHost: NAKED_APP_HOST,
      appHost: APP_HOST,
      nakedOIAHost: NAKED_OIA_HOST,
      oiaHost: OIA_HOST,
    },
  }

  /**
   * Ignoring patch version
   * @example 1.1.1 -> 1.1.0 / 4.2.1 -> 4.2.0
   * */
  function decrementVersion(version) {
    const parts = version.split('.')
    parts[parts.length - 1] = '0'
    return parts.join('.')
  }

  return {
    version,
    appConfig: envConfig[ENV],
    decreasedVersion: decrementVersion(version),
    environment: ENV,
    IS_DEV: ENV === 'development',
    IS_TEST: ENV === 'test',
    IS_PROD: ENV === 'production',
  }
}

module.exports = setAppConfigEnv

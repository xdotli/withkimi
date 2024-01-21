const getReleasePlan = require('@changesets/get-release-plan').default
const expoPackage = require('../apps/expo/package.json')
const { cwd } = require('process')

module.exports = async () => {
  const releasePlan = await getReleasePlan(cwd())
  console.log('Release plan: ', JSON.stringify(releasePlan, null, 2))

  const release = releasePlan.releases.find((release) => release.name === expoPackage.name)

  if (!release) {
    return ''
  }

  console.log('Release info: ', release)

  return release
}

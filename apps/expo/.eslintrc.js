/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['custom'],
  ignorePatterns: ['./android', './ios'],
  env: {
    node: true,
  },
}

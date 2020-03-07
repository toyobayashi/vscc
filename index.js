const path = require('path')

const pkg = require(path.join(__dirname, './package.json'))

const paths = []
const libs = []

if (pkg.dependencies) {
  for (const key in pkg.dependencies) {
    paths.push(path.relative(__dirname, path.dirname(require.resolve(key))).replace(/\\/g, '/'))
    libs.push(path.basename(key))
  }
}

if (process.argv.slice(2)[0] === 'lib') {
  libs.forEach(lib => console.log(lib))
} else {
  paths.forEach(p => console.log(p))
}

const path = require('path')
const fs = require('fs')

const pkg = require(path.join(__dirname, './package.json'))

const paths = []
const libs = []

if (pkg.dependencies) {
  for (const key in pkg.dependencies) {
    const dir = path.dirname(require.resolve(key))
    if (fs.existsSync(path.join(dir, 'CMakeLists.txt')) || fs.existsSync(path.join(dir, 'CMakelists.txt'))) {
      paths.push(path.relative(__dirname, dir).replace(/\\/g, '/'))
      libs.push(path.basename(key))
    }
  }
}

if (process.argv.slice(2)[0] === 'lib') {
  libs.forEach(lib => console.log(lib))
} else {
  paths.forEach(p => console.log(p))
}

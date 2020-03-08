const path = require('path')
const fs = require('fs')

const pkg = require(path.join(__dirname, './package.json'))

const paths = []
const libs = []

if (pkg.dependencies) {
  for (const key in pkg.dependencies) {
    const dir = findProjectRoot(require.resolve(key))
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

function findProjectRoot (start) {
  let current = start ? path.resolve(start) : process.cwd()
  let previous = ''
  do {
    const target = path.join(current, 'package.json')
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      return current
    }
    previous = current
    current = path.dirname(current)
  } while (current !== previous)
  return ''
}

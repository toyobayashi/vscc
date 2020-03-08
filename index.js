const path = require('path')
const fs = require('fs')

const pkg = require(path.join(__dirname, './package.json'))

const paths = []

const deps = Array.from(new Set([...Object.keys(pkg.devDependencies || {}), ...Object.keys(pkg.dependencies || {})]))

deps.forEach(key => {
  let main
  try {
    main = require.resolve(key)
  } catch (_) {
    return
  }
  const dir = findProjectRoot(main)
  if (fs.existsSync(path.join(dir, 'CMakeLists.txt')) || fs.existsSync(path.join(dir, 'CMakelists.txt'))) {
    paths.push(path.relative(__dirname, dir).replace(/\\/g, '/'))
  }
})

paths.forEach(p => console.log(p))

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

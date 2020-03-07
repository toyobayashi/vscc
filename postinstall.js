const path = require('path')
const fs = require('fs-extra')

const cwd = process.cwd()

const root = findProjectRoot(cwd)

let name

if (root) {
  const pkg = path.join(root, 'package.json')
  name = fs.readJsonSync(pkg).name
  if (name) {
    name = path.basename(name)
  }
}

const copyList = [
  '.vscode',
  'cmake',
  'build.bat',
  'build.sh'
]

copyList.forEach(item => {
  fs.copySync(path.join(__dirname, item), path.join(cwd, item))
})

if (name) {
  const replaceList = [
    'build.bat',
    'build.sh'
  ]
  replaceList.forEach(item => {
    const p = path.join(cwd, item)
    fs.writeFileSync(p, fs.readFileSync(item, 'utf8').replace(/\<project_name\>/g, name), 'utf8')
  })
}

function findProjectRoot (start) {
  let current = start ? resolve(start) : process.cwd()
  let previous = ''
  do {
    const target = join(current, 'package.json')
    if (existsSync(target) && statSync(target).isFile()) {
      return current
    }
    previous = current
    current = dirname(current)
  } while (current !== previous)
  return ''
}

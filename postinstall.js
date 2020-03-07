const path = require('path')
const fs = require('fs-extra')

let cwd = process.cwd()
let wslProjectFolder = ''

if (cwd.includes(path.sep + 'node_modules')) {
  cwd = cwd.split(path.sep + 'node_modules')[0]
}

if (process.platform === 'win32') {
  wslProjectFolder = `/mnt/${cwd.split(':\\')[0].toLowerCase()}/${cwd.split(':\\')[1].replace(/\\/g, '/')}`
}
console.log(cwd)
console.log(wslProjectFolder)

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
  const p = path.join(cwd, item)
  fs.copySync(path.join(__dirname, item), p)
  if (item.endsWith('.sh')) {
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\r\n/g, name), '\n')
  }
})

if (name) {
  const replaceList = [
    'build.bat',
    'build.sh'
  ]
  replaceList.forEach(item => {
    const p = path.join(cwd, item)
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\<project_name\>/g, name), 'utf8')
  })
}

if (wslProjectFolder) {
  const p = path.join(cwd, '.vscode/settings.json')
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\<wsl_project_folder\>/g, wslProjectFolder), 'utf8')
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

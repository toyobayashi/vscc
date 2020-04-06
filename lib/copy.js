const path = require('path')
const fs = require('fs-extra')
const findProjectRoot = require('./find.js')

const getPath = (...args) => path.join(__dirname, '..', ...args)

module.exports = function copyTemplates(options) {
  let cwd = process.cwd()
  let wslProjectFolder = ''

  if (process.platform === 'win32') {
    wslProjectFolder = `/mnt/${cwd.split(':\\')[0].toLowerCase()}/${cwd.split(':\\')[1].replace(/\\/g, '/')}`
  }

  if (options && options.postinstall) {
    if (cwd.includes(path.sep + 'node_modules')) {
      cwd = cwd.split(path.sep + 'node_modules')[0]
    }
  }

  const root = findProjectRoot(cwd)

  let name

  if (root) {
    const pkg = path.join(root, 'package.json')
    name = fs.readJsonSync(pkg).name
    if (name) {
      name = path.basename(name)
    }
  }

  let copyList = []

  if (options && options.build) {
    copyList = [
      ...copyList,
      'template/cmake',
      'template/build.bat',
      'template/build.sh',
      'template/index.js',
      'template/CMakeLists.txt'
    ]
  }

  if (options && options.vscode) {
    copyList = [...copyList, 'template/.vscode']
  }

  if (options && options.source) {
    copyList = [...copyList, 'template/include', 'template/src']
  }

  const overwrite = (options && typeof options.overwrite === 'boolean') ? options.overwrite : false
  copyList.forEach(item => {
    const p = path.join(cwd, path.relative('template', item))
    fs.copySync(getPath(item), p, { overwrite })
    if (item.endsWith('.sh')) {
      fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n'), 'utf8')
    }
  })

  if (process.platform === 'win32' && options && options.vscode) {
    const findVisualStudio = require('node-gyp/lib/find-visualstudio.js')

    const replaceCPPJSON = function (info) {
      try {
        const vspath = info.path
        const winsdkver = info.sdk
        const ls = fs.readdirSync(path.join(vspath, 'VC/Tools/MSVC'))
        const clpath = path.join(vspath, 'VC/Tools/MSVC', ls[ls.length - 1], 'bin/Hostx86/x86/cl.exe')
        const cppjson = path.join(cwd, '.vscode/c_cpp_properties.json')
        if (fs.existsSync(cppjson)) fs.writeFileSync(cppjson, fs.readFileSync(p, 'utf8').replace(/\<clpath\>/g, clpath).replace(/\<winsdk\>/g, winsdkver), 'utf8')
      } catch (_) {}
    }

    findVisualStudio(process.version, '2019', function (err, info) {
      if (err) {
        findVisualStudio(process.version, '2017', function (err, info) {
          if (err) return
          replaceCPPJSON(info)
        })
      } else {
        replaceCPPJSON(info)
      }
    })
  }

  if (name) {
    const replaceList = [
      'CMakeLists.txt',
      '.vscode/launch.json'
    ]
    replaceList.forEach(item => {
      const p = path.join(cwd, item)
      if (fs.existsSync(p)) fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\<project_name\>/g, name), 'utf8')
    })

    if (options && options.source) {
      const renameList = [
        'src/bin/main.c',
        'src/test/test.cpp',
        'src/lib/vscc.c',
        'include/vscc/vscc.h',
      ]
      renameList.forEach(item => {
        const p = path.join(cwd, item)
        if (fs.existsSync(p)) fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/vscc/g, name).replace(/VSCC/g, name.toUpperCase()), 'utf8')
      })
      try {
        fs.renameSync(path.join(cwd, 'src/lib/vscc.c'), path.join(cwd, `src/lib/${name}.c`))
        fs.renameSync(path.join(cwd, 'include/vscc/vscc.h'), path.join(cwd, `include/vscc/${name}.h`))
        fs.renameSync(path.join(cwd, 'include/vscc'), path.join(cwd, `include/${name}`))
      } catch (_) {}
    }
  }

  if (wslProjectFolder) {
    const p = path.join(cwd, '.vscode/settings.json')
    if (fs.existsSync(p)) fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\<wsl_project_folder\>/g, wslProjectFolder), 'utf8')
  }
}

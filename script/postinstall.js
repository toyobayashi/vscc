const copyTemplates = require('../lib/copy.js')

copyTemplates({
  postinstall: true,
  build: true,
  source: true,
  vscode: true
})

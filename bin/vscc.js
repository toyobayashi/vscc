#!/usr/bin/env node

const copyTemplates = require('../lib/copy.js')
const CommandLine = require('./cmdline.js')

const program = new CommandLine()
const copyCommand = new CommandLine.SubCommand('gen', 'generate templates. default: build config and vscode config files')
copyCommand.addOption(CommandLine.ArgType.BOOLEAN, 'force', 'f', 'overwrite files if exists', false, false)
copyCommand.addOption(CommandLine.ArgType.BOOLEAN, 'source', 's', 'generate source templates', false, false)
copyCommand.addOption(CommandLine.ArgType.BOOLEAN, 'vscode', 'v', 'generate vscode config', false, true)
copyCommand.addOption(CommandLine.ArgType.BOOLEAN, 'build', 'b', 'generate build config', false, true)
program.addSubCommand(copyCommand)
program.addOption(CommandLine.ArgType.BOOLEAN, 'version', 'v', 'output the version number', false, false)
program.addOption(CommandLine.ArgType.BOOLEAN, 'help', 'h', 'output usage information', false, false)

function printHelp () {
  console.log(program.help())
}

async function main(argc, argv) {
  program.parse(argc, argv, true)

  if (program.get('help') || argc < 2) {
    printHelp()
    return 0
  }

  if (program.get('version')) {
    console.log(require('../package.json').version)
    return 0;
  }

  const cmd = program.getCommand()

  if (!cmd) {
    printHelp()
    return 0
  }

  if (cmd === 'gen') {
    const copyOption = {
      overwrite: program.get('force'),
      source: program.get('source'),
      vscode: program.get('vscode'),
      build: program.get('build')
    }
    await copyTemplates(copyOption)
    return 0
  }

  printHelp()
  return 0;
}

main(process.argv.length - 1, process.argv.slice(1))
  .then(code => process.exit(code))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

#!/usr/bin/env node

const copyTemplates = require('../lib/copy.js')

function printHelp () {
  console.log('Usage: vscc [options]');
  console.log('\nOptions:');
  console.log('  -v, -V, --version   output the version number');
  console.log('  -h, --help          output usage information');
  console.log('  init                copy templates');
  console.log('\nRepo: https://github.com/toyobayashi/vscc');
}

function main(argc, argv) {
  if (argc <= 2) {
    printHelp()
    return 0;
  }

  if (argv[2] === '-v' || argv[2] === '--version' || argv[2] === '-V') {
    console.log(require('../package.json').version)
    return 0;
  }

  if (argv[2] === '-h' || argv[2] === '--help') {
    printHelp()
    return 0;
  }

  if (argv[2] === 'init') {
    copyTemplates()
    return 0;
  }

  printHelp()
  return 0;
}

process.exit(main(process.argv.length, process.argv))

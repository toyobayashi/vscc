class OptionDescriptor {
  constructor (type, longname, shortname, desc, isRequired, defaultValue) {
    /** @type {number} */
    this.type = type
    /** @type {string} */
    this.longname = longname
    /** @type {string} */
    this.shortname = shortname
    /** @type {string} */
    this.desc = desc
    /** @type {boolean} */
    this.isRequired = isRequired
    /** @type {string | boolean | number} */
    this.defaultValue = defaultValue
  }
}

class Command {
  constructor () {
    /** @type {Set<string>} */
    this._longnames = new Set()
    /** @type {Set<string>} */
    this._shortnames = new Set()
    /** @type {Map<string, OptionDescriptor>} */
    this._options = new Map()
  }

  addOption(type, longname, shortname = '', desc = '', isRequired = true, defaultValue = '') {
    if (!Object.keys(CommandLine.ArgType).map(t => isNaN(Number(t)) ? t : Number(t)).includes(type)) {
      throw new TypeError('Type error.')
    }

    if (typeof longname !== 'string' || longname === '') {
      throw new TypeError('Long Name type error.')
    }

    if (typeof isRequired !== 'boolean') {
      throw new TypeError('isRequired type error.')
    }
    if (!isRequired) {
      if (type === CommandLine.ArgType.STRING && typeof defaultValue !== 'string') {
        throw new TypeError(`${longname} default value must be a string`)
      } else if (type === CommandLine.ArgType.BOOLEAN && typeof defaultValue !== 'boolean') {
        throw new TypeError(`${longname} default value must be a boolean`)
      } else if (type === CommandLine.ArgType.NUMBER && typeof defaultValue !== 'number') {
        throw new TypeError(`${longname} default value must be a number`)
      }
    }

    this._longnames.add(longname)
    if (shortname) {
      this._shortnames.add(shortname)
    }

    
    this._options.set(longname, new OptionDescriptor(type, longname, shortname, desc, isRequired, defaultValue))

    return this
  }
}

class SubCommand extends Command {
  constructor (name, desc = '') {
    super()
    /** @type {string} */
    this.name = name
    /** @type {string} */
    this.desc = desc
  }
}

class CommandLine extends Command {
  constructor () {
    super()
    /** @type {Map<string, SubCommand>} */
    this._commands = new Map()
    /** @type {string} */
    this._command = ''
    /** @type {Map<string, string | boolean | number>} */
    this._option = new Map()
    /** @type {string[]} */
    this._args = []
  }

  help (message) {
    const argv0 = process.versions.electron ? process.argv0 : process.argv[1]
    const len = 40
    const title = `Usage: ${argv0} ${this._commands.size > 0 ? '[command] ' : ''}${this._options.size > 0 ? '[options] ' : ''}...`

    const generateOptionLine = (o, indent) => {
      const front = `${(' ').repeat(indent)}${o.shortname ? '-' + o.shortname + ',' : '   '} --${o.longname} [${CommandLine.ArgType[o.type].toLowerCase()}]${o.isRequired ? ' <REQUIRED>' : (' (' + o.defaultValue + ')')}`
      const space = (' ').repeat(len - front.length)
      return `${front}${space}${o.desc}`
    }

    const generateCommandLine = (o, indent) => {
      const front = `${(' ').repeat(indent)}${o.name}`
      const space = (' ').repeat(len - front.length)
      return `${front}${space}${o.desc}`
    }

    let options = []
    if (this._options.size > 0) {
      options.push('\n\nOptions:\n')
      this._options.forEach(o => {
        options.push(generateOptionLine(o, 2))
      })
      options = options.join('\n')
    }
    
    let commands = []
    if (this._commands.size > 0) {
      commands.push('\n\nCommands:\n')
      this._commands.forEach(o => {
        commands.push(generateCommandLine(o, 2))
        if (o._options.size > 0) {
          commands.push('')
          o._options.forEach(so => {
            commands.push(generateOptionLine(so, 4))
          })
        }
      })
    }
    commands = commands.join('\n')

    return title + options + commands + (typeof message === 'string' ? '\n\n' + message : '')
  }

  /**
   * add subcommand
   * @param {SubCommand} subCommand 
   */
  addSubCommand (subCommand) {
    const name = subCommand.name
    if (this._commands.has(name)) {
      this._commands.get(name)._options.clear()
      this._commands.get(name)._longnames.clear()
      this._commands.get(name)._shortnames.clear()
      this._commands.delete(name)
    }
    this._commands.set(name, subCommand)
    return this
  }

  _setOptByLongName (command, key, value, checkInvalidArg) {
    const longnames = command ? command._longnames : this._longnames
    const options = command ? command._options : this._options
    if (longnames.has(key)) {
      const optionType = options.get(key).type
      switch (optionType) {
        case CommandLine.ArgType.STRING:
          if (typeof value === 'boolean') {
            throw new TypeError(`Invalid arg type: --${key}: ${value} (${typeof value}), require ${CommandLine.ArgType[optionType].toLowerCase()}.`)
          }
          this._option.set(key, value.toString())
          break
        case CommandLine.ArgType.BOOLEAN:
          if (value !== true && value !== false && value !== 'true' && value !== 'false' && value !== '0' && value !== '1') {
            throw new TypeError(`Invalid arg type: --${key}: ${value} (${typeof value}), require ${CommandLine.ArgType[optionType].toLowerCase()}.`)
          }
          if (value === 'false' || value === '0') {
            value = false
          }
          this._option.set(key, Boolean(value))
          break
        case CommandLine.ArgType.NUMBER:
          if (isNaN(Number(value)) || typeof value === 'boolean') {
            throw new TypeError(`Invalid arg type: --${key}: ${value} (${typeof value}), require ${CommandLine.ArgType[optionType].toLowerCase()}.`)
          }
          this._option.set(key, Number(value))
          break
        default: break
      }
    } else {
      if (checkInvalidArg) {
        throw new Error(`Invalid arg: ${key}`)
      } else {
        this._option.set(key, value)
      }
    }
  }

  _setOptByShortName (command, c, value, checkInvalidArg) {
    const shortnames = command ? command._shortnames : this._shortnames
    const longnames = command ? command._longnames : this._longnames
    const options = command ? command._options : this._options
    if (shortnames.has(c)) {
      let longname
      for (const key of longnames) {
        if (options.get(key).shortname === c) {
          longname = key
        }
      }
      if (!longname) {
        if (checkInvalidArg) {
          throw new Error(`Invalid arg: ${c}`)
        } else {
          this._setOptByLongName(command, c, value, checkInvalidArg)
        }
      }
      this._setOptByLongName(command, longname, value, checkInvalidArg)
    } else {
      if (checkInvalidArg) {
        throw new Error(`Invalid arg: ${c}`)
      } else {
        this._setOptByLongName(command, c, value, checkInvalidArg)
      }
    }
  }

  has (option) {
    return this._option.has(option)
  }

  get (option) {
    return this._option.get(option)
  }

  forEach (cb) {
    return this._option.forEach(cb)
  }

  args () {
    return this._args.slice(0)
  }

  getCommand () {
    return this._command
  }

  _checkRequired () {
    const options = this._command ? this._commands.get(this._command)._options : this._options
    for (const [longname, config] of options) {
      if (config.isRequired) {
        if (!this._option.has(longname)) {
          throw new Error(`Required: --${longname} ${config.shortname ? ('(-' + config.shortname + ') ') : ' '}[${CommandLine.ArgType[config.type].toLowerCase()}]`)
        }
      }
    }
  }

  parse (argc, argv, checkInvalidArg = false) {
    let i = 1
    let subCommand = null
    if (argv[1] && !argv[1].startsWith('-')) {
      if (this._commands.has(argv[1])) {
        this._command = argv[1]
        subCommand = this._commands.get(this._command)
        i = 2
      }
    }

    if (subCommand) {
      subCommand._options.forEach(config => {
        if (!config.isRequired) this._setOptByLongName(subCommand, config.longname, config.defaultValue, checkInvalidArg)
      })
    } else {
      this._options.forEach(config => {
        if (!config.isRequired) this._setOptByLongName(null, config.longname, config.defaultValue, checkInvalidArg)
      })
    }

    for (; i < argc; i++) {
      /** @type {string} */
      const arg = argv[i]
      if (arg.startsWith('--') && arg.length > 2) {
        const str = arg.substring(2)
        if (str.indexOf('=') !== -1) {
          const [key, value] = str.split('=')
          this._setOptByLongName(subCommand, key, value, checkInvalidArg)
        } else {
          this._setOptByLongName(subCommand, str, true, checkInvalidArg)
        }
      } else if (arg[0] === '-' && arg.length > 1 && arg[1] !== '-') {
        if (arg.length === 2) {
          // -s [nextArg]
          const nextArg = argv[i + 1]
          if (nextArg) {
            if (nextArg[0] !== '-') {
              this._setOptByShortName(subCommand, arg[1], nextArg, checkInvalidArg)
              i++
            } else {
              if (!isNaN(Number(nextArg))) {
                this._setOptByShortName(subCommand, arg[1], nextArg, checkInvalidArg)
                i++
              } else {
                this._setOptByShortName(subCommand, arg[1], true, checkInvalidArg)
              }
            }
          } else {
            this._setOptByShortName(subCommand, arg[1], true, checkInvalidArg)
          }
        } else {
          // -a9000
          const shortname = arg[1]
          const value = arg.substring(2)
          this._setOptByShortName(subCommand, shortname, value, checkInvalidArg)
        }
      } else {
        break
      }
    }

    for (; i < argc; i++) {
      const arg = argv[i]
      this._args.push(arg)
    }

    this._checkRequired()
  }
}

CommandLine.SubCommand = SubCommand

CommandLine.ArgType = {
  STRING: 0,
  0: 'STRING',
  BOOLEAN: 1,
  1: 'BOOLEAN',
  NUMBER: 2,
  2: 'NUMBER'
}

module.exports = CommandLine

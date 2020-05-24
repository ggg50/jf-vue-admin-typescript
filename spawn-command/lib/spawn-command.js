// import { _extend } from 'util'
import { spawn } from 'child_process'

export default function(command, options) {
  let file, args
  if (process.platform === 'win32') {
    file = 'cmd.exe'
    args = ['/s', '/c', '"' + command + '"']
    options = Object.assign({}, options)
    options.windowsVerbatimArguments = true
  } else {
    file = '/bin/sh'
    args = ['-c', command]
  }
  return spawn(file, args, options)
}

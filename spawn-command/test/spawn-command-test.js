import { join } from 'path'
import { equal } from 'assert'
import assertCalled from 'assert-called'
import spawnCommand from '..'

const win32 = (process.platform === 'win32')
const newln = win32 ? '\r\n' : '\n'
const grep = win32 ? 'findstr' : 'grep'
const child = spawnCommand(grep + ' commit < ' + join(__dirname, 'fixtures', 'commit'))
let stderr = ''
let stdout = ''
const exited = false

child.stdout.on('data', function(chunk) {
  stdout += chunk
})

child.stderr.on('data', function(chunk) {
  stderr += chunk
})

child.on('exit', assertCalled(function(exitCode) {
  equal(exitCode, 0)
  equal(stdout, 'commit 26b11915b1c16440468a4b5f4b07d2409b98c68c' + newln)
  equal(stderr, '')
}))

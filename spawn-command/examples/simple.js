const spawnCommand = require('../').default
const command = (process.platform === 'win32') ? 'echo "Hello spawn"' : 'echo "Hello spawn" | base64'
const child = spawnCommand(command)

child.stdout.on('data', function(data) {
  console.log('data', data.toString())
})

child.on('exit', function(exitCode) {
  console.log('exit', exitCode)
})

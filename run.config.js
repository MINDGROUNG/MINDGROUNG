module.exports = {
    apps: [{
    name: 'mindground_web',
    script: './app',
    instances: 1,
    exec_mode: 'cluster'
    }]
  }
  
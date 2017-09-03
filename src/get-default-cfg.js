// Native
const { join } = require('path')
const { homedir } = require('os')

// Packages
const { readJSON } = require('fs-extra')

module.exports = async () => {
  const config = {
    _: 'This is your Now config file. See `now config help`. More: https://git.io/v7dds'
  }

  try {
    const sh = await readJSON(join(homedir(), '.now.json'))

    delete sh.lastUpdate
    delete sh.token

    Object.assign(config, { sh })
  } catch (err) {}

  return config
}

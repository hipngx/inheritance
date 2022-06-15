const Will = artifacts.require('Will')

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock Will Token
  await deployer.deploy(Will)
  const will = await Will.deployed()
}

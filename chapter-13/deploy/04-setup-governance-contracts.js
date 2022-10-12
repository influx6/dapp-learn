import { ethers } from "hardhat"
import {
 ADDRESS_ZERO
} from "../utils/helper-hardhat-config"

const setupContracts = async function (hre) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { log } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await ethers.getContract("GovernanceToken", deployer)
  const timeLock = await ethers.getContract("TimeLock", deployer)
  const governor = await ethers.getContract("GovernorContract", deployer)

  log("----------------------------------------------------")
  log("Setting up contracts for roles...")
  // would be great to use multicall here...
  const proposerRole = await timeLock.PROPOSER_ROLE()
  const executorRole = await timeLock.EXECUTOR_ROLE()
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

  // to set this up, we will first add the proposal role to the governor, so only the governor can propose a change
  const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
  await proposerTx.wait(1)

  // then we add address zero as an executor, because we want anyone to be able to execute once the timelock as expired
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
  await executorTx.wait(1)

  // then we revoke the initial grant of admin role we gave to the deployer account.
  const revokeTx = await timeLock.revokeRole(adminRole, deployer)
  await revokeTx.wait(1)

  // Now only the timelock can own assets, process proposals and execute accepted proposals.

  // In all: no one should ever be admin for a timelock, it should never be centralized

  // Guess what? Now, anything the timelock wants to do has to go through the governance process!
}

export default setupContracts
setupContracts.tags = ["all", "setup"]

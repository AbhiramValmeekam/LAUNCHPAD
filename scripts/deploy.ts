import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SecureVault contract...");

  const SecureVault = await ethers.getContractFactory("SecureVault");
  const vault = await SecureVault.deploy();
  await vault.waitForDeployment();

  const address = await vault.getAddress();
  console.log("SecureVault deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 
# Openseal

## This is currently incomplete and a work in progress!!!

An opensea clone made with t3-app and foundry.

# Deploy Smart Contracts

To deploy smart contracts, follow these instructions:

1. First, create a file named `deployMarketplace.sh` using the provided `deployMarketplace.sh.example` file. Make sure to place it in the root directory.

2. Execute `./deployMarketplace.sh` in the terminal. This step will deploy the marketplace contract.

3. After successfully deploying the marketplace contract, you will receive a deployment confirmation message with the marketplace contract address. Copy this address (for example: `Deployed to: 0x64375d10882cba17c8c316dbB9eAc5963A2e11fB`).

4. Afterward, create a file named `deployERC721.sh` using the provided `deployERC721.sh.example` file. Make sure to place it in the root directory.

5. Do not execute this script. Open the created `deployERC721.sh` file in a text editor.

6. Locate the arguments section within the `deployERC721.sh` file. Replace the placeholder text `erc721_address_dont_remove_quotes` with the actual marketplace contract address you obtained in step 3. Save the changes to the deployERC721.sh file.

7. Finally, run `./deployERC721.sh` file in the terminal. This will deploy the ERC721 contract correctly.

By following these steps carefully, you will be able to deploy your version of smart contracts successfully.

Credits:
Dave Partner: https://github.com/davepartner/opensea-clone

- Marketplace NFT contract

T3-app https://create.t3.gg/

- Frontend development

Foundry https://github.com/foundry-rs/foundry

- Smart contract development

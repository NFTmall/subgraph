import * as https from 'https'
import * as url from 'url'
import * as fs from 'fs'
import * as path from 'path'

enum Network {
  MAINNET = 'mainnet',
  // ROPSTEN = 'ropsten',
  BSCTESTNET = 'bsctestnet',
  DEVELOPMENT = 'development',
}
enum ContractName {
  GEMToken = 'GEMToken',
  NFTmallERC721 = 'NFTmallERC721',
  MarketplaceProxy = 'MarketplaceProxy',
}
type ContractsResponse = Record<Network, Record<ContractName, string>>

const startBlockByNetwork: Record<Network, Record<ContractName, number>> = {
  [Network.MAINNET]: {
    GEMToken: 0,
    NFTmallERC721: 0,
    MarketplaceProxy: 0,
  },
  [Network.BSCTESTNET]: {
    GEMToken: 7248045,
    NFTmallERC721: 7248045,
    MarketplaceProxy: 7248045,
  },
  [Network.DEVELOPMENT]: {
    GEMToken: 0,
    NFTmallERC721: 0,
    MarketplaceProxy: 0,
  }
}

const contractNameToProxy: Record<string, ContractName> = {
  Marketplace: ContractName.MarketplaceProxy
}

// TODO: Handle ctrl+C
async function build() {
  const network = getNetwork()
  const basePath = path.resolve(__dirname, '../')

  const ethereum = new Ethereum(network)
  await ethereum.fetchContracts()

  const template = new TemplateFile(ethereum)

  await Promise.all([
    template.write(
      `${basePath}/src/data/.addresses.ts`,
      `${basePath}/src/data/addresses.ts`
    ),
    template.write(`${basePath}/.subgraph.yaml`, `${basePath}/subgraph.yaml`)
  ])
}

// ------------------------------------------------------------------
// Parser -----------------------------------------------------------

class TemplateFile {
  constructor(public ethereum: Ethereum) {}

  async write(src: string, destination: string) {
    const contents = await readFile(src)

    try {
      const newContents = new Parser(contents, this.ethereum).parse()

      await writeFile(destination, newContents)
    } catch (error) {
      await deleteFile(destination)
      throw error
    }
  }
}

class Ethereum {
  network: Network

  contractAddresses: Record<ContractName, string>
  startBlocks: Record<ContractName, number>

  constructor(network: Network) {
    this.network = network
    this.startBlocks = startBlockByNetwork[network]
  }

  async fetchContracts() {
    const contractsByNetwork: ContractsResponse = {
      "mainnet": {
        GEMToken: '0x8D05F69bd9E804EB467c7e1f2902Ecd5E41a72dA',
        NFTmallERC721: '0xF9F4F60610188D977866cf8A43e092d56D67E850', // local ganache
        MarketplaceProxy: '0xe1eb03f2163F4A713e5dFbC59f36E98Ca3770BA2',
      },
      "bsctestnet": {
        GEMToken: '0x2d25AdF1D54d59B68eC2DDc0659D4c791a09cecE',
        NFTmallERC721: '0x9cA317f9Cdb10a144f458B08ACDA11Fc53768CF0',
        MarketplaceProxy: '0x68a2d02b51799b44D7C3F0fA1fE00abb74572eD9',
      },
      "development": {
        GEMToken: '0x8D05F69bd9E804EB467c7e1f2902Ecd5E41a72dA',
        NFTmallERC721: '0xF9F4F60610188D977866cf8A43e092d56D67E850', // local ganache
        MarketplaceProxy: '0xe1eb03f2163F4A713e5dFbC59f36E98Ca3770BA2',
      },
    }
    this.contractAddresses = contractsByNetwork[this.network]
  }

  getAddress(contractName: string) {
    return (
      this.contractAddresses[this.getProxyContractName(contractName)] ||
      this.getDefaultAddress()
    )
  }

  getStartBlock(contractName: string) {
    return (
      this.startBlocks[this.getProxyContractName(contractName)] ||
      this.getDefaultStartBlock()
    )
  }

  private getProxyContractName(contractName: string) {
    return contractNameToProxy[contractName] || contractName
  }

  private getDefaultAddress() {
    return '0x0000000000000000000000000000000000000000'
  }

  private getDefaultStartBlock() {
    return 0
  }
}

class Parser {
  constructor(public text: string, public ethereum: Ethereum) {}

  parse() {
    let newText = this.replaceNetworks(this.text)
    newText = this.replaceAddresses(newText)
    newText = this.replaceStartBlocks(newText)
    return newText
  }

  replaceAddresses(text = this.text) {
    for (const placeholder of this.getPlaceholders('address')) {
      const contractName = this.getPlaceholderValue(placeholder)
      const address = this.ethereum.getAddress(contractName)
      text = text.replace(placeholder, address)
    }
    return text
  }

  replaceStartBlocks(text = this.text) {
    for (const placeholder of this.getPlaceholders('startBlock')) {
      const contractName = this.getPlaceholderValue(placeholder)
      const startBlock = this.ethereum.getStartBlock(contractName)
      text = text.replace(placeholder, startBlock.toString())
    }
    return text
  }

  replaceNetworks(text = this.text) {
    return text.replace(/{{network}}/g, this.ethereum.network)
  }

  getPlaceholders(name: string, text = this.text) {
    const regexp = new RegExp(`{{${name}\:[a-zA-Z0-9]+}}`, 'g')
    return text.match(regexp) || []
  }

  getPlaceholderValue(placeholder: string) {
    // Example: {{operator:value}}
    const [_, value] = placeholder.replace(/{|}/g, '').split(':')
    return value
  }
}

// ------------------------------------------------------------------
// HTTPS ------------------------------------------------------------

async function fetch(uri: string, method = 'GET'): Promise<any> {
  const { protocol, hostname, path } = url.parse(uri)

  if (protocol !== 'https:') {
    throw new Error('Only https is supported')
  }

  const options = {
    hostname,
    method,
    port: 443,
    path
  }
  return new Promise(function(resolve, reject) {
    const req = https.request(options, function(res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Invalid request: ${res.statusCode}`))
      }

      let body = []
      res.on('data', chunk => body.push(chunk))

      res.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString())
          resolve(body)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', err => reject(err))
    req.end()
  })
}

// ------------------------------------------------------------------
// File -------------------------------------------------------------

async function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data)
    )
  })
}

async function deleteFile(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      resolve()
    }
    fs.unlink(path, err => (err ? reject(err) : resolve()))
  })
}

async function writeFile(path: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf-8', err => (err ? reject(err) : resolve()))
  })
}

// ------------------------------------------------------------------
// Args -------------------------------------------------------------

function getNetwork() {
  let network: Network = process.env.ETHEREUM_NETWORK as Network

  if (!network) {
    for (let i = 0; i < process.argv.length; i++) {
      if (process.argv[i] === '--network') {
        network = process.argv[i + 1] as Network
        break
      }
    }
  }

  if (!network || !Object.values(Network).includes(network)) {
    throw new Error(
      "Supply a valid network using --network. Use `npm run build -- --network mainnet` if you're using npm"
    )
  }
  return network
}

build().then(() => console.log('All done'))
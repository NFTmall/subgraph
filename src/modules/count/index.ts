import { NFT, Count } from '../../../generated/schema'
import * as categories from '../category/categories'
// import * as addresses from '../../data/addresses'

export const DEFAULT_ID = 'all'

export function buildCount(): Count {
  let count = Count.load(DEFAULT_ID)

  if (count == null) {
    count = new Count(DEFAULT_ID)
    count.orderTotal = 0
    count.orderNFTmall721 = 0

    count.nftmall721Total = 0;

    count.started = 0
  }

  return count as Count
}

export function buildCountFromNFT(nft: NFT): Count {
  let category = nft.category
  // let contractAddress = nft.contractAddress.toHexString()
  let count = buildCount()

  if (category == categories.NFTMALL721) {
    count.nftmall721Total += 1
  }

  return count
}

// export function buildCountFromOrder(order: Order): Count {
//   let category = order.category
//   let count = buildCount()
//   count.orderTotal += 1

//   if (category == categories.NFTMALL721) {
//     count.orderNFTmall721 += 1
//   }
//   return count
// }

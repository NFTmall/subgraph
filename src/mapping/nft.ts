import { log } from "@graphprotocol/graph-ts";
import { NFT, Count, Transfer } from "../../generated/schema";
import {
  NFTmallERC721,
  Transfer as TransferEvent,
} from "../../generated/NFTmallERC721/NFTmallERC721";
// import * as status from '../order/status'
import {
  isMint,
  getNFTId,
  getTokenURI,
  // cancelActiveOrder,
  // clearNFTOrderProperties,
  // getFees,
} from "../modules/nft";
import { getCategory } from "../modules/category";
// import { buildEstateFromNFT, getEstateImage } from '../modules/estate'
import { buildCountFromNFT } from "../modules/count";

import { getOrCreateAccount } from "../modules/wallet";
import { toLowerCase } from "../modules/utils";
import * as categories from "../modules/category/categories";
import * as addresses from "../data/addresses";
// import * as status from '../modules/order/status'
// import { buildNFTmallERC721FromNFT, getNFTmallERC721Image } from '../modules/legacynft'

export function handleTransfer(event: TransferEvent): void {
  // log.warning('transfer params {} {} {}', [event.params.tokenId.toHexString(), event.params._from.toString(), event.params.to.toString()])
  let id = event.params.tokenId.toHexString();
  if (id == "") {
    return;
  }

  let contractAddress = event.address.toHexString();
  let category = getCategory(contractAddress);

  // TODO: later we may need use `category` as prefix
  // let id = getNFTId(
  //   category,
  //   event.address.toHexString(),
  //   event.params.tokenId.toString()
  // );

  let nft = NFT.load(id);

  if (nft == null) {
    nft = new NFT(id);
    nft.tokenId = id;
    nft.contractAddress = event.address;
    nft.category = category;
    nft.creator = event.params.to.toHexString();
    nft.tokenURI = getTokenURI(event);
    nft.createdAt = event.block.timestamp;

    let metric: Count = buildCountFromNFT(nft as NFT);
    metric.save();
  }
  nft.owner = event.params.to.toHexString()
  nft.updatedAt = event.block.timestamp
  nft.save()

  let txHash = event.transaction.hash.toHexString()
  let transfer = new Transfer(txHash)
  transfer.txHash = txHash
  transfer.tokenId = id
  transfer.from = getOrCreateAccount(event.params.from).id //event.params.from.toHexString()
  transfer.to = getOrCreateAccount(event.params.to).id
  transfer.createdAt = event.block.timestamp
  transfer.blockNumber = event.block.number
  transfer.nft = id // should be id string
  transfer.save()

  // if (isMint(event)) {
  // TODO: there might be more creators

  // TODO: get royalties
  // let a = getFees(event)
  // nft.fees = a.fees
  // nft.feeAccounts = a.feeAccounts

  // TODO: calc fees
  // let erc721 = NFTmallERC721.bind(event.address);
  // let getFeesCallResult = erc721.try_getFees(event.params.tokenId);
  // for(let i = 0; getFeesCallResult.value.length; i++) {
  //   nft.fees.push(getFeesCallResult.value.[i].value)
  //   nft.feeAccounts.push(getFeesCallResult.value[i].account);
  // }

  // TODO: for now we assume minter is creator.
  // for (let i = 0; i < nft.fees.length; i++) {
  //   if (nft.fees[i].beneficiary === nft.creator) {
  //     nft.royalty = nft.fees[i].value
  //     break;
  //   }
  // }

  // if (category == categories.NFTMALLERC721) {
  //   let legacy = buildNFTmallERC721FromNFT(nft)
  //   legacy.save()
  //   nft.name = 'Sample NFT #' + nft.tokenId.toString()
  //   nft.image = getNFTmallERC721Image(nft.id)
  //   nft.nftmallERC721 = legacy.id
  // }

  // }
  //  else {
  //   let oldNFT = NFT.load(id)
  //   if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
  //     nft = clearNFTOrderProperties(nft!)
  //   }
  // }
}

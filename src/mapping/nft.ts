import { log } from "@graphprotocol/graph-ts";
import { NFT, Count } from "../../generated/schema";
import { NFTmallERC721, Transfer } from "../../generated/NFTmallERC721/NFTmallERC721";
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

export function handleTransfer(event: Transfer): void {
  // log.warning('transfer params {} {} {}', [event.params.tokenId.toHexString(), event.params._from.toString(), event.params.to.toString()])
  if (event.params.tokenId.toString() == "") {
    return;
  }

  let contractAddress = event.address.toHexString();
  let category = getCategory(contractAddress);
  let id = getNFTId(
    category,
    event.address.toHexString(),
    event.params.tokenId.toString()
  );

  let nft = new NFT(id);

  nft.tokenId = event.params.tokenId;
  nft.owner = event.params.to.toHex();
  nft.contractAddress = event.address;
  nft.category = category;
  nft.updatedAt = event.block.timestamp;

  nft.tokenURI = getTokenURI(event);

  if (isMint(event)) {
    nft.createdAt = event.block.timestamp;
    // TODO: there might be more creators
    nft.creator = event.params.to.toHex();

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

    let metric = buildCountFromNFT(nft);
    metric.save();
  }
  //  else {
  //   let oldNFT = NFT.load(id)
  //   if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
  //     nft = clearNFTOrderProperties(nft!)
  //   }
  // }

  getOrCreateAccount(event.params.to);

  nft.save();
}

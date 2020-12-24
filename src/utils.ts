import { Deal } from "../generated/schema"
import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts/index"
import { DealType, Coefficient } from "./enum"

export function calculatePriceAndFee(deal: Deal): void {
    deal.price = calculatePrice(deal.buyAmount, deal.sellAmount, deal.type)
    deal.fee = calculateFee(deal.sellAmount, deal.price.toBigDecimal())
}

function calculatePrice(buyAmount: BigInt, sellAmount: BigInt, dealType: string): BigInt {
    if (dealType == DealType.ORDER){
        return buyAmount / sellAmount
    } else {
        return sellAmount / buyAmount
    }
}

function calculateFee(sellAmount: BigInt, price: BigDecimal): BigDecimal {
    return sellAmount.toBigDecimal() * price * BigDecimal.fromString(Coefficient.FEE)
}

export function fillServiceFields(deal: Deal, event: ethereum.Event): void {
    deal.txHash = event.transaction.hash
    deal.blockNumber = event.block.number
    deal.blockTime = event.block.timestamp
}
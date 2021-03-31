import { BigInt, Address } from '@graphprotocol/graph-ts'
import { Account } from '../../../generated/schema'

export function getOrCreateAccount(id: Address): Account {
  let account = Account.load(id.toHexString())

  if (account == null) {
    account = new Account(id.toHexString())
    account.address = id
    account.gem = BigInt.fromI32(0)
    account.save()
  }

  return <Account>account
}

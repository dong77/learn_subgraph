import { TokenRegistered } from '../generated/ExchangeV3/ExchangeV3'
import { ERC20 } from '../generated/ExchangeV3/ERC20'
import { Token } from '../generated/schema'
import { BigInt } from '@graphprotocol/graph-ts'

const ZeroAddr = '0x0000000000000000000000000000000000000000'

function i32ToString(value:i32):string {
  return BigInt.fromI32(value).toString();
}

export function handleTokenRegistered(event: TokenRegistered): void {
  let id = event.params.tokenId
  if (id === 24) return

  let token = new Token(i32ToString(id))

  if (id === 0) {
    token.address = ZeroAddr
    token.symbol = "ETH"
    token.name = "Ether"
    token.decimals = 18
  } else if (id === 7) {
    token.address = event.params.token.toHex()
    token.symbol = "MKR"
    token.name = "Maker"
    token.decimals =  18
  } else {
    token.address = event.params.token.toHex()
    let erc20 = ERC20.bind(event.params.token)
    token.symbol = erc20.symbol() || token.address.slice(0, 8)
    token.name = erc20.name() || token.symbol
    token.decimals = erc20.decimals() || 18
  }

  token.save()
}

// export function handleUpdatedGravatar(event: UpdatedGravatar): void {
//   let id = event.params.id.toHex()
//   let gravatar = Gravatar.load(id)
//   if (gravatar == null) {
//     gravatar = new Gravatar(id)
//   }
//   gravatar.owner = event.params.owner
//   gravatar.displayName = event.params.displayName
//   gravatar.imageUrl = event.params.imageUrl
//   gravatar.save()
// }

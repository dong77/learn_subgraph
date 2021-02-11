import { TokenRegistered, BlockSubmitted} from '../generated/ExchangeV3/ExchangeV3'
import { ERC20 } from '../generated/ExchangeV3/ERC20'
import { Token, Block } from '../generated/schema'
import { BigInt } from '@graphprotocol/graph-ts'

const ZeroAddr = '0x0000000000000000000000000000000000000000'

function i32ToString(value:i32):string {
  return BigInt.fromI32(value).toString();
}

const zeroPad = (str:string, places:i32):string => str.padStart(places, '0')

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
    let erc20 = ERC20.bind(event.params.token)

    token.address = event.params.token.toHex()

    let addressSlice = token.address.substr(2, 8)

    let callSymbolResult = erc20.try_symbol()
    token.name = callSymbolResult.reverted ? addressSlice : callSymbolResult.value

    let callNameResult = erc20.try_name()
    token.name = callNameResult.reverted ? addressSlice : callNameResult.value

    let callDecimalsResult = erc20.try_decimals()
    token.decimals = callDecimalsResult.reverted ? 18 : callDecimalsResult.value
  }

  // token.save()
}


export function handleBlockSubmitted(event: BlockSubmitted):void {
  let id = event.params.blockIdx
  let idStr = zeroPad(id.toString(), 10)
  let block = new Block(idStr)
  block.operator = event.transaction.from.toHex()
  block.gasPrice = event.transaction.gasPrice
  block.gasUsed = event.transaction.gasUsed
  block.gasFee = block.gasPrice * block.gasUsed

  block.blockHeight = event.block.number
  block.blockTimestamp = event.block.timestamp
  block.blockHash = event.block.hash.toHex()

  block.blockIdx = event.params.blockIdx
  block.merkleRoot = event.params.merkleRoot
  block.publicDataHash = event.params.publicDataHash
  block.save()
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

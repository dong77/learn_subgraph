import { TokenRegistered } from '../generated/ExchangeV3/ExchangeV3'
import { Token } from '../generated/schema'

export function handleTokenRegistered(event: TokenRegistered): void {
  let token = new Token(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  token.address = event.params.token.toHex()
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

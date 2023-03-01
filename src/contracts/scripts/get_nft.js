export const getNFT = `
import Sessions from 0x9a2479063c4c25bf

pub fun main(account: Address): AnyStruct {


  let publicReference = getAccount(account).getCapability(/public/BasicNFTPath)
                                    .borrow<&Sessions.NFT{Sessions.NFTPublic}>()
                                    ?? panic("No NFT reference found here!")

  return [publicReference.getID(), publicReference.getURL()]
}

`
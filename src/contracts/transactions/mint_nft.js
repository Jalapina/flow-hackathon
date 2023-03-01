export const mintNFT = `
import Sessions from 0x9a2479063c4c25bf

transaction (url: String){
  prepare(acct: AuthAccount) {
  
    acct.save(<-Sessions.createNFT(url: url), to: /storage/Sessions02)
    acct.link<&Sessions.NFT{Sessions.NFTPublic}>(/public/BasicNFTPath, target: /storage/BasicNFTPath)
  
  }
  execute {
    log("NFT Created!")
  }
}

`
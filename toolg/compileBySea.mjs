import fs from 'fs'
import { execSync } from 'child_process'
import { inject } from 'postject'

//整合node sea編譯流程: 產生blob → 複製node執行檔 → 注入blob

let fdBin = './bin'
let fpExe = './bin/wbat.exe'
let fpBlob = './bin/wbat.blob'

//mkdirSync
fs.mkdirSync(fdBin, { recursive: true })

//由sea-config.json產生blob
execSync(`"${process.execPath}" --experimental-sea-config sea-config.json`, { stdio: 'inherit' })

//刪除舊exe
fs.rmSync(fpExe, { force: true })

//複製node執行檔為exe
fs.copyFileSync(process.execPath, fpExe)

//注入blob至exe
let blob = fs.readFileSync(fpBlob)
await inject(fpExe, 'NODE_SEA_BLOB', blob, {
    sentinelFuse: 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2',
})

//node toolg/compileBySea.mjs

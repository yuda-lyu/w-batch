import fs from 'fs'

//因rollup轉譯出iife檔須由外部環境提供path,fs,child_process, 此時預設node執行環境下沒法提供, 得通過require取得, 故直接修改轉譯後程式碼

let fpIn = `./dist/compile.iife.js`
let fpOut = `./dist/wbat.iife.js` //提供給sea-config.json, 之後才再給node sea編譯

//readFileSync
let c = fs.readFileSync(fpIn, 'utf8')

//ti, to
let ts = ''
if (true) {
    for (let i = c.length - 1; i >= 0; i--) {
        let t = c.substring(i, i + 1)
        // console.log('t', t)
        ts = t + ts
        if (t === '(') {
            break
        }
    }
    // console.log('ts', ts)
}
let ti = ts
let to = ts
to = to.replace(`path`, `require('path')`)
to = to.replace(`fs`, `require('fs')`)
to = to.replace(`child_process`, `require('child_process')`)

//replace
c = c.replace(ti, to)

//writeFileSync
fs.writeFileSync(fpOut, c, 'utf8')


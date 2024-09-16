import fs from 'fs'

//因rollup轉譯出iife檔須由外部環境提供path,fs,child_process, 此時預設node執行環境下沒法提供, 得通過require取得, 故直接修改轉譯後程式碼

let fpIn = `./dist/compile.iife.js`
let fpOut = `./dist/wbat.iife.js` //提供給sea-config.json, 之後才再給node sea編譯

let c = fs.readFileSync(fpIn, 'utf8')

let ti = `(path,fs,child_process)` //(path, fs, child_process)
let to = `(require('path'),require('fs'),require('child_process'))`

if (c.indexOf(ti) < 0) {
    throw new Error(`can not find '${ti}'`)
}

c = c.replace(ti, to)

fs.writeFileSync(fpOut, c, 'utf8')


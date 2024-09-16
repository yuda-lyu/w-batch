import wbat from './WBatch.mjs'


let get = (v, i) => {
    let r = null
    try {
        r = v[i]
    }
    catch (err) {}
    return r
}

//argv, 第0個為nodejs, 第1個為compile.js, 之後才是參數
let argv = process.argv

//fpSetting
let fpSetting = get(argv, 2, null)

//check
if (!fpSetting) {
    console.log('invalid file path for settings')
}
else {
    wbat(fpSetting)
        .then((msg) => {
            console.log(msg)
        })
        .catch((err) => {
            console.log(err)
        })
}


//node sea還不能打包*.mjs檔, 故需要先用rollup編譯成js
//node --experimental-modules toolg/gDistRollup.mjs
//node --experimental-modules toolg/assignNodePks.mjs
//node --experimental-sea-config sea-config.json
//node -e "require('fs').copyFileSync(process.execPath, 'wbat.exe')"
//npx postject wbat.exe NODE_SEA_BLOB wbat.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

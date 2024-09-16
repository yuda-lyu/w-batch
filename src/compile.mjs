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
//因流程較為繁瑣, 須使用script.txt內指令進行編譯

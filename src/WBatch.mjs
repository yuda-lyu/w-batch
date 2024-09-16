import cp from 'child_process'
import path from 'path'
import fs from 'fs'
import JSON5 from 'json5'
import get from 'lodash-es/get.js'
import genPm from 'wsemi/src/genPm.mjs'
import isearr from 'wsemi/src/isearr.mjs'
import isestr from 'wsemi/src/isestr.mjs'
import isbol from 'wsemi/src/isbol.mjs'
import pmSeries from 'wsemi/src/pmSeries.mjs'
import fsIsFile from 'wsemi/src/fsIsFile.mjs'
import fsIsFolder from 'wsemi/src/fsIsFolder.mjs'
import now2str from 'wsemi/src/now2str.mjs'
import now2strp from 'wsemi/src/now2strp.mjs'
import strright from 'wsemi/src/strright.mjs'
import o2j from 'wsemi/src/o2j.mjs'
import fsCreateFolder from 'wsemi/src/fsCreateFolder.mjs'
import execScript from 'wsemi/src/execScript.mjs'


let logFd = '' //若由排程呼叫且不給logFd絕對路徑時, 預設是位於C:\Windows\system32
let logWhenSuccess = false
let logWhenError = true


async function readSetting(fpSetting) {

    //check
    if (!fsIsFile(fpSetting)) {
        return Promise.reject('input path is not file')
    }

    //read and parse
    let r = null
    try {

        //readFileSync
        let c = fs.readFileSync(fpSetting, 'utf8')

        //parse
        r = JSON5.parse(c)

    }
    catch (err) {
        return Promise.reject(err)
    }

    return r
}


/**
 * 背景執行程序
 *
 * @class
 * @param {Array|String} inp 輸入設定陣列或設定檔名稱字串
 * @returns {Promise} 回傳Promise，revolve回傳成功訊息，reject回傳錯誤訊息
 * @example
 *
 * let inp = [
 *   {
 *     "settings":{
 *       "logFd":"./testLog",
 *       "logWhenSuccess":true,
 *       "logWhenError":true,
 *     },
 *   },
 *   {
 *     "prog":"node",
 *     "args":"-v",
 *     "wait":true,
 *   },
 * ]
 * let msg = await WBatch(inp)
 * console.log('msg', msg)
 *
 */
async function WBatch(inp) {

    async function core(inp) {
        let s

        //check
        if (isearr(inp)) {
            s = inp
        }
        else if (isestr(inp)) {
            s = await readSetting(inp)
        }
        else {
            return Promise.reject('input is not a string for path of json file or not an array for settings')
        }

        //msg
        let msg = []
        try {

            //pmSeries, 需循序操作
            await pmSeries(s, async (v) => {

                //settings
                let settings = get(v, 'settings', null)
                if (settings !== null) {

                    //logFd
                    let _logFd = get(settings, 'logFd', null)
                    if (isestr(_logFd)) {
                        logFd = _logFd
                    }

                    //logWhenSuccess
                    let _logWhenSuccess = get(settings, 'logWhenSuccess', null)
                    if (isbol(_logWhenSuccess)) {
                        logWhenSuccess = _logWhenSuccess
                    }

                    //logWhenError
                    let _logWhenError = get(settings, 'logWhenError', null)
                    if (isbol(_logWhenError)) {
                        logWhenError = _logWhenError
                    }

                    return
                }

                //prog
                let prog = get(v, 'prog', '')
                if (!isestr(prog)) {
                    msg.push('invalid prog')
                    return
                }

                //args
                let args = get(v, 'args', [])
                if (isestr(args)) {
                    args = [args]
                }

                //wait
                let wait = get(v, 'wait', true)
                if (!isbol(wait)) {
                    wait = true
                }

                //wait
                // console.log('prog', prog)
                // console.log('args', args)
                // console.log('wait', wait)
                if (wait) {
                    // console.log('call execScript')
                    await execScript(prog, args)
                        .then((res) => {
                            // console.log('res', res)
                            msg.push(res)
                        })
                        .catch((err) => {
                            // console.log('err', err)
                            msg.push(err)
                        })
                }
                else {
                    // console.log('call spawn')
                    let ls = cp.spawn(prog, args)
                    ls.stdout.on('data', (data) => {
                        // console.log(`stdout: ${data}`)
                        msg.push(`stdout: ${data}`)
                    })
                    ls.stderr.on('data', (data) => {
                        // console.log(`stderr: ${data}`)
                        msg.push(`stderr: ${data}`)
                    })
                    ls.on('close', (code) => {
                        // console.log(`child process exited with code ${code}`)
                        msg.push(`close: code[${code}]`)
                    })
                }

            })

        }
        catch (err) {
            return Promise.reject(err)
        }

        //finish
        let r = `finish at ${now2str()}`
        msg.push(r)

        return msg
    }

    function logMsg(type, msg) {
        if (logFd !== '') {

            //logFd
            if (strright(logFd, 1) !== path.sep) {
                logFd += path.sep
            }

            //check
            if (!fsIsFolder(logFd)) {
                fsCreateFolder(logFd)
            }

            //fn
            let fn = `${type}-${now2strp()}.log`
            fn = logFd + fn
            console.log(`output ${type} to: ${path.resolve(fn)}`)

            //msg
            msg = o2j(msg, true)

            //write
            fs.writeFileSync(fn, msg, 'utf8')

        }
    }

    //pm
    let pm = genPm()

    //core
    core(inp)
        .then((msg) => {
            //console.log('then', msg)
            if (logWhenSuccess) {
                logMsg('success', msg)
            }
            pm.resolve(msg)
        })
        .catch((err) => {
            //console.log('catch', err)
            if (logWhenError) {
                logMsg('error', err)
            }
            pm.reject(err)
        })

    return pm
}


export default WBatch

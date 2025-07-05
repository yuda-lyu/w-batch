import fs from 'fs'
import cp from 'child_process'
import assert from 'assert'
import _ from 'lodash-es'
import w from 'wsemi'
// import WBatch from '../src/WBatch.mjs'


function isWindows() {
    return process.platform === 'win32'
}


describe('WBatch', function() {

    //check
    if (!isWindows()) {
        return
    }

    async function test() {

        cp.spawnSync('./bin/wbat.exe', ['./bin/setting.json'], { encoding: 'utf8' })
        // console.log('r', r)

        let vfps = w.fsTreeFolder('./testLog')
        // console.log('vfps', vfps)

        let vfp = _.last(vfps)

        let j = fs.readFileSync(vfp.path, 'utf8')
        let o = JSON.parse(j)
        // console.log('o', o)

        let len = _.size(o)
        // console.log('len', len)

        w.fsDeleteFolder('./testLog')

        return len
    }
    // test()
    //     .catch((err) => {
    //         console.log('catch', err)
    //     })

    it('exec', async function() {
        let r = 2
        let rr = await test()
        assert.strict.deepEqual(r, rr)
    })

})

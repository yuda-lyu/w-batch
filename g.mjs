import fs from 'fs'
import cp from 'child_process'
import _ from 'lodash-es'
import w from 'wsemi'

let r = cp.spawnSync('./bin/wbat.exe', ['./bin/setting.json'], { encoding: 'utf8' })
console.log('r', r)

let vfps = w.fsTreeFolder('./testLog')
console.log('vfps', vfps)

let vfp = _.last(vfps)

let j = fs.readFileSync(vfp.path, 'utf8')
let o = JSON.parse(j)
console.log('o', o)

let len = _.size(o)
console.log('len', len)

w.fsDeleteFolder('./testLog')

//node g.mjs

import rollupFiles from 'w-package-tools/src/rollupFiles.mjs'
import rollupFile from 'w-package-tools/src/rollupFile.mjs'


let fdSrc = './src'
let fdTar = './dist'


await rollupFiles({ //rollupFiles預設會clean folder故得放第1個
    fns: 'compile.mjs',
    fdSrc,
    fdTar,
    nameDistType: 'kebabCase',
    format: 'iife', //針對compile.mjs編譯出直接執行程序
    bSourcemap: false,
    globals: {
        'path': 'path',
        'fs': 'fs',
        'child_process': 'child_process',
    },
    external: [
        'path',
        'fs',
        'child_process',
    ],
})

//主程式庫進入點, 建出dist/w-batch.umd.js供package.json之main使用
await rollupFile({
    fn: 'WBatch.mjs',
    fdSrc,
    fdTar,
    nameDistType: 'kebabCase',
    globals: {
        'path': 'path',
        'fs': 'fs',
        'child_process': 'child_process',
    },
    external: [
        'path',
        'fs',
        'child_process',
    ],
    runin: 'nodejs',
})

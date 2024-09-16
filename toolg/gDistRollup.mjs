import rollupFiles from 'w-package-tools/src/rollupFiles.mjs'


let fdSrc = './src'
let fdTar = './dist'


rollupFiles({
    fns: 'compile.mjs',
    fdSrc,
    fdTar,
    nameDistType: 'kebabCase',
    format: 'iife', //針對compile.mjs編譯出直接執行程序
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

//node --experimental-modules toolg/gDistRollup.mjs


import λ from 'ramda'
import Logdown from 'logdown'
import nunjucks from 'nunjucks'
import path from 'path'
import fs from 'mz/fs'
import cssnext from 'cssnext'

// CSS -----------------------------------------------------------

const CSS = {}
const log = new Logdown({prefix: 'CONTRA:CSS'})

CSS.render = async function render(file: string, destination: string) {
    log.info(`Rendering ${file}...`)
    const data = await fs.readFile(file, 'utf8')
    const css4 = await cssnext(data, {from: file})
    await fs.writeFile(destination, css4)
    return destination
}

export default CSS

// CSS
// ----------------------------------------------------------------------
// const base = './src'
// const tmp =  './tmp'
// const dest = './dest'

// const css = function(section) {
//     log.info('-- css --->')
//     λ.concurrent([
//         task => processVendor('css', 'vendor.css', task),
//         //task => processCSS('theme', 'theme.css')
//         task => processCSS('src', 'base.css', task)
//     ], function (err, results) {
//         if err cb(err)
//         concat(results, destcss, (err) => done('css', cb, err))
//     });
// }
//
// function processCSS(section, output, cb) {
//     if (section === 'theme') {
//         const input = './theme/copperhead/css/copperhead.css'
//         const output = tmpcss + '/themes/copperhead.css'
//     }
//     if (section === 'src') {
//         const input = './src/css/base.css'
//         const output = tmpcss +' /website.css'
//     }
//     λ.concurrent([
//         task => convertCSS(input, output)
//     ], function (err, results) {
//         done('css', cb, err)
//     })
// }
//
// function convertCSS(source, dest) {
//     const output = cssnext(
//       fs.readfilesync(source, 'utf8'),
//       {from: '.'}
//     )
//     fs.writefile(dest, output, cb)
// }
//

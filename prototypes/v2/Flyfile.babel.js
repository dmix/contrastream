//
//
//     ______                            __                   __
//     / ____/___  ____  ____  ___  _____/ /_  ___  ____ _____/ /
//    / /   / __ \/ __ \/ __ \/ _ \/ ___/ __ \/ _ \/ __ `/ __  /
//   / /___/ /_/ / /_/ / /_/ /  __/ /  / / / /  __/ /_/ / /_/ /
//   \____/\____/ .___/ .___/\___/_/  /_/ /_/\___/\__,_/\__,_/
//             /_/   /_//
//
//
//
//

import λ from 'ramda'
import fs from 'mz/fs'
import path from 'path'
import radix from 'baobab'
import cssnext from 'cssnext'

// Initialize
// -------------------------------------------------------------------

export default async function() {
    await prepare(dirs)
    await this.watch(paths.components, ['components'])
    await this.watch(paths.js, ['css'])
    await this.watch(paths.css, ['css'])
    await this.watch(paths.html, ['html'])
}

// Components:
// -------------------------------------------------------------------

export async function components() {
    // Prepare directories
    await this.clear(tmp('components/'))

    // Flatten componet files to tmp directorglobsy
    await this
        .source(paths.components)
        .unwrap((files) => files.map((file) => {
            move(file, tmp('components'))
        }))
}

export async function vendors() {
    fs.mkdirp(tmp('vendor/'))
    const globs = globify(['./vendor/*/'], ['js', 'css'])
    const flatten = move(tmp('vendor/'))
    await this
        .source(globs)
        .unwrap((files) => files.forEach(f => flatten(f)))
}

// CSS
// -------------------------------------------------------------------

export async function css() {
    await this
        .source(paths.css)
        .target(tmp())
    const source = tmp('/base.css')
    const output = cssnext(
      fs.readFileSync(source, 'utf8'),
      {from: source}
    )

    // Merge with vendor.css
    await this
        .source([
            tmp('base.css'),
            tmp('vendor.css')
        ])
        .concat('css/build.css')
        .notify({
            title: 'Copperhead',
            message: 'CSS Done',
            icon: 'dev:code_badge'
        })
        .target(dest('css/'))
}

// JS ----------------------------------------------------------------

async function js() {
    await this
        .source(paths.js)
        .babel()
        .concat('css/build.js')
        .notify({
            title: 'Copperhead build tool',
            message: 'JS BUILT',
            icon: 'dev:code_badge'
        })
        .target(dest('js/'))
}

// HTML --------------------------------------------------------------

async function html() {
    await this
        .source(paths.html)
        .unwrap((files) => console.log(files))
        .target(tmp())

    Metalsmith(tmp())
        // .use(metadata(results[0]))
        .use(inPlace({
            engine: 'nunjucks',
            pattern: '*.html'
        }))
        .build((err) => {
            fs.copy(globify([tmp()], ['.html']), dest())
        })
}

// Lint --------------------------------------------------------------

async function configs() {
    await this.source(paths.build).eslint()
}

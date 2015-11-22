import Logdown from 'logdown'
import λ from 'ramda'
import Config from './helpers/contra-config'
import HTML from './generators/contra-html'
import CSS from './generators/contra-css'
import * as Dirs from './helpers/contra-dirs'

const contra = Config({})
const tmp = contra.get('dirs', 'tmp')
const dest = contra.get('dirs', 'dest')

export default function init() {
    const log = new Logdown({prefix: 'CONTRA'})

    log.info('------------------------------------------------------')
    log.info('CONTRA: Building website...')
    log.info('------------------------------------------------------')

    prepare()
    build()
    // optimize()

    return contra
}

function prepare() {
    const log = new Logdown({prefix: 'CONTRA:prepare'})

    log.info('1. Preparing temp and build directories...')
    log.info('------------------------------------------------------')

    const output = contra.select('output', 'paths')
    output.concat(tmp([
        '.',
        'components/'
    ]))
    output.concat(dest([
        '.',
        'assets/',
    ]))
    output.apply(Dirs.prepare);


    log.info('2. Flattening components and theme to temp dir...')
    log.info('------------------------------------------------------')

    const components = contra.select('source', 'components', 'files')
    const flattenTemp = λ.partial(Dirs.flatten, [tmp('components')])
    components.apply(flattenTemp)

    log.info('3. Copying theme to temp dir...')
    log.info('------------------------------------------------------')

    const theme = contra.get('dirs', 'themes')
    Dirs.flatten(tmp(), [
        // TODO: automate by copying all files while preserving subdir
        // structure
        theme('copperhead/html/index.html'),
        // theme('copperhead/html/android/index.html'),
        theme('copperhead/html/base.html'),
        theme('copperhead/css/_type.css'),
        theme('copperhead/css/base.css'),
        theme('copperhead/js/base.js'),
    ])
    // Dirs.copyImages(theme('copperhead'), dest('assets'))
    log.info('DONE. Ready for build.')
    log.info('------------------------------------------------------')
}

function build() {
    const log = new Logdown({prefix: 'CONTRA:build'})

    log.info('1. Rendering templates...')
    log.info('------------------------------------------------------')

    HTML.render(tmp('index.html'), dest('index.html'))
        .then((destination) => log.info(`HTML saved to ${destination}`))
        .catch((error) => log.error(error))

    log.info('2. Generating CSS4 Stylesheets...')
    log.info('------------------------------------------------------')

    const CSSresults = CSS.render(tmp('base.css'), dest('assets/base.css'))
        .then((destination) => log.info(`CSS saved to ${destination}`))
        .catch((error) => log.error(error))

    log.info('3. Generating ES6/7 Javascript...')
    log.info('------------------------------------------------------')

    // JS.render(tmp('base.js'), dest('assets/base.js'))
    //     .then((destination) => log.info(`Saved to ${destination}`))
    //     .catch((error) => log.error(error))

}
init()

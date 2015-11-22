import λ from 'ramda'
import path from 'path'
import Logdown from 'logdown'
import Baobab from 'baobab'
import * as Dirs from './contra-dirs'

// Config ----------------------------------------------------------
//
// An immutable radix tree containing metadata needed to build site
// from source.

const log = new Logdown({prefix: 'CONTRA:config'})

export default function Config(config: Object) {
    const tree = new Baobab({
        source: {
            directory: './src/',

            components: {
                directory: './src/components/',
                filetypes: ['html', 'js', 'css'],
                globs: glob(['source', 'components']),
                files: locate(['source', 'components', 'globs']),
                activated: [
                    'hero',
                    'navigation'
                ]
            },

            themes: {
                directory: './src/themes/',
                filetypes: ['html', 'js', 'css', 'toml'],
                globs: glob(['source', 'themes']),
                files: locate(['source', 'themes', 'globs']),
                activated: [
                    'copperhead',
                ]
            },

            content: {
                directory: './src/content/',
                filetypes: ['md', 'toml'],
                globs: glob(['source', 'content']),
                files: locate(['source', 'content', 'globs']),
                activated: [
                    'website'
                ]
            }
        },

        processing: {
            directory: './.tmp/',
            filetypes: {
                images:     ['png', 'jpg', 'jpeg'],
                data:       ['toml'], // +yaml (legacy)
                templates:  ['html'],
                css:        ['css'], // +scss (legacy)
                js:         ['js'],
            },
        },

        output: {
            directory: './build/',
            paths: [],
            html: '.',
            js: 'assets/js',
            css: 'assets/css',
            images: 'assets/images',
        },

        // Wrap directories with alias function, for example:
        // dirs.tmp() => './tmp/'
        // dirs.tmp('css') => './tmp/css'
        dirs: {
            components: alias(['source', 'components', 'directory']),
            themes:     alias(['source', 'themes', 'directory']),
            content:    alias(['source', 'content', 'directory']),
            src:        alias(['source', 'directory']),
            tmp:        alias(['processing', 'directory']),
            dest:       alias(['output', 'directory']),
        },

    })
    const srcDir = tree.select('dirs').get('src')
    return tree
}

// Custom Baobab functions
// ---------------------------------------------------------------------------
// See: https://github.com/Yomguithereal/baobab#computed-data-or-monkey-business

function alias(cursor) {
    return Baobab.monkey({
        cursors: {
            directory: cursor
        },
        get: function(data) {
            return Dirs.alias(data.directory)
        }
    })
}

function glob(cursor) {
    return Baobab.monkey({
        cursors: {
            directory: λ.append('directory', cursor),
            filetypes: λ.append('filetypes', cursor),
            activated: λ.append('activated', cursor),
        },
        get: function(data) {
            return λ.flatten(λ.map(function(dir) {
                const subdir = path.join(data.directory, dir)
                return Dirs.glob(subdir, data.filetypes)
            }, data.activated))
        }
    })
}

function locate(cursor) {
    return Baobab.monkey({
        cursors: {
            globs: cursor
        },
        get: function(data) {
            return Dirs.locate(data.globs)
        }
    })
}

// Filter directory list to those containing 'src/'
function filter(cursor, pattern) {
    return Baobab.monkey(
        cursor,
        (data) => λ.filter(λ.contains(pattern), data)
    )
}

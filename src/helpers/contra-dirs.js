import λ from 'ramda'
import fs from 'fs-extra'
import rimraf from 'rimraf'
import path from 'path'
import Glob from 'glob'
import Logdown from 'logdown'
import Baobab from 'baobab'

// Directories -----------------------------------------------------

const log = new Logdown({prefix: 'CONTRA:dirs'})

export function alias(directory: string): Function {
    //
    //  Return alias function for a directory, which generates paths to base
    //  directory or path to subdirectories when provided an argument
    //
    return function dirAlias(subdirectory: ?string|Array<string>) { // alias(/tmp/x)
        const dir = λ.partial(path.join, [directory])
        return typeApply(subdirectory, {
            'Undefined': () => dir('.'),                // ()        => /tmp/x
            'String':    () => dir(subdirectory),       // (css)     => /tmp/x/css
            'Array':     () => λ.map(dir, subdirectory) // (css, js) => /tmp/x/js, /tmp/x/css
        })
    }
}

export function glob(dir: string, filetypes: Array<string>): Array<string> {
    // Generate globs of the directory combined with each filetype
    //
    //      tmp/ + [js, css] = [tmp/*.js, tmp/*.css]
    //
    return λ.map(function dirGlob(filetype) {
        return path.join(dir, `**/*.${filetype}`)
    }, filetypes)
}

export function locate(globs: Array<string>): Array<string> {
    // Find all files matching array of filetypes in a directory
    //
    //      [tmp/*.js, src/*.js] = [tmp/a.js, tmp/b.js, src/a.css]
    //
    const files = λ.map(function findFiles(pattern) {
        return Glob.sync(pattern)
    }, globs)
    return λ.flatten(files)
}

export function prepare(dirs: Array<string>) {
    //
    // Create or clean each directory
    //
    return λ.map(function clean(dir) {
        try {
            rimraf.sync(dir)
        }
        catch(e) {
            log.error(e)
        }
        fs.mkdirSync(dir)
    }, dirs)
}

export function flatten(destination: string, files: Array<string>) {
    //
    // Copy source files from various subdirectories to a single directory
    // making them available for importing by other files.
    //
    return λ.map(function copy(source) {
       const location = path.join(destination, path.basename(source))
       fs.copySync(source, location, {})   // - copy files to .tmp dir
    }, files)
}

export function copyImages(source: string, destination: string) {
    log.info(`Copying images from ${source} to ${destination}`)
    const globs = glob(source, ['png', 'jpg', 'jpeg'])
    const images = locate(globs)
    λ.map(function(img) {
        const file = img.split('images/')
        console.log(file[0])
        console.log(file[1])
    }, images)
    // return Glob.sync(pattern)
    return images
}

// Helpers
// --------------------------------------------------------------

function typeApply(obj, funcs) {
    return λ.cond([
        [λ.equals('Undefined'), funcs['Undefined']],
        [λ.equals('String'), funcs['String']],
        [λ.equals('Array'), funcs['Array']],
    ])(λ.type(obj))
}

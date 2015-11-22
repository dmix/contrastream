//
//
// contrastream
// ----------------------------------------------
// Static Site Generator
//
//

//  NOTE: Depreciated. This is an early experiment using Golang-style
//        coroutines. See contra/ directory for the current version.

import Metalsmith from 'metalsmith'
import inPlace from 'metalsmith-in-place'
import metadata from 'metalsmith-metadata'

import fs from 'fs-extra'
import path from 'path'
import glob from 'glob'
import concat from 'concat'

import toml from 'toml'
import babel from 'babel-core'
import cssnext from 'cssnext'
import λ from 'contra'
import Logdown from 'logdown'
import taim from 'taim'

// Initalize
// ----------------------------------------------------------------------
clean()
setup()
build()

// Build files
// ----------------------------------------------------------------------
const log = new Logdown({prefix: 'build.js'})

const clean = function(cb) {
    fs.remove('.tmp', cb)
}

const setup = function(cb) {
    λ.concurrent([
        task => fs.mkdirs('.tmp', task),
        task => relativeComponents('.js', task),
        task => relativeComponents('.css', task),
        task => relativeComponents('.html', task),
    ], cb)
}

const build = function() {
    log.info('---START---')
    λ.concurrent([
        task => taim('CSS', css)(task),
        // task => taim('JS', css)(task),
        // task => taim('Website', css)(task),
    ], function (err, results) {
        if (err) log.error(err)
        log.debug('---DONE---')
        clean()
    })
}

const buildOne = function(step, cb) {
    λ.series([
        task => clean(task),
        task => setup(task),
        task => taim(step.name, step)(task),
    ], cb)
}


// Helper functions
// ----------------------------------------------------------------------
function processVendor(filetype, output, cb) {
    λ.concurrent([
        task => fs.copy(`components/*/vendor/*.${filetype}`, '.tmp/vendor'),
        task => fs.copy(`theme/*/vendor/*.${filetype}`, '.tmp/vendor'),
        task => fs.copy(`src/assets/vendor/*.${filetype}`, '.tmp/vendor')
    ], function (err, results) {
        log.info(`-- Packaged vendor.${filetype} --->`)
        concat([`.tmp/vendor/*.${filetype}`], `vendor.${filetype}`, cb)
    })
}

function collectMetadata(tomlFiles, cb) {
    var metadata = {}
    var handlers = []
    glob(tomlFiles, function (er, files) {
        files.forEach(file => {
            handlers.push(function(cb) {
                fs.readFile(file, (err, data) => {
                    if err cb(err)
                    let filename = path.basename(file, '.toml')
                    metadata[filename] = toml.parse(data)
                    cb(null, file)
                });
            })
        })
    })

    λ.concurrent(handlers, function (err, results) {
        log.info(`-- Collected metadata --->`, metadata)
        cb(null, metadata)
    });
}

function done(section, cb, err) {
    if err
        log.error(`--> ${section} FAIL |`)
    else
        log.info(`--> ${section} DONE |`)
    cb(err)
}

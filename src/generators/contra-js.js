// JS
// ----------------------------------------------------------------------
const js = function(cb) {
    log.info('-- JS --->')
    λ.concurrent([
        task => processVendor('js', 'vendor.js', task),
        task => processJS('.tmp/*.js', 'website.js', task)
    ], function (err, results) {
        log.info('--> JS DONE |')
        concat(results, 'build/build.js', (err) => {
            done('JS', cb, err)
        })
    });
}

function processJS(cb) {
    λ.concurrent([
        task => fs.copy('themes/*/*.js', '.tmp', task),
        task => fs.copy('src/assets/js/*.js', '.tmp', task)
    ], function (err, results) {
        log.info(`-- Processed JS --->`)
        babel.transformFile('.tmp', options, cb) // err, { code, map, ast }
    })
}

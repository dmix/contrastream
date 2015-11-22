// ----------------------------------------------------------------------
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


import chokidar from 'chokidar'
import Logdown from 'logdown'
import taim from 'taim'

// Watch files
// ----------------------------------------------------------------------
var watch = {}
watch.log = new Logdown({prefix: 'watcher'})

watch.dir = [
    './src',
    './theme',
    './components'
]

watch.events = chokidar.watch(watch.dir, {
    ignored: /[\/\\]\./,
    ignoreInitial: true,
    persistent: true,
    interval: 100,
})

watch.change = function change(file) {
    var ext = path.extname(file)
    watch.log.info(`-- CHANGE ext: ${ext} path: ${file} --`)
    switch (ext) {
        case '.css':
            buildOne(css)
            break
        case '.js':
            buildOne(js)
            break
        case '.html':
            buildOne(website)
            break
    }
}

watch.update = function update(file) {
    watch.log.info(`-- UPDATE: ${file} --`)
    // delete file in builds dir
    taim('build', build)
}

watch.events
    .on('add', watch.change)
    .on('change', watch.change)
    .on('unlink', watch.update)
    .on('unlinkDir', watch.update)
    .on('error', (error) => watch.log.error(error))


watch.log.info(`-- WATCHING --`)

export default watch

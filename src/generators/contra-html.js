import λ from 'ramda'
import Logdown from 'logdown'
import nunjucks from 'nunjucks'
import path from 'path'
import fs from 'mz/fs'

// HTML -----------------------------------------------------------

const HTML = {}
const log = new Logdown({prefix: 'CONTRA:HTML'})

HTML.render = function render(file: string, destination: string): Promise {
    return new Promise(function(resolve, reject) {
        log.info(`Rendering ${file}...`)

        const template = path.basename(file)
        const directory = path.dirname(file)

        nunjucks.configure(directory, { autoescape: true });
        nunjucks.render(template, function rendered(err, html) {
            if (err)
                return reject(err)
            fs.writeFile(destination, html)
                .then(() => resolve(destination))
                .catch(reject)
        });
    })
}

export default HTML

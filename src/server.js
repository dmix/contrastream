import superstatic from 'superstatic'
import connect from 'connect'
import Logdown from 'logdown'

const app = connect()
const log = new Logdown({prefix: 'SERVER'})

log.info('Starting server...')
app.use(superstatic({
    config: {
        root: './build',
        routes: {
            '**': 'index.html'
        }
    },
    cwd: process.cwd()
}));
app.listen(3000, function () {
    log.info('Server running')
});

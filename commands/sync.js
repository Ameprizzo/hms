var client = require('../')
var ui = require('../lib/ui')

module.exports = function (remote, id, opts) {
  if (!id) return ui.error('Service name required')

  var c = client(remote, {key: opts.key})
  var unspin = ui.spin('Syncing', id)
  c.sync(id, function (err) {
    unspin(err)
    if (!opts.restart) return
    unspin = ui.spin('Restarting', id)
    c.restart(id, unspin)
  })
}

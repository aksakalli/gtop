var si = require('systeminformation'),
  utils = require('../utils')

var colors = utils.colors

function Net(sparkline) {
  this.sparkline = sparkline
  this.netData = [Array(61).fill(0), Array(61).fill(0)]

  si.networkInterfaceDefault(iface => {
    this.defaultIface = iface
    si.networkStats(iface, data => {
      this.updateData(data)
    })

    this.interval = setInterval(() => {
      si.networkStats(iface, data => {
        this.updateData(data)
      })
    }, 1000)
  })
}

Net.prototype.updateData = function(data) {

  var rx_sec = Math.max(0, data['rx_sec'])
  var tx_sec = Math.max(0, data['tx_sec'])

  this.netData[0].shift()
  this.netData[0].push(rx_sec)

  this.netData[1].shift()
  this.netData[1].push(tx_sec)

  rx_label = 'Receiving:      ' +
    utils.humanFileSize(rx_sec) +
    '/s \nTotal received: ' +
    utils.humanFileSize(data['rx'])

  tx_label = 'Transferring:      ' +
    utils.humanFileSize(tx_sec) +
    '/s \nTotal transferred: ' +
    utils.humanFileSize(data['tx'])

  this.sparkline.setData([rx_label, tx_label], this.netData)
  this.sparkline.screen.render()
}

module.exports = Net

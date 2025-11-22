var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

function Net(sparkline) {
  this.sparkline = sparkline;
  this.netData = [Array(61).fill(0), Array(61).fill(0)];
  var that = this;

  si.networkInterfaceDefault(function(iface) {
    if (!iface) {
      console.error('Failed to get network interface');
      return;
    }
    
    var updater = function() {
      si.networkStats(iface, function(data) {
        if (data && Array.isArray(data) && data.length > 0) {
          that.updateData(data[0]);
        }
      });
    };
    updater();
    that.interval = setInterval(updater, 1000);
  });
}

Net.prototype.updateData = function(data) {
  if (!data) {
    return;
  }
  
  var rx_sec = Math.max(0, data['rx_sec'] || 0);
  var tx_sec = Math.max(0, data['tx_sec'] || 0);

  this.netData[0].shift();
  this.netData[0].push(rx_sec);

  this.netData[1].shift();
  this.netData[1].push(tx_sec);

  var rx_label =
    'Receiving:      ' +
    utils.humanFileSize(rx_sec) +
    '/s \nTotal received: ' +
    utils.humanFileSize(data['rx_bytes'] || 0);

  var tx_label =
    'Transferring:      ' +
    utils.humanFileSize(tx_sec) +
    '/s \nTotal transferred: ' +
    utils.humanFileSize(data['tx_bytes'] || 0);

  this.sparkline.setData([rx_label, tx_label], this.netData);
  this.sparkline.screen.render();
};

Net.prototype.cleanup = function() {
  if (this.interval) {
    clearInterval(this.interval);
  }
};

module.exports = Net;

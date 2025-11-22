var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

function Disk(donut) {
  this.donut = donut;
  var that = this;

  si.fsSize(function(data) {
    if (data) {
      that.updateData(data);
    }
  });

  this.interval = setInterval(function() {
    si.fsSize(function(data) {
      if (data) {
        that.updateData(data);
      }
    });
  }, 10000);
}

Disk.prototype.updateData = function(data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return;
  }
  
  var disk = data[0];
  if (!disk || typeof disk.use !== 'number' || !disk.used || !disk.size) {
    return;
  }

  var label =
    utils.humanFileSize(disk.used, true) +
    ' of ' +
    utils.humanFileSize(disk.size, true);

  this.donut.setData([
    {
      percent: disk.use / 100,
      label: label,
      color: colors[5],
    },
  ]);
  this.donut.screen.render();
};

Disk.prototype.cleanup = function() {
  if (this.interval) {
    clearInterval(this.interval);
  }
};

module.exports = Disk;

var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

function Disk(donut) {
  this.donut = donut;

  si.fsSize(data => {
    this.updateData(data);
  });

  this.interval = setInterval(() => {
    si.fsSize(data => {
      this.updateData(data);
    });
  }, 10000);
}

Disk.prototype.updateData = function(data) {
  var disk = data[0];

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

module.exports = Disk;

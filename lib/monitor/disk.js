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
  var disk;

  // Filter out very small filesystems (< 100MB) to avoid system partitions
  var relevantFilesystems = data.filter(fs => fs.size > 100 * 1024 * 1024);

  if (process.platform === 'darwin') {
    // macOS: prefer /System/Volumes/Data or root, or largest
    disk = relevantFilesystems.find(fs => fs.mount === '/System/Volumes/Data') ||
           relevantFilesystems.find(fs => fs.mount === '/') ||
           relevantFilesystems.reduce((prev, curr) => prev.size > curr.size ? prev : curr, relevantFilesystems[0]);
  } else {
    // Linux/Unix: find root filesystem or largest
    disk = relevantFilesystems.find(fs => fs.mount === '/') ||
           relevantFilesystems.reduce((prev, curr) => prev.size > curr.size ? prev : curr, relevantFilesystems[0]);
  }

  // Fallback to first filesystem if nothing found
  disk = disk || data[0];

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

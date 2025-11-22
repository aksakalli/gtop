var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

function Mem(line, memDonut, swapDonut) {
  this.line = line;
  this.memDonut = memDonut;
  this.swapDonut = swapDonut;
  this.memData = [];
  this.swapData = [];

  si.mem(data => {
    this.memData = [
      {
        title: 'Memory',
        style: {
          line: colors[0],
        },
        x: Array(61)
          .fill()
          .map((_, i) => 60 - i),
        y: Array(61).fill(0),
      },
      {
        title: 'Swap',
        style: {
          line: colors[1],
        },
        x: Array(61)
          .fill()
          .map((_, i) => 60 - i),
        y: Array(61).fill(0),
      },
    ];
    this.updateData(data);
    this.interval = setInterval(() => {
      si.mem(data => {
        this.updateData(data);
      });
    }, 1000);
  });
}

Mem.prototype.updateData = function(data) {
  if (!data) {
    return;
  }
  var memPer = data.total > 0 ? (100 * (1 - data.available / data.total)).toFixed() : 0;
  var swapPer = data.swaptotal > 0 ? (100 * (1 - data.swapfree / data.swaptotal)).toFixed() : 0;

  swapPer = isNaN(swapPer) ? 0 : swapPer;

  this.memData[0].y.shift();
  this.memData[0].y.push(memPer);

  this.memData[1].y.shift();
  this.memData[1].y.push(swapPer);

  var memTitle =
    utils.humanFileSize(data.total - data.available) +
    ' of ' +
    utils.humanFileSize(data.total);

  var swapTitle =
    utils.humanFileSize(data.swaptotal - data.swapfree) +
    ' of ' +
    utils.humanFileSize(data.swaptotal);

  this.line.setData(this.memData);
  this.memDonut.setData([
    {
      percent: memPer / 100,
      label: memTitle,
      color: colors[0],
    },
  ]);
  this.swapDonut.setData([
    {
      percent: swapPer / 100,
      label: swapTitle,
      color: colors[1],
    },
  ]);
  this.line.screen.render();
};

Mem.prototype.cleanup = function() {
  if (this.interval) {
    clearInterval(this.interval);
  }
};

module.exports = Mem;

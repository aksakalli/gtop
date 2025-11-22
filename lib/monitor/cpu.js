var si = require('systeminformation'),
  utils = require('../utils'),
  throttle = require('../throttle'),
  config = require('../config');

var colors = utils.colors;

function Cpu(line) {
  this.line = line;
  this.cpuData = [];
  
  var that = this;
  var updateInterval = config.get('updateIntervals.cpu') || 1000;
  
  // Throttle UI updates to max 60fps (16ms)
  this.throttledRender = throttle(function() {
    that.line.screen.render();
  }, 16);
  
  si.currentLoad(function(data) {
    if (!data || !data.cpus) {
      console.error('Failed to get CPU data');
      return;
    }
    
    that.cpuData = data.cpus.map(function(cpu, i) {
      return {
        title: 'CPU' + (i + 1),
        style: {
          line: colors[i % colors.length],
        },
        x: Array(61)
          .fill()
          .map(function(_, i) { return 60 - i; }),
        y: Array(61).fill(0),
      };
    });
    that.updateData(data);
    that.interval = setInterval(function() {
      si.currentLoad(function(data) {
        if (data) {
          that.updateData(data);
        }
      });
    }, updateInterval);
  });
}

Cpu.prototype.updateData = function(data) {
  if (!data || !data.cpus || !Array.isArray(data.cpus)) {
    return;
  }
  
  data.cpus.forEach((cpu, i) => {
    if (!cpu || typeof cpu.load !== 'number' || !this.cpuData[i]) {
      return;
    }
    
    var loadString = cpu.load.toFixed(1).toString();
    while (loadString.length < 6) {
      loadString = ' ' + loadString;
    }
    loadString = loadString + '%';

    this.cpuData[i].title = 'CPU' + (i + 1) + loadString;
    this.cpuData[i].y.shift();
    this.cpuData[i].y.push(cpu.load);
  });

  this.line.setData(this.cpuData);
  this.throttledRender();
};

Cpu.prototype.cleanup = function() {
  if (this.interval) {
    clearInterval(this.interval);
  }
  if (this.throttledRender) {
    this.throttledRender.cancel();
  }
};

module.exports = Cpu;

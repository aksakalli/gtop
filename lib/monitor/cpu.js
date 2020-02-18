var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

function Cpu(line) {
  this.line = line;
  si.currentLoad(data => {
    this.cpuData = data.cpus.map((cpu, i) => {
      return {
        title: 'CPU' + (i + 1),
        style: {
          line: colors[i % colors.length],
        },
        x: Array(61)
          .fill()
          .map((_, i) => 60 - i),
        y: Array(61).fill(0),
      };
    });
    this.updateData(data);
    this.interval = setInterval(() => {
      si.currentLoad(data => {
        this.updateData(data);
      });
    }, 1000);
  });
}

Cpu.prototype.updateData = function(data) {
  data.cpus.forEach((cpu, i) => {
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
  this.line.screen.render();
};

module.exports = Cpu;

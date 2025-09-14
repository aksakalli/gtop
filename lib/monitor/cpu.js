var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

function Cpu(line) {
  this.line = line;
  this.currentMetric = 'CPU load';

  si.cpuTemperature(data => {
    this.cpuTemperatureData = data.cores.map((core, i) => this._createCpuSeries(i, colors));
    this._updateSeriesData(data.cores, this.cpuTemperatureData, '°C');
    this.tempInterval = setInterval(() => {
      si.cpuTemperature(data => {
        this._updateSeriesData(data.cores, this.cpuTemperatureData, '°C');
      });
    }, 1000);
  });

  si.currentLoad(data => {
    this.cpuLoadData = data.cpus.map((cpu, i) => this._createCpuSeries(i, colors));
    this._updateSeriesData(data.cpus.map(cpu => cpu.load.toFixed(1)), this.cpuLoadData, '%');
    this.loadInterval = setInterval(() => {
      si.currentLoad(data => {
        this._updateSeriesData(data.cpus.map(cpu => cpu.load.toFixed(1)), this.cpuLoadData, '%');
      });
    }, 1000);
  });

  this.line.screen.key(['s', 't'], function(ch, key) {
    this._toggleCurrentMetric();
  }.bind(this));
}

Cpu.prototype._toggleCurrentMetric = function() {
  if (this.currentMetric === 'CPU load') {
    this.line.options.maxY = 120;
    this.line.setLabel('CPU Temperature History');
    this.currentMetric = 'CPU temperature';
    this.line.setData(this.cpuLoadData);
    this.line.screen.render();

  } else {
    this.line.options.maxY = 100;
    this.line.setLabel('CPU Load History');
    this.currentMetric = 'CPU load';
    this.line.setData(this.cpuTemperatureData);
    this.line.screen.render();
  }
}

Cpu.prototype._createCpuSeries = function (index, colors, length = 61) {
  return {
    title: 'CPU' + (index + 1),
    style: {
      line: colors[index % colors.length],
    },
    x: Array(length).fill().map((_, i) => length - 1 - i),
    y: Array(length).fill(0),
  };
};

Cpu.prototype._updateSeriesData = function(dataArray, seriesArray, suffix) {
  dataArray.forEach((value, i) => {
      let str = value.toString();

      let gap = 8 - Math.floor(Math.log10(i+1)) - suffix.length;

      while (str.length < gap) str = ' ' + str;
      str += suffix;

      seriesArray[i].title = 'CPU' + (i + 1) + str;
      seriesArray[i].y.shift();
      seriesArray[i].y.push(value);
    });

    if ((suffix === '%' && this.currentMetric === 'CPU load') ||
        (suffix === '°C' && this.currentMetric === 'CPU temperature')) {
      this.line.setData(seriesArray);
      this.line.screen.render();
    }
}

module.exports = Cpu;

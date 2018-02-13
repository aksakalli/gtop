const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const utils = require('../utils');

const colors = utils.colors;

function Gpu(line) {
  this.line = line;
  this.memData = Array(parseInt(execSync(utils.getNvidiaSmiCommand(['count'])).toString())).fill(0).map((_, i) => {
    return {
      title: 'GPU' + (i + 1),
      style: {
        line: colors[i % colors.length]
      },
      x: Array(61).fill(0).map((_, i) => 60 - i),
      y: Array(61).fill(0)
    }
  });
  this.updateData();
  setInterval(() => {
    this.updateData();
  }, 1000);
}

Gpu.prototype.updateData = function () {
  exec(utils.getNvidiaSmiCommand(['index', 'utilization.gpu']), (_, stdout) => {
    stdout.replace(/\n$/g, '').split('\n').forEach(row => {
      const elements = row.split(',');
      const i = parseInt(elements[0]);
      let loadString = elements[1];
      while (loadString.length < 7) {
        loadString = ' ' + loadString;
      }

      this.memData[i].title = 'GPU' + (i + 1) + loadString;
      this.memData[i].y.shift();
      this.memData[i].y.push(parseInt(loadString.replace('\%', '')));
    });

    this.line.setData(this.memData);
    this.line.screen.render();
  })
};

module.exports = Gpu;

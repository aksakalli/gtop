const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const utils = require('../utils');

const colors = utils.colors;

function Mem(line, memDonut) {
  this.line = line;
  this.memDonut = memDonut;

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

Mem.prototype.updateData = function () {
  exec(utils.getNvidiaSmiCommand(['index', 'memory.used', 'memory.total']), (_, stdout) => {
    let used_all = 0;
    let total_all = 0;

    stdout.replace(/\n$/g, '').split('\n').forEach(row => {
      const elements = row.split(',');
      const i = parseInt(elements[0]);
      const used = utils.toBytes.apply(this, elements[1].trim().split(' '));
      const total = utils.toBytes.apply(this, elements[2].trim().split(' '));
      const load = (100 * used / total).toFixed();
      let loadString = load.toString();
      while (loadString.length < 6) {
        loadString = ' ' + loadString;
      }
      loadString = loadString + '\%';

      used_all += used;
      total_all += total;
      this.memData[i].title = 'GPU' + (i + 1) + loadString;
      this.memData[i].y.shift();
      this.memData[i].y.push(load);
    });

    this.line.setData(this.memData);
    this.memDonut.setData([{
      percent: (100 * used_all / total_all).toFixed(),
      label: utils.humanFileSize(used_all) + ' of ' + utils.humanFileSize(total_all),
      'color': colors[0]
    },]);
    this.line.screen.render();
  })
};

module.exports = Mem;

const { exec } = require('child_process');
const { colors } = require('../utils');

function gpuInfoCmd (gpuId) {
  return `nvidia-smi --id=${gpuId} --query-gpu=utilization.gpu,utilization.memory --format=csv`;
}

function getNvidiaData (gpuId) {
  return new Promise(resolve => {
    const cmd = gpuInfoCmd(gpuId);
    exec(cmd, (error, stdout) => {
      if (error) {
        return reject(error);
      }
      const utilization = parseUtilization(stdout);
      resolve(utilization);
    });
  });
}

function parseUtilization (data) {
  const lines = data.split('\n');
  const values = lines[1].split(',');

  return {
    load: parseInt(values[0], 10),
    memory: parseInt(values[1], 10)
  };
}

class Gpu {
  constructor(line) {
    this.line = line;
    this.gpus = [{}];
    this.gpuData = this.gpus.map((_, i) => ({
      title: `GPU ${i+1}`,
      style: {
        line: colors[i % colors.length],
      },
      x: Array(61).fill().map((_, i) => 60 - i),
      y: Array(61).fill(0),
    }));
    this.render();
    this.interval = setInterval(() => this.render(), 1000);
  }

  render() {
    this.gpus.forEach((gpu, i) => {
      getNvidiaData(i)
        .then((data) => this.updateGpuData(data, i))
        .catch(err => console.error(err));
    });
    this.line.setData(this.gpuData);
    this.line.screen.render();
  }

  updateGpuData(data, i) {
    this.gpuData[i].title = `GPU${i+1} ${data.load}%`;
    this.gpuData[i].y.shift();
    this.gpuData[i].y.push(data.load);
  }
}

module.exports = Gpu;

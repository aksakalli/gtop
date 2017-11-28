var blessed = require('blessed'),
  contrib = require('blessed-contrib'),
  monitor = require('./monitor'),
  exec = require('child_process').exec;

function init() {
  let supportsNvidiaSmi = false;

  exec('nvidia-smi -L | wc -l', (error, stdout) => {
    if (!error && parseInt(stdout, 10) > 0) {
      supportsNvidiaSmi = true;
    }
    render({ supportsNvidiaSmi });
  });
}

function render({ supportsNvidiaSmi }) {
  var screen = blessed.screen()
  var grid = new contrib.grid({
    rows: supportsNvidiaSmi ? 16 : 12,
    cols: 12,
    screen: screen
  })

  var cpuLine = grid.set(0, 0, 4, 12, contrib.line, {
    showNthLabel: 5,
    maxY: 100,
    label: 'CPU History',
    showLegend: true,
  })

  var memLine = grid.set(4, 0, 4, 8, contrib.line, {
    showNthLabel: 5,
    maxY: 100,
    label: 'Memory and Swap History',
    showLegend: true,
    legend: {
      width: 10
    }
  })

  var memDonut = grid.set(4, 8, 2, 4, contrib.donut, {
    radius: 8,
    arcWidth: 3,
    yPadding: 2,
    remainColor: 'black',
    label: 'Memory',
  });

  var swapDonut = grid.set(6, 8, 2, 4, contrib.donut, {
    radius: 8,
    arcWidth: 3,
    yPadding: 2,
    remainColor: 'black',
    label: 'Swap',
  });

  var netSpark = grid.set(8, 0, 2, 6, contrib.sparkline, {
    label: 'Network History',
    tags: true,
    style: {
      fg: 'blue'
    }
  })

  var diskDonut = grid.set(10, 0, 2, 6, contrib.donut, {
    radius: 8,
    arcWidth: 3,
    yPadding: 2,
    remainColor: 'black',
    label: 'Disk usage',
  })

  var procTable = grid.set(8, 6, 4, 6, contrib.table, {
    keys: true,
    label: 'Processes',
    columnSpacing: 1,
    columnWidth: [7, 24, 7, 7]
  })

  if (supportsNvidiaSmi) {
    var gpuLine = grid.set(12, 0, 4, 12, contrib.line, {
      showNthLabel: 5,
      maxY: 100,
      label: 'GPU History',
      showLegend: true,
    })
  }

  procTable.focus()

  screen.render();
  screen.on('resize', function(a) {
    cpuLine.emit('attach');
    memLine.emit('attach');
    memDonut.emit('attach');
    swapDonut.emit('attach');
    netSpark.emit('attach');
    diskDonut.emit('attach');
    procTable.emit('attach');
    if (supportsNvidiaSmi) {
      gpuLine.emit('attach');
    }
  });

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  new monitor.Cpu(cpuLine); //no Windows support
  new monitor.Mem(memLine, memDonut, swapDonut);
  new monitor.Net(netSpark);
  new monitor.Disk(diskDonut);
  new monitor.Proc(procTable); // no Windows support
  if (supportsNvidiaSmi) {
    new monitor.Gpu(gpuLine);
  }
}

process.on('uncaughtException', function(err) {
  // avoid exiting due to unsupported system resources in Windows
});

module.exports = {
  init: init,
  monitor: monitor
};

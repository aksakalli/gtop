const blessed = require('blessed')
const contrib = require('blessed-contrib')
const monitor = require('./monitor')

const screen = blessed.screen()
const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen
})

const cpuLine = grid.set(0, 0, 4, 12, contrib.line, {
  showNthLabel: 5,
  maxY: 100,
  label: 'CPU History',
  showLegend: true,
})

const memLine = grid.set(4, 0, 4, 8, contrib.line, {
  showNthLabel: 5,
  maxY: 100,
  label: 'Memory and Swap History',
  showLegend: true,
  legend: {
    width: 10
  }
})

const memDonut = grid.set(4, 8, 2, 4, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: 'black',
  label: 'Memory',
})

const swapDonut = grid.set(6, 8, 2, 4, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: 'black',
  label: 'Swap',
})

const netSpark = grid.set(8, 0, 2, 6, contrib.sparkline, {
  label: 'Network History',
  tags: true,
  style: {
    fg: 'blue'
  }
})

const diskDonut = grid.set(10, 0, 2, 6, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: 'black',
  label: 'Disk usage',
})

const procTable = grid.set(8, 6, 4, 6, contrib.table, {
  keys: true,
  label: 'Processes',
  columnSpacing: 1,
  columnWidth: [7, 24, 7, 7]
})

procTable.focus()

screen.render()
screen.on('resize', function (a) {
  cpuLine.emit('attach')
  memLine.emit('attach')
  memDonut.emit('attach')
  swapDonut.emit('attach')
  netSpark.emit('attach')
  diskDonut.emit('attach')
  procTable.emit('attach')
})

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

function init () {
  new monitor.Cpu(cpuLine) //no Windows support
  new monitor.Mem(memLine, memDonut, swapDonut)
  new monitor.Net(netSpark)
  new monitor.Disk(diskDonut)
  new monitor.Proc(procTable) // no Windows support
}

process.on('uncaughtException', function (err) {
  // avoid exiting due to unsupported system resources in Windows
})

module.exports = {
  init: init,
  monitor: monitor
}

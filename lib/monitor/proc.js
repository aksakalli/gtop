const si = require('systeminformation')

const pars = {
  p: 'pid',
  c: 'pcpu',
  m: 'pmem'
}

function Proc (table) {
  this.table = table

  this.pSort = 'pcpu'
  this.reIndex = false
  this.reverse = false

  const that = this

  const updater = function () {
    si.processes(data => {
      that.updateData(data)
    })
  }
  updater()
  setInterval(updater, 3000)
  this.table.screen.key(['m', 'c', 'p'], function (ch, key) {
    if (pars[ch] == that.pSort) {

      that.reverse = !that.reverse
    } else {
      that.pSort = pars[ch] || that.pSort
    }

    that.reIndex = true
    updater()
  })
}

Proc.prototype.updateData = function (data) {
  const par = this.pSort

  const data_list = data.list
    .sort(function (a, b) {
      return b[par] - a[par]
    })
    .map(p => {
      return [
        p.pid,
        p.command, //.slice(0,10),
        ' ' + p.pcpu.toFixed(1),
        p.pmem.toFixed(1)
      ]

    })

  const headers = ['PID', 'Command', '%CPU', '%MEM']

  headers[{
    pid: 0,
    pcpu: 2,
    pmem: 3
  }[this.pSort]] += this.reverse ? '▼' : '▲'

  this.table.setData({
    headers: headers,
    data: this.reverse ? data_list.reverse() : data_list
  })

  if (this.reIndex) {
    this.table.rows.select(0)
    this.reIndex = false
  }

  this.table.screen.render()
}

module.exports = Proc

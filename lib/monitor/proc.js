var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

var pars = {
  p: 'pid',
  c: 'pcpu',
  m: 'pmem'
}

function Proc(table, blessed, screen) {
  this.table = table;

  this.pSort = 'pcpu';
  this.reIndex = false;
  this.reverse = false;

  var that = this;

  var updater = function() {
    si.processes(data => {
      that.updateData(data);
    })
  }
  updater();
  this.interval = setInterval(updater, 3000);
  this.table.screen.key(['m', 'c', 'p'], function(ch, key) {

    if (pars[ch] == that.pSort) {

      that.reverse = !that.reverse;
    } else {
      that.pSort = pars[ch] || that.pSort;
    }

    that.reIndex = true;
    updater();
  });

  var form;

  this.table.rows.on('select', (node, index) => {
    this.selectedProc = node.parent.value.match(/[0-9]+/g)[0];
    
    form = blessed.form({
      parent: screen,
      width: 60,
      height: 4,
      keys: true,
      border: {
        type: 'line'
      },
      top: 'center',
      left: 'center'
    });

    blessed.text({
      parent: form,
      fg: 'green',
      content: 'Press y button to kill process #'+this.selectedProc+ ' \n Or, press n button to cancel'
    });
    
    form.on('submit', (data) => {
      screen.remove(form);
      process.kill(this.selectedProc, 'SIGHUP');
    });

    screen.render();
  });

  screen.key(['y'], (ch, key) => {
    form.submit();  
  });

  screen.key(['n'], (ch, key) => {
    screen.remove(form);
    this.selectedProc = 0;
  });

}

Proc.prototype.updateData = function(data) {
  var par = this.pSort;

  var data = data.list
    .sort(function(a, b) {
      return b[par] - a[par];
    })
    .map(p => {
      return [
        p.pid,
        p.command, //.slice(0,10),
        ' ' + p.pcpu.toFixed(1),
        p.pmem.toFixed(1)
      ]

    })

  var headers = ['PID', 'Command', '%CPU', '%MEM'];

  headers[{
    pid: 0,
    pcpu: 2,
    pmem: 3
  }[this.pSort]] += this.reverse ? '▲' : '▼';


  this.table.setData({
    headers: headers,
    data: this.reverse ? data.reverse() : data
  })

  if (this.reIndex) {
    this.table.rows.select(0);
    this.reIndex = false;
  }

  this.table.screen.render();
};

module.exports = Proc;

var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

var pars = {
  p: 'pid',
  c: 'cpu',
  m: 'mem',
};

function Proc(table) {
  this.table = table;

  this.pSort = pars.c;
  this.reIndex = false;
  this.reverse = false;
  this.searchTerm = '';
  this.allData = [];

  var that = this;

  var updater = function() {
    si.processes(data => {
      that.updateData(data);
    });
  };
  updater();
  this.interval = setInterval(updater, 3000);
  // Add search functionality
  this.table.screen.key(['/'], function(ch, key) {
    that.table.screen.readInput('Search: ', '', function(err, value) {
      if (!err && value) {
        that.searchTerm = value.toLowerCase();
        that.reIndex = true;
        updater();
      }
    });
  });
  
  // Clear search
  this.table.screen.key(['escape'], function(ch, key) {
    if (that.searchTerm) {
      that.searchTerm = '';
      that.reIndex = true;
      updater();
    }
  });
  
  this.table.screen.key(['m', 'c', 'p'], function(ch, key) {
    if (pars[ch] == that.pSort) {
      that.reverse = !that.reverse;
    } else {
      that.pSort = pars[ch] || that.pSort;
    }

    that.reIndex = true;
    updater();
  });
}

Proc.prototype.updateData = function(data) {
  if (!data || !data.list || !Array.isArray(data.list)) {
    return;
  }
  
  var par = this.pSort;
  this.allData = data.list;

  // Filter by search term if present
  var filteredList = data.list;
  if (this.searchTerm) {
    filteredList = data.list.filter(p => {
      return p.command.toLowerCase().includes(this.searchTerm) ||
             p.pid.toString().includes(this.searchTerm);
    });
  }

  var data = filteredList
    .sort(function(a, b) {
      return b[par] - a[par];
    })
    .map(p => {
      return [
        p.pid,
        p.command, //.slice(0,10),
        ' ' + p.cpu.toFixed(1),
        p.mem.toFixed(1),
      ];
    });

  var headers = ['PID', 'Command', '%CPU', '%MEM'];
  
  // Add search indicator to headers
  if (this.searchTerm) {
    headers[1] = `Command (/${this.searchTerm})`;
  }

  headers[
    {
      pid: 0,
      cpu: 2,
      mem: 3,
    }[this.pSort]
  ] += this.reverse ? '▲' : '▼';

  this.table.setData({
    headers: headers,
    data: this.reverse ? data.reverse() : data,
  });

  if (this.reIndex) {
    this.table.rows.select(0);
    this.reIndex = false;
  }

  this.table.screen.render();
};

Proc.prototype.cleanup = function() {
  if (this.interval) {
    clearInterval(this.interval);
  }
};

module.exports = Proc;

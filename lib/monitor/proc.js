var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

var pars = {
  p: 'pid',
  c: 'cpu',
  m: 'mem',
};

const blessed = require("blessed")
let processSearchTerm = ""

function Proc(table, screen) {
  this.screen = screen
  this.table = table;

  this.pSort = pars.c;
  this.reIndex = false;
  this.reverse = false;

  var that = this;

  var updater = function() {
    si.processes(data => {

      // If processSearchTerm looks like a regular expression use that to filter
      // the process list. Otherwise, just do a simple string match.
      if (processSearchTerm.length > 0) {
        if (processSearchTerm[0] === "/" && processSearchTerm[processSearchTerm.length - 1] === "/") {
          const regex = new RegExp(processSearchTerm.slice(1, -1))
          data.list = data.list.filter(p => regex.test(p.name.toLowerCase()) || regex.test(p.command.toLowerCase()))
        } else {
          data.list = data.list.filter(p => p.name.toLowerCase().includes(processSearchTerm) || p.command.toLowerCase().includes(processSearchTerm))
        }
      }
      that.updateData(data)
    });
  };
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

  this.screen.key(['s'], (ch, key) => {
    try {
      const dialogMessage = 
        `Enter Search Parameter
         (Use regular expressions by wrapping in //)`
      let searchPrompt = blessed.prompt({top: "top", left: "center", width: "shrink", height: "shrink", border: { type: "line" }})
      screen.append(searchPrompt)
      searchPrompt.readInput(dialogMessage, processSearchTerm, (err, obj) => {
        processSearchTerm = err ? "" : obj.toString().toLowerCase()
      })
      updater()
    } catch (e) {
      console.log(e.message)
      consol.error(e)
    }
  })
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
        ' ' + p.cpu.toFixed(1),
        p.mem.toFixed(1),
      ];
    });

  let searchedCommand = `Command`
  if (processSearchTerm.length > 0) {
    searchedCommand = `Command (${processSearchTerm})`
  }
  var headers = ['PID', searchedCommand, '%CPU', '%MEM'];

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

module.exports = Proc;

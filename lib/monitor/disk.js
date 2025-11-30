var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

function Disk(donut, alertThreshold) {
  this.donut = donut;
  this.alertThreshold = alertThreshold || 90; //Holds 90% for alert threshold

  si.fsSize(data => {
    if (data && data.length > 0) {
    this.updateData(data[0]);
  } else {
    console.error('Failed to fetch disk information');
  }
  });

  this.interval = setInterval(() => {
    si.fsSize(data => {
      if (data && data.length > 0) {
        this.updateData(data[0]);
      } else {
        console.error('Failed to fetch disk information');
      }
    //  this.updateData(data);
    });
  }, 10000);
}

Disk.prototype.updateData = function(data) {
  var disk = data;

  var label =
    utils.humanFileSize(disk.used, true) +
    ' of ' +
    utils.humanFileSize(disk.size, true);
//Update data chart with disk usage data
  this.donut.setData([
    {
      percent: disk.use / 100,
      label: label,
      color: colors[5],
    },
  ]);
  //Check if disk usage exceeds the alert threshold
  if (disk.use >= this.alertThreshold) {
    sendAlert('Disk usage is over ' + this.alertThreshold + '%!');
  }
  this.donut.screen.render();
};

function sendAlert(message) {
  //Implement alerting sendoing emailing, logging, and messaging.
  console.log("AlERT:", message);
}

module.exports = Disk;

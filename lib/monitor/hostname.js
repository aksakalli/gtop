var si = require('systeminformation'),
    utils = require('../utils');

var colors = utils.colors;

function Host(markdown) {
    this.markdown = markdown;

    this.interval = setInterval(() => {
        this.updateData();
      }, 1000);
}

Host.prototype.updateData = function () {
    si.osInfo((info) => {
        this.markdown.setMarkdown(info.hostname);
    })
}


module.exports = Host;

const fs = require('fs');
const path = require('path');
const config = require('./config');

class Exporter {
  constructor() {
    this.monitors = [];
    this.interval = null;
    this.exportPath = config.get('export.path') || './metrics';
  }

  init(monitors) {
    this.monitors = monitors;
    
    // Create export directory if it doesn't exist
    if (!fs.existsSync(this.exportPath)) {
      fs.mkdirSync(this.exportPath, { recursive: true });
    }

    // Start periodic export if configured
    const interval = config.get('export.interval');
    if (interval && interval > 0) {
      this.interval = setInterval(() => {
        this.export();
      }, interval);
    }
  }

  export(format) {
    const exportFormat = format || config.get('export.format') || 'json';
    const timestamp = new Date().toISOString();
    const metrics = this.collectMetrics();

    switch (exportFormat) {
      case 'json':
        this.exportJSON(metrics, timestamp);
        break;
      case 'csv':
        this.exportCSV(metrics, timestamp);
        break;
      case 'prometheus':
        this.exportPrometheus(metrics, timestamp);
        break;
      default:
        console.error(`Unknown export format: ${exportFormat}`);
    }
  }

  collectMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      cpu: null,
      memory: null,
      network: null,
      disk: null,
      processes: null
    };

    // Collect metrics from each monitor
    this.monitors.forEach(monitor => {
      if (monitor.constructor.name === 'Cpu' && monitor.cpuData) {
        metrics.cpu = monitor.cpuData.map(cpu => ({
          title: cpu.title,
          load: cpu.y[cpu.y.length - 1] || 0
        }));
      } else if (monitor.constructor.name === 'Mem' && monitor.memData) {
        metrics.memory = {
          usage: monitor.memData[0].percent || 0,
          swap: monitor.swapData ? monitor.swapData[0].percent : 0
        };
      } else if (monitor.constructor.name === 'Net' && monitor.netData) {
        metrics.network = {
          rx: monitor.netData[0][monitor.netData[0].length - 1] || 0,
          tx: monitor.netData[1][monitor.netData[1].length - 1] || 0
        };
      } else if (monitor.constructor.name === 'Disk' && monitor.diskData) {
        metrics.disk = monitor.diskData;
      } else if (monitor.constructor.name === 'Proc' && monitor.procData) {
        metrics.processes = monitor.procData;
      }
    });

    return metrics;
  }

  exportJSON(metrics, timestamp) {
    const filename = `metrics-${timestamp.replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(this.exportPath, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(metrics, null, 2));
    console.log(`Exported metrics to ${filepath}`);
  }

  exportCSV(metrics, timestamp) {
    const filename = `metrics-${timestamp.replace(/[:.]/g, '-')}.csv`;
    const filepath = path.join(this.exportPath, filename);
    
    let csv = 'timestamp,metric,value\n';
    
    // CPU metrics
    if (metrics.cpu) {
      metrics.cpu.forEach(cpu => {
        csv += `${timestamp},${cpu.title},${cpu.load}\n`;
      });
    }
    
    // Memory metrics
    if (metrics.memory) {
      csv += `${timestamp},memory_usage,${metrics.memory.usage}\n`;
      csv += `${timestamp},swap_usage,${metrics.memory.swap}\n`;
    }
    
    // Network metrics
    if (metrics.network) {
      csv += `${timestamp},network_rx,${metrics.network.rx}\n`;
      csv += `${timestamp},network_tx,${metrics.network.tx}\n`;
    }
    
    // Disk metrics
    if (metrics.disk && metrics.disk.percent) {
      csv += `${timestamp},disk_usage,${metrics.disk.percent}\n`;
    }
    
    fs.writeFileSync(filepath, csv);
    console.log(`Exported metrics to ${filepath}`);
  }

  exportPrometheus(metrics, timestamp) {
    const filename = `metrics-${timestamp.replace(/[:.]/g, '-')}.prom`;
    const filepath = path.join(this.exportPath, filename);
    
    let prom = '';
    const ts = Date.now();
    
    // CPU metrics
    if (metrics.cpu) {
      prom += '# HELP cpu_usage_percent CPU usage percentage\n';
      prom += '# TYPE cpu_usage_percent gauge\n';
      metrics.cpu.forEach((cpu, i) => {
        prom += `cpu_usage_percent{cpu="${i}"} ${cpu.load} ${ts}\n`;
      });
    }
    
    // Memory metrics
    if (metrics.memory) {
      prom += '# HELP memory_usage_percent Memory usage percentage\n';
      prom += '# TYPE memory_usage_percent gauge\n';
      prom += `memory_usage_percent ${metrics.memory.usage} ${ts}\n`;
      
      prom += '# HELP swap_usage_percent Swap usage percentage\n';
      prom += '# TYPE swap_usage_percent gauge\n';
      prom += `swap_usage_percent ${metrics.memory.swap} ${ts}\n`;
    }
    
    // Network metrics
    if (metrics.network) {
      prom += '# HELP network_rx_bytes Network received bytes per second\n';
      prom += '# TYPE network_rx_bytes gauge\n';
      prom += `network_rx_bytes ${metrics.network.rx} ${ts}\n`;
      
      prom += '# HELP network_tx_bytes Network transmitted bytes per second\n';
      prom += '# TYPE network_tx_bytes gauge\n';
      prom += `network_tx_bytes ${metrics.network.tx} ${ts}\n`;
    }
    
    // Disk metrics
    if (metrics.disk && metrics.disk.percent) {
      prom += '# HELP disk_usage_percent Disk usage percentage\n';
      prom += '# TYPE disk_usage_percent gauge\n';
      prom += `disk_usage_percent ${metrics.disk.percent} ${ts}\n`;
    }
    
    fs.writeFileSync(filepath, prom);
    console.log(`Exported metrics to ${filepath}`);
  }

  cleanup() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

module.exports = new Exporter();
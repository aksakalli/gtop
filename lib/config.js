const fs = require('fs');
const path = require('path');
const os = require('os');

class Config {
  constructor() {
    this.defaults = {
      updateIntervals: {
        cpu: 1000,
        memory: 1000,
        network: 1000,
        disk: 10000,
        process: 3000
      },
      theme: 'default',
      colors: ['magenta', 'cyan', 'blue', 'yellow', 'green', 'red'],
      monitors: {
        cpu: true,
        memory: true,
        network: true,
        disk: true,
        process: true
      },
      export: {
        enabled: false,
        format: 'json', // json, csv, prometheus
        path: './metrics',
        interval: 60000
      },
      processFilter: '',
      keybindings: {
        quit: ['q', 'escape', 'C-c'],
        sortByPid: 'p',
        sortByCpu: 'c',
        sortByMem: 'm',
        search: '/',
        export: 'e'
      }
    };
    
    this.config = { ...this.defaults };
    this.configPath = this.getConfigPath();
    this.load();
  }

  getConfigPath() {
    // Check for config in multiple locations
    const locations = [
      path.join(process.cwd(), '.gtoprc'),
      path.join(process.cwd(), '.gtoprc.json'),
      path.join(os.homedir(), '.gtoprc'),
      path.join(os.homedir(), '.gtoprc.json'),
      path.join(os.homedir(), '.config', 'gtop', 'config.json')
    ];

    for (const location of locations) {
      if (fs.existsSync(location)) {
        return location;
      }
    }

    // Default to home directory
    return path.join(os.homedir(), '.gtoprc.json');
  }

  load() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        const userConfig = JSON.parse(data);
        this.config = this.deepMerge(this.defaults, userConfig);
        console.log(`Loaded config from ${this.configPath}`);
      }
    } catch (err) {
      console.error(`Error loading config: ${err.message}`);
      // Fall back to defaults
      this.config = { ...this.defaults };
    }
  }

  save() {
    try {
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(
        this.configPath,
        JSON.stringify(this.config, null, 2),
        'utf8'
      );
      console.log(`Config saved to ${this.configPath}`);
    } catch (err) {
      console.error(`Error saving config: ${err.message}`);
    }
  }

  get(key) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  set(key, value) {
    const keys = key.split('.');
    let obj = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in obj) || typeof obj[k] !== 'object') {
        obj[k] = {};
      }
      obj = obj[k];
    }
    
    obj[keys[keys.length - 1]] = value;
  }

  deepMerge(target, source) {
    const output = { ...target };
    
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    
    return output;
  }

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  generateSample() {
    const sample = {
      "// Note": "This is a sample gtop configuration file",
      "// Save as": "~/.gtoprc.json",
      ...this.defaults
    };
    
    return JSON.stringify(sample, null, 2);
  }
}

module.exports = new Config();
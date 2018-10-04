# gtop

![screen record](https://raw.githubusercontent.com/aksakalli/gtop/master/img/demo.gif)

System monitoring dashboard for terminal.

  [![NPM Version](https://img.shields.io/npm/v/gtop.svg)](https://npmjs.org/package/gtop)
  [![NPM Downloads](https://img.shields.io/npm/dm/gtop.svg)](https://npmjs.org/package/gtop)
  [![Snap Status](https://build.snapcraft.io/badge/aksakalli/gtop.svg)](https://build.snapcraft.io/user/aksakalli/gtop)

### Requirements

* Linux / OSX / Windows (partial support)
* Node.js >= v4

### Installation

```
$ npm install gtop -g
```

### Usage

Start gtop with the `gtop` command

```sh
$ gtop
```

To stop gtop use `q`, or `ctrl+c` in most shell environments.

You can sort the process table by pressing

* `p`: Process Id
* `c`: CPU usage
* `m`: Memory usage

### Troubleshooting
#### Problems with character encoding

If you see question marks or other different characters, try to run it with these environment variables:

```
$ LANG=en_US.utf8 TERM=xterm-256color gtop
```

#### Incomplete Network History
If Network History is shown without transfared data, try to increase the number of shown lines in your terminal screen.

## License

Released under [the MIT license](LICENSE).

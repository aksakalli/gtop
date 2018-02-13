# gtop

![screen record](https://raw.githubusercontent.com/aksakalli/gtop/master/img/demo.gif)

System monitoring dashboard for terminal.

  [![NPM Version](https://img.shields.io/npm/v/gtop.svg)](https://npmjs.org/package/gtop)
  [![NPM Downloads](https://img.shields.io/npm/dm/gtop.svg)](https://npmjs.org/package/gtop)
  [![Snap Status](https://build.snapcraft.io/badge/aksakalli/gtop.svg)](https://build.snapcraft.io/user/aksakalli/gtop)

### Requirements

* Linux / OSX / Windows (partial support)
* Node.js >= v4
* nvidia-smi (GPU mode only)

### Installation

```
$ npm install gtop -g
```

### Usage
* argument
  * CPU mode

    ```
    $ gtop
    ```

  * GPU mode

    ```
    $ gtop -g
    ```

* sort the process table by pressing
  * `p`: Process Id
  * `c`: CPU usage
  * `m`: Memory usage

### Troubleshooting

If you see question marks or other different characters, try to run it with these environment variables:

```
$ LANG=en_US.utf8 TERM=xterm-256color gtop
```

## License

Released under [the MIT license](LICENSE).

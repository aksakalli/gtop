# gtop

![screen record](https://raw.githubusercontent.com/aksakalli/gtop/master/img/demo.gif)

System monitoring dashboard for terminal.

### Requirements

* Linux / OSX / Windows (partial support)
* Node.js >= v4

### Installation

```
$ npm install gtop -g
```

### Usage

You can sort the process table by pressing

* `p`: Process Id
* `c`: CPU usage
* `m`: Memory usage

### Troubleshooting

If you see questions marks or other different characters, try to run it with these environment variables:

```
$ LANG=en_US.utf8 TERM=xterm-256color gtop
```

## License

Released under [the MIT license](LICENSE).

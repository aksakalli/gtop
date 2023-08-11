# gtop

![screen record](https://raw.githubusercontent.com/aksakalli/gtop/master/img/demo.gif)

System monitoring dashboard for terminal.

  [![NPM Version](https://img.shields.io/npm/v/gtop.svg)](https://npmjs.org/package/gtop)
  [![NPM Downloads](https://img.shields.io/npm/dm/gtop.svg)](https://npmjs.org/package/gtop)
  [![Snap Status](https://snapcraft.io/gtop/badge.svg)](https://snapcraft.io/gtop)
  [![Docker Pulls](https://img.shields.io/docker/pulls/aksakalli/gtop)](https://hub.docker.com/r/aksakalli/gtop)
  [![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/aksakalli/gtop)](https://hub.docker.com/r/aksakalli/gtop/builds)

### Requirements

* Linux / OSX / Windows (partial support)
* Node.js >= v8

### Installation

```sh
$ npm install gtop -g
```

#### Docker

You need to assign host `net` and `pid` to access the metrics in the host machine.

```sh
$ docker run --rm -it \
    --name gtop \
    --net="host" \
    --pid="host" \
    aksakalli/gtop
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

If you see question marks or other different characters, try to run it with these environment variables:

```sh
$ LANG=en_US.utf8 TERM=xterm-256color gtop
```

## License

Released under [the MIT license](LICENSE).

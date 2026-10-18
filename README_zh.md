> **语言**：本文档为简体中文翻译，[点此查看英文原版 README.md](README.md)。

# gtop

![screen record](https://raw.githubusercontent.com/aksakalli/gtop/master/img/demo.gif)

终端系统监控仪表盘。

  [![NPM Version](https://img.shields.io/npm/v/gtop.svg)](https://npmjs.org/package/gtop)
  [![NPM Downloads](https://img.shields.io/npm/dm/gtop.svg)](https://npmjs.org/package/gtop)
  [![Snap Status](https://snapcraft.io/gtop/badge.svg)](https://snapcraft.io/gtop)
  [![Docker Pulls](https://img.shields.io/docker/pulls/aksakalli/gtop)](https://hub.docker.com/r/aksakalli/gtop)
  [![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/aksakalli/gtop)](https://hub.docker.com/r/aksakalli/gtop/builds)

### 运行环境

* Linux / OSX / Windows（部分支持）
* Node.js >= v8

### 安装

```sh
$ npm install gtop -g
```

#### Docker

你需要将宿主机的 `net` 和 `pid` 分配给容器，才能访问宿主机上的指标。

```sh
$ docker run --rm -it \
    --name gtop \
    --net="host" \
    --pid="host" \
    aksakalli/gtop
```

### 用法

使用 `gtop` 命令启动 gtop

```sh
$ gtop
```

要停止 gtop，请使用 `q`，或在大多数 shell 环境中使用 `ctrl+c`。

你可以使用以下按键对进程表排序

* `p`：进程 ID
* `c`：CPU 使用率
* `m`：内存使用率

### 故障排查

如果你看到问号或其他不同的字符，请尝试设置以下环境变量后运行：

```sh
$ LANG=en_US.utf8 TERM=xterm-256color gtop
```

## 许可证

基于[MIT 许可证](LICENSE)发布。

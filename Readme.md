# iLastlog

## 📝 Desc

the lastlog command on Ubuntu 24.04.1 don't worked.  
That's why I created this command.

## 📦 Requirements

- **Node.js**: `>=20.11.1` (version tested: 20.11.1)
- **npm**: `>=10.2.4` (version tested: 10.2.4)
- **Bash**: `>=5.2.21` (version tested: 5.2.21)
- **Not supported Windows OS**

⚠️ 다른 버전에서도 정상적으로 작동할 수 있지만, 공식적으로 테스트된 버전은 위와 같습니다.

## ✨ Features

.

## 📥 Installation

## CLI

    $ npm install --global ilastlog

## API

    $ cd your_project
    $ npm install ilastlog

## 🚀 Usage

ilastlog [options] [argText]

### CLI (using Shell)

    $ #  Not supported yet.   #

### CLI (using Node)

    $ ilastlog -h
    $ cat /var/log/auth.log | ilastlog
    or
    $ ilastlog "timeStamp log context"
    or
    $ cat /var/log/auth.log | npx ilastlog

### API

    const { ilastlog } = require("ilastlog");
    ilastlog(sampleTexts);

## 🧪 Sample

    $ npm run sample (or node sample.js)

## 🔧 Configs

.

## 🚀 Upcoming Features

1. command options

- help: how to usage command
- delimiter: for captured textline
- hint: to find lines using words
-

2. add new command for configure
3. add options on API

## 📖 Docs

[Wiki](https://github.com/ChangRaeJoe/ilastlog/wiki)

## 📜 License

[MIT](https://github.com/ChangRaeJoe/ilastlog?tab=MIT-1-ov-file)

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

### CLI

    $ npm install --global ilastlog

### API

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
## Format
### supported time format
    syslog   "MMM dd HH:mm:ss"
    ISO8601  "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"
    RFC2822  "EEE, dd MMM yyyy HH:mm:ss ZZ" 

## 🚀 Upcoming Features

1. command options
2. add new command for configure
- format add, remove
3. add options on API
- format add, remove

## 📖 Docs

[Wiki](https://github.com/ChangRaeJoe/ilastlog/wiki)

## 📜 License

[MIT](https://github.com/ChangRaeJoe/ilastlog?tab=MIT-1-ov-file)

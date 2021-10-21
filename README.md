# hexo-remove-sth

In Hexo, some themes will generate resource files you don't want. Use this to delete them before deployment.

## Installation

``` bash
$ npm install @kur4ge/hexo-delete-sth --save
```

## Usage

### Setting up the configuration in _config.ymal
```
deploy:
  -
    type: 'delete-sth'
    deleteFiles:  # 支持 * 语法
      - img/logo.svg    # delete img/logo.svg
      - *.html          # delete all html files
    deleteEmptyFolder: true # if folder is empty, delete it
```

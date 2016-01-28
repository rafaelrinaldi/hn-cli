# hn-cli [![Build Status](https://semaphoreci.com/api/v1/projects/b264dc61-16ef-44f3-8130-4fbb5dd25169/676578/badge.svg)](https://semaphoreci.com/rafaelrinaldi/hn-cli)

> CLI to browse [Hacker News](http://news.ycombinator.com)

[![demo](./demo.png)](https://cloudup.com/iUsrpNT00WI)

## Install

```sh
$ npm install -g @rafaelrinaldi/hn-cli
```

## Usage

```sh
Usage: hn [OPTIONS]

  CLI to browse Hacker News

Example:
  $ hn --limit 10 --keep-open

Options:
  -v --version              Display current software version.
  -h --help                 Display help and usage details.
  -l --limit                Limit the number of items to display (defaults to 150).
  -k --keep-open            Wether or not to keep the list open after selecting an item (defaults to false).
```

## Features

* Will fetch the latest stories (same order as seen on HN)
* You can use Vim arrow keys <kbd>j</kbd> and <kbd>k</kbd> to navigate through the list
* Use <kbd>gg</kbd> to scroll to the first item of the list and <kbd>G</kbd> to scroll to the last one
* Hitting the <kbd>enter</kbd> key will open the URL in your default browser
* Hitting the <kbd>c</kbd> key will open the HN comments for that story on your default browser
* Use <kbd>esc</kbd>, <kbd>⌃C</kbd> or <kbd>q</kbd> to close the program

## License

MIT © [Rafael Rinaldi](http://rinaldi.io)

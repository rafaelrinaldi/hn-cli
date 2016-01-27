# hn-cli

> CLI app to browse [Hacker News](http://news.ycombinator.com)

## Install

```sh
$ npm install -g @rafaelrinaldi/hn-cli --save
```

## Usage

```sh
Usage: hn [OPTIONS]

  CLI app to browse Hacker News

Example:
  $ hn --limit 10 --keep-open

Options:
  -v --version              Display current software version.
  -h --help                 Display help and usage details.
  -l --limit                Limit the number of items to display (defaults to `15`).
  -k --keep-open            Wether or not to keep the list open after selecting an item (defaults to `false`).
```

## Features

* Will always fetch the latest stories
* You can use Vim arrow keys <kbd>j</kbd> and <kbd>k</kbd> to navigate through the list
* When you select an item it'll open the URL on your default browser
* Use <kbd>esc</kbd>, <kbd>⌃C<kbd> or <kbd>q</kbd> to close the program

## License

MIT © [Rafael Rinaldi](http://rinaldi.io)

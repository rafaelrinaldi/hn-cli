'use strict';

const UI = require('blessed');
const noop = require('./noop');
const screenOptions = require('./renderer/options/screen');
const tableOptions = require('./renderer/options/table');
const ESCAPE_KEYS = ['escape', 'q', 'C-c'];

class Renderer {
  constructor(options) {
    this.options = options || {};
    this.onTableSelect = noop;
    this.onRefreshRequest = noop;
  }

  render(data) {
    this.screen = UI.screen(screenOptions);
    this.table = UI.listtable(tableOptions);

    this.statusBarLeft = UI.box({
      width: '90%',
      height: 1,
      left: 1,
      bottom: 1,
      fg: 'white',
      bg: 'black',
      padding: {
        left: 1
      }
    });
    this.statusBarRight = UI.box({
      width: 20,
      height: 1,
      right: 1,
      bottom: 1,
      fg: '#757575',
      bg: '#D9D9D9',
      padding: {
        left: 1,
        right: 1
      }
    });
    this.table.focus();
    this.table.setData(data);

    this.screen.append(this.table);
    this.screen.append(this.statusBarLeft);
    this.screen.append(this.statusBarRight);
    this.screen.render();

    this.setupEvents();
    this.reportProgress();
  }

  update(data) {
    this.table.setData(data);
    this.screen.render();
  }

  get selected() {
    return this.table.selected;
  }

  get totalItems() {
    return this.table.items.length;
  }

  set status(text) {
    this.statusBarLeft.setContent(text);
    this.screen.render();
  }

  get progress() {
    return `${this.selected / this.totalItems * 100 ^ 0}%`;
  }

  setupEvents() {
    this.screen.onceKey(ESCAPE_KEYS, this.destroyScreenOnKeypress.bind(this));
    this.screen.key('c', this.notifySelectedOnKeypress.bind(this));
    this.screen.key('r', this.requestRefreshOnKeypress.bind(this));
    this.table.on('select', this.notifySelectedOnSelect.bind(this));
    this.table.on('keypress', this.reportProgress.bind(this));
    this.table.on('prerender', this.reportProgress.bind(this));
  }

  destroyScreenOnKeypress() {
    this.screen.destroy();
  }

  notifySelectedOnKeypress() {
    this.selectTableItem(this.table.selected, 'c');
  }

  notifySelectedOnSelect() {
    this.selectTableItem(this.table.selected, 'enter');
  }

  requestRefreshOnKeypress() {
    this.onRefreshRequest();
    this.screen.render();
  }

  reportProgress() {
    const status = `HN | ${this.progress} | ${this.selected}:${this.totalItems - 1}`;
    this.statusBarRight.setContent(status);
  }

  selectTableItem(index, key) {
    if (this.options.shouldCloseOnSelect) {
      this.screen.destroy();
    }

    this.onTableSelect(index, key);
  }
}

module.exports = Renderer;

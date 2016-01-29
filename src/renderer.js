'use strict';

const UI = require('blessed');
const noop = require('./noop');
const screenOptions = require('./renderer/options/screen');
const tableOptions = require('./renderer/options/table');
const statusBarOptions = require('./renderer/options/status-bar');
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

    this.statusBarLeft = UI.box(statusBarOptions.left);
    this.statusBarRight = UI.box(statusBarOptions.right);

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

  get progress() {
    return `${this.selected / (this.totalItems - 1) * 100 ^ 0}%`;
  }

  set status(text) {
    this.statusBarLeft.setContent(text);
    this.screen.render();
  }

  setupEvents() {
    this.screen.onceKey(ESCAPE_KEYS, this.destroyScreen);
    this.screen.key('c', this.notifySelectedOnKeypress.bind(this));
    this.screen.key('r', this.requestRefreshOnKeypress.bind(this));
    this.table.on('select', this.notifySelectedOnSelect.bind(this));
    this.table.on('keypress', this.reportProgress.bind(this));
  }

  destroyScreen() {
    return process.exit(0);
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
    this.screen.render();
  }

  selectTableItem(index, key) {
    this.onTableSelect(index, key);

    if (this.options.shouldCloseOnSelect) {
      this.destroyScreen();
    }
  }
}

module.exports = Renderer;

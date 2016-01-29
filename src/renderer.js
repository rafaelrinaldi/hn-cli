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
    this.statusBar = UI.box(statusBarOptions);

    this.table.focus();
    this.table.setData(data);

    this.screen.append(this.table);
    this.screen.append(this.statusBar);
    this.screen.render();

    this.setupEvents();
  }

  update(data) {
    this.table.setData(data);
    this.screen.render();
  }

  setStatus(text) {
    this.statusBar.setContent(text);
    this.screen.render();
  }

  setupEvents() {
    this.screen.onceKey(ESCAPE_KEYS, this.destroyScreenOnKeypress.bind(this));
    this.screen.key('c', this.notifySelectedOnKeypress.bind(this));
    this.screen.key('r', this.requestRefreshOnKeypress.bind(this));
    this.table.on('select', this.notifySelectedOnSelect.bind(this));
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

  selectTableItem(index, key) {
    if (this.options.shouldCloseOnSelect) {
      this.screen.destroy();
    }

    this.onTableSelect(index, key);
  }
}

module.exports = Renderer;

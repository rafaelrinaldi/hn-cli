'use strict';

const UI = require('blessed');
const screenOptions = require('./renderer/options/screen');
const tableOptions = require('./renderer/options/table');
const ESCAPE_KEYS = ['escape', 'q', 'C-c'];

class Renderer {
  constructor(options) {
    this.options = options || {};
  }

  render(data) {
    this.screen = UI.screen(screenOptions);
    this.table = UI.listtable(tableOptions);

    this.table.focus();
    this.table.setData(data);

    this.screen.append(this.table);
    this.screen.render();

    this.setupEvents();
  }

  setupEvents() {
    this.screen.key(ESCAPE_KEYS, this.destroyScreenOnKeypress.bind(this));
    this.screen.key('c', this.notifySelectedOnKeypress.bind(this));
    this.table.on('select', this.notifySelectedOnSelect.bind(this));
  }

  destroyScreenOnKeypress() {
    return this.screen.destroy();
  }

  notifySelectedOnKeypress() {
    this.selectTableItem(this.table.selected, 'c');
  }

  notifySelectedOnSelect() {
    this.selectTableItem(this.table.selected, 'enter');
  }

  selectTableItem(index, key) {
    if (this.options.shouldCloseOnSelect) {
      this.screen.destroy();
    }

    this.options.onTableSelect(index, key);
  }
}

module.exports = Renderer;

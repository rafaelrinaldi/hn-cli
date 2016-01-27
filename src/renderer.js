var UI = require('blessed');
var screenOptions = require('./renderer/options/screen');
var tableOptions = require('./renderer/options/table');
var ESCAPE_KEYS = ['escape', 'q', 'C-c'];

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.setupEvents = function() {
  this.screen.key(ESCAPE_KEYS, this.destroyScreenOnKeypress.bind(this));
  this.table.on('select', this.notifySelectedOnSelect.bind(this));
};

Renderer.prototype.destroyScreenOnKeypress = function() {
  return this.screen.destroy();
};

Renderer.prototype.notifySelectedOnSelect = function() {
  if (this.options.shouldCloseOnSelect) {
    this.screen.destroy();
  }

  if (this.options.onTableSelect) {
    this.options.onTableSelect(this.table.selected);
  }
};

Renderer.prototype.render = function(data) {
  if (!this.screen) {
    this.screen = UI.screen(screenOptions);
  }

  if (!this.table) {
    this.table = UI.listtable(tableOptions);
  }

  this.setupEvents();

  this.table.focus();
  this.table.setData(data);

  this.screen.append(this.table);
  this.screen.render();
};

module.exports = Renderer;

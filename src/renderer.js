var blessed = require('blessed');
var ESCAPE_KEYS = ['escape', 'q', 'C-c'];

var screenOptions = {
  autoPadding: false,
  fullUnicode: true,
  title: 'HN'
}

var tableOptions = {
  data: null,
  top: 1,
  left: 1,
  keys: true,
  width: '100%',
  height: '50%',
  align: 'left',
  vi: true,
  mouse: true,
  style: {
    header: {
      inverse: true,
      bold: true
    },
    cell: {
      selected: {
        bg: 'lightgray'
      }
    }
  }
}

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
  this.screen.destroy();
  if(this.options.onTableSelect) this.options.onTableSelect(this.table.selected);
};

Renderer.prototype.render = function(data) {
  if(!this.screen) {
    this.screen = blessed.screen(screenOptions);
  }

  if(!this.table) {
    this.table = blessed.listtable(tableOptions);
  }

  this.setupEvents();

  this.table.focus();
  this.table.setData(data);

  this.screen.append(this.table);
  this.screen.render();
}

module.exports = Renderer;

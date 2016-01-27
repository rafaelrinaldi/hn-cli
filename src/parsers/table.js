module.exports = function(data) {
  return [[
    'Title',
    'Score',
    'Comments',
    'Author'
  ]].concat(
      data.map(function(item) {
        return [
          String(item.title),
          String(item.score),
          String(item.descendants),
          String(item.by)
        ];
      })
    );
};

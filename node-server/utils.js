const mpd = require('mpd');

let formatList = function(msg) {
  let list = msg.split('\n');
  let result = []
  list.forEach(e => {
    if (e) {
      result.push(mpd.parseKeyValueMessage(e));
    }
  });
  return result;
}
module.exports.formatList = formatList;

module.exports.formatListMulti = function(msg, treshold) {
  let list = [];
  let elem;
  formatList(msg).forEach((att, i) => {
    if (Object.keys(att)[0] == treshold) {
      if (elem) list.push(elem);
      elem = {};
    }
    elem = Object.assign(elem, att);
  });
  list.push(elem);
  return list;
}

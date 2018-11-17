"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = exports.choices_sizes = exports.configRangeQuery = exports.configSortQuery = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var configSortQuery = function configSortQuery(sortString) {
  var sortObj = {};

  if (typeof sortString != "undefined") {
    var arr = JSON.parse(sortString);
    sortObj[arr[0]] = arr[1];
  }

  return sortObj;
}; // react-admin sends a range [0,9] and I am transforming
// it in offset: 0, limit: 10


exports.configSortQuery = configSortQuery;

var configRangeQuery = function configRangeQuery(rangeString) {
  var rangeObj = {};

  if (typeof rangeString != "undefined") {
    var arr = JSON.parse(rangeString);
    rangeObj = {
      offset: arr[0],
      limit: arr[1] + 1
    };
  }

  return rangeObj;
};

exports.configRangeQuery = configRangeQuery;

var choices_sizes =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Object([{
              id: 'mini',
              name: 'Mini',
              order: 1
            }, {
              id: 'pequena',
              name: 'Pequena',
              order: 2
            }, {
              id: 'media',
              name: 'Média',
              order: 3
            }, {
              id: 'grande',
              name: 'Grande',
              order: 4
            }, {
              id: 'gigante',
              name: 'Gigante',
              order: 5
            }]));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function choices_sizes() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Shuffle (randomize) the elements of array
 * @param {*} array 
 */


exports.choices_sizes = choices_sizes;

var shuffle = function shuffle(array) {
  var currentIndex = array.length,
      temporaryValue,
      randomIndex; // While there remain elements to shuffle...

  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // And swap it with the current element.

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

exports.shuffle = shuffle;
//# sourceMappingURL=util.js.map
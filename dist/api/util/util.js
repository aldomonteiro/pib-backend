"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = exports.choices_kinds = exports.choices_sizes = exports.configFilterQueryMultiple = exports.configFilterQuery = exports.configRangeQueryNew = exports.configRangeQuery = exports.configSortQuery = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var configSortQuery = function configSortQuery(sortString) {
  var sortObj = {};

  if (typeof sortString != "undefined") {
    var arr = JSON.parse(sortString);
    sortObj[arr[0]] = arr[1];
  }

  return sortObj;
};
/**
 * This function is deprecated and is used with the mongoose paginate plugin.
 * Insted of this function, use configRangeQueryNew
 * react-admin sends a range [0,9] and I am transforming it in offset: 0, limit: 10
 * @param {*} rangeString 
 */


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
/**
 * Using without the paginate plugin.
 * @param {*} rangeString 
 */


exports.configRangeQuery = configRangeQuery;

var configRangeQueryNew = function configRangeQueryNew(rangeString) {
  if (typeof rangeString !== "undefined") {
    var json = JSON.parse(rangeString);
    return {
      offset: json[0],
      limit: json[1] + 1 - json[0]
    };
  } else return null;
};

exports.configRangeQueryNew = configRangeQueryNew;

var configFilterQuery = function configFilterQuery(filterString) {
  if (typeof filterString !== "undefined") {
    var json = JSON.parse(filterString);
    var _field = Object.keys(json)[0];
    var _values = Object.values(json)[0];
    return {
      filterField: _field,
      filterValues: _values
    };
  } else return null;
};

exports.configFilterQuery = configFilterQuery;

var configFilterQueryMultiple = function configFilterQueryMultiple(filterString) {
  if (typeof filterString !== "undefined") {
    var json = JSON.parse(filterString);
    return {
      filterField: Object.keys(json),
      filterValues: Object.values(json)
    };
  } else return null;
};

exports.configFilterQueryMultiple = configFilterQueryMultiple;

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

exports.choices_sizes = choices_sizes;

var choices_kinds = function choices_kinds() {
  return [{
    id: 'tradicional',
    name: 'Tradicional'
  }, {
    id: 'especial',
    name: 'Especial'
  }, {
    id: 'doce',
    name: 'Doce'
  }];
};
/**
 * Shuffle (randomize) the elements of array
 * @param {*} array 
 */


exports.choices_kinds = choices_kinds;

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
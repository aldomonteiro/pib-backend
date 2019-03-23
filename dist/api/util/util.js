"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatAsCurrency = exports.formatWhatsappNumber = exports.distanceBetweenCoordinates = exports.shuffle = exports.choices_kinds = exports.choices_sizes = exports.configFilterQueryMultiple = exports.configFilterQuery = exports.configRangeQueryNew = exports.configRangeQuery = exports.configSortQuery = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var configSortQuery = function configSortQuery(sortString) {
  var sortObj = {};

  if (typeof sortString != 'undefined') {
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
  if (typeof rangeString !== 'undefined') {
    var arr = JSON.parse(rangeString);
    return {
      offset: arr[0],
      limit: arr[1] + 1
    };
  } else return null;
};
/**
 * Using without the paginate plugin.
 * @param {*} rangeString 
 */


exports.configRangeQuery = configRangeQuery;

var configRangeQueryNew = function configRangeQueryNew(rangeString) {
  if (typeof rangeString !== 'undefined') {
    var json = JSON.parse(rangeString);
    return {
      offset: json[0],
      limit: json[1] + 1 - json[0]
    };
  } else return null;
};

exports.configRangeQueryNew = configRangeQueryNew;

var configFilterQuery = function configFilterQuery(filterString) {
  if (typeof filterString !== 'undefined') {
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
  if (typeof filterString !== 'undefined') {
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
            return _context.abrupt("return", [{
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
            }]);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
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

var degreesToRadians = function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
};

var distanceBetweenCoordinates = function distanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  if (lat1 && lon1 && lat2 && lon2) {
    var earthRadiusKm = 6371;
    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  } else return null;
};
/**
 * Whatsapp send the id this way: "554184163676@c.us",
 * I am removing the last part, after @.
 * @param {*} id
 */


exports.distanceBetweenCoordinates = distanceBetweenCoordinates;

var formatWhatsappNumber = function formatWhatsappNumber(id) {
  var index = id.indexOf('@');
  if (index > 0) return id.substr(0, index);else return id;
};
/**
 * Format as a currency
 * @param {*} amount
 */


exports.formatWhatsappNumber = formatWhatsappNumber;

var formatAsCurrency = function formatAsCurrency(amount) {
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumSignificantDigits: 2
  });
};

exports.formatAsCurrency = formatAsCurrency;
//# sourceMappingURL=util.js.map
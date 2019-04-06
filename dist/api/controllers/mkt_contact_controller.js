"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMktContact = exports.updateMktContact = void 0;

var _mkt_contact = _interopRequireDefault(require("../models/mkt_contact"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var updateMktContact =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(mktData) {
    var pageID, userID, last_answer, how_know_company, restaurant_related, restaurant_owner, restaurant_employee, started_test, saw_how_it_works, contact_form, contact_phone, contact_mail, text, _final, mktContact;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            pageID = mktData.pageID, userID = mktData.userID, last_answer = mktData.last_answer, how_know_company = mktData.how_know_company, restaurant_related = mktData.restaurant_related, restaurant_owner = mktData.restaurant_owner, restaurant_employee = mktData.restaurant_employee, started_test = mktData.started_test, saw_how_it_works = mktData.saw_how_it_works, contact_form = mktData.contact_form, contact_phone = mktData.contact_phone, contact_mail = mktData.contact_mail, text = mktData.text, _final = mktData["final"];
            _context.next = 4;
            return _mkt_contact["default"].findOne({
              pageId: pageID,
              userId: userID
            }).exec();

          case 4:
            mktContact = _context.sent;

            if (mktContact) {
              if (last_answer) mktContact.last_answer = last_answer;
              if (how_know_company) mktContact.how_know_company = how_know_company;
              if (typeof restaurant_related === 'boolean') mktContact.restaurant_related = restaurant_related;
              if (typeof restaurant_owner === 'boolean') mktContact.restaurant_owner = restaurant_owner;
              if (typeof restaurant_employee === 'boolean') mktContact.restaurant_employee = restaurant_employee;
              if (contact_form) mktContact.contact_form = contact_form;
              if (typeof started_test === 'boolean') mktContact.started_test = started_test;
              if (typeof saw_how_it_works === 'boolean') mktContact.saw_how_it_works = saw_how_it_works;
              if (contact_phone) mktContact.contact_phone = contact_phone;
              if (contact_mail) mktContact.contact_mail = contact_mail;
              if (text) mktContact.free_msg = text;
              if (typeof _final === 'boolean') mktContact["final"] = _final;
            } else {
              mktContact = new _mkt_contact["default"]({
                pageId: pageID,
                userId: userID,
                last_answer: last_answer,
                restaurant_related: restaurant_related,
                restaurant_owner: restaurant_owner,
                restaurant_employee: restaurant_employee,
                contact_form: contact_form,
                contact_phone: contact_phone,
                contact_mail: contact_mail,
                free_msg: text,
                "final": _final
              });
            }

            _context.next = 8;
            return mktContact.save();

          case 8:
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.error({
              updateMktContact: _context.t0
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function updateMktContact(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateMktContact = updateMktContact;

var getMktContact =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(mktData) {
    var pageID, userID;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pageID = mktData.pageID, userID = mktData.userID;
            _context2.next = 3;
            return _mkt_contact["default"].findOne({
              userId: userID,
              pageId: pageID
            }).exec();

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getMktContact(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getMktContact = getMktContact;
//# sourceMappingURL=mkt_contact_controller.js.map
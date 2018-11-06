"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("../models/users"));

var _util = _interopRequireDefault(require("util"));

var _stringCapitalizeName = _interopRequireDefault(require("string-capitalize-name"));

var _util2 = require("../util/util");

var _usersController = require("../controllers/usersController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router(); // Authenticate user


router.post('/auth', _usersController.users_auth); // Create/update/authenticate user

router.post('/create', _usersController.users_create); // TODO: move to usersController
// List all users
// TODO: use filters in the query req.query

router.get("/", function (req, res) {
  var sortObj = (0, _util2.configSortQuery)(req.query.sort);

  _users.default.find().sort(sortObj).then(function (result) {
    res.setHeader('Content-Range', _util.default.format("users %d-%d/%d", result.length, 1, result.length));
    res.json(result);
  });
});
router.get("/:id", function (req, res) {
  _users.default.findOne({
    id: req.params.id
  }).then(function (result) {
    res.json(result);
  });
}); // UPDATE

router.put('/:id', function (req, res) {
  var updatedElement = {
    id: req.body.id,
    name: sanitizeName(req.body.name),
    email: req.body.email
  };

  _users.default.findOneAndUpdate({
    id: req.params.id
  }, updatedElement).then(function (oldResult) {
    _users.default.findOne({
      id: req.params.id
    }).then(function (newResult) {
      res.json({
        data: {
          _id: newResult._id,
          id: newResult.id,
          name: newResult.name,
          email: newResult.email
        }
      });
    }).catch(function (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        msg: "Something went wrong. ".concat(err)
      });
      return;
    });
  }).catch(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        msg: "Something went wrong. ".concat(err)
      });
    }
  });
}); // DELETE

router.delete('/:id', function (req, res) {
  _users.default.findOneAndRemove({
    id: req.params.id
  }).then(function (result) {
    res.json({
      success: true,
      msg: "It has been deleted."
    });
  }).catch(function (err) {
    res.status(404).json({
      success: false,
      msg: 'Nothing to delete.'
    });
  });
});

var sanitizeName = function sanitizeName(name) {
  return (0, _stringCapitalizeName.default)(name);
};

var _default = router;
exports.default = _default;
//# sourceMappingURL=users.js.map
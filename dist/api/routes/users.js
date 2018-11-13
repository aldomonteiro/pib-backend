"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _usersController = require("../controllers/usersController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.post('/auth', _usersController.users_auth);
router.use(_authenticate.default); // CHECK TOKEN

router.post('/create', _usersController.users_create);
router.get("/", _usersController.users_get_all);
router.get("/:id", _usersController.users_get_one);
router.put('/:id', _usersController.users_update);
router.delete('/:id', _usersController.users_delete);
var _default = router;
exports.default = _default;
//# sourceMappingURL=users.js.map
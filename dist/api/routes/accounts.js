"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _accountsController = require("../controllers/accountsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.use(_authenticate.default); // CHECK TOKEN
// router.get('/', accounts_get_all); // GET_ALL

router.get('/:id', _accountsController.accounts_get_one); // GET_ONE
// router.post('/', store_create); // CREATE

router.put('/:id', _accountsController.accounts_update); // UPDATE
// router.delete('/:id', accounts_delete); // DELETE

var _default = router;
exports.default = _default;
//# sourceMappingURL=accounts.js.map
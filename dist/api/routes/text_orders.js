"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _textOrdersController = require("../controllers/textOrdersController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use(_authenticate["default"]); // CHECK TOKEN

router.get('/', _textOrdersController.text_order_get_all); // GET_ALL

router.get('/:id', _textOrdersController.text_order_get_one); // GET_ONE

router.put('/:id', _textOrdersController.text_order_update); // UPDATE

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=text_orders.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _ordersController = require("../controllers/ordersController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use(_authenticate["default"]); // CHECK TOKEN

router.get("/", _ordersController.order_get_all); // GET_ALL

router.get("/:id", _ordersController.order_get_one); // GET_ONE

router.put('/:id', _ordersController.order_update); // UPDATE

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=orders.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _toppingsController = require("../controllers/toppingsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use(_authenticate["default"]); // List all toppings

router.get("/", _toppingsController.topping_get_all); // List one topping

router.get("/:id", _toppingsController.topping_get_one); // Create a new topping

router.post('/', _toppingsController.topping_create); // DELETE

router["delete"]('/:id', _toppingsController.topping_delete); // UPDATE

router.put('/:id', _toppingsController.topping_update);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=toppings.js.map
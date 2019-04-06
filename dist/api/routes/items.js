"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _itemsController = require("../controllers/itemsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use(_authenticate["default"]); // CHECK TOKEN

router.get('/', _itemsController.item_get_all); // GET_ALL

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=items.js.map
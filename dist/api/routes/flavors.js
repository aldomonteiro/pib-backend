"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _flavorsController = require("../controllers/flavorsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use(_authenticate["default"]); // CHECK TOKEN

router.get("/", _flavorsController.flavor_get_all); // GET_ALL

router.get("/:id", _flavorsController.flavor_get_one); // GET_ONE

router.post('/', _flavorsController.flavor_create); // CREATE

router.put('/:id', _flavorsController.flavor_update); // UPDATE

router["delete"]('/:id', _flavorsController.flavor_delete); // DELETE

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=flavors.js.map
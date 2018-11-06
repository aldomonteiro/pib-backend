"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _sizesController = require("../controllers/sizesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.use(_authenticate.default);
router.get("/", _sizesController.size_get_all); // List all sizes

router.get("/:id", _sizesController.size_get_one); // List one size

router.post('/', _sizesController.size_create); // Create a new size

router.delete('/:id', _sizesController.size_delete); // DELETE

router.put('/:id', _sizesController.size_update); // DELETE

var _default = router;
exports.default = _default;
//# sourceMappingURL=sizes.js.map
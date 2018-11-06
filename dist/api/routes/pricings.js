"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _pricingsController = require("../controllers/pricingsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.use(_authenticate.default); // CHECK TOKEN

router.get("/", _pricingsController.pricing_get_all); // GET_ALL

router.get("/:id", _pricingsController.pricing_get_one); // GET_ONE

router.post('/', _pricingsController.pricing_create); // CREATE

router.put('/:id', _pricingsController.pricing_update); // UPDATE

router.delete('/:id', _pricingsController.pricing_delete); // DELETE

var _default = router;
exports.default = _default;
//# sourceMappingURL=pricings.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

var _openingTimesController = require("../controllers/openingTimesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.use(_authenticate.default); // CHECK TOKEN

router.get("/", _openingTimesController.openingtimes_get_all); // GET_ALL

router.get("/:id", _openingTimesController.openingtimes_get_one); // GET_ONE

router.post('/', _openingTimesController.openingtimes_create); // CREATE

router.put('/:id', _openingTimesController.openingtimes_update); // UPDATE

router.delete('/:id', _openingTimesController.openingtimes_delete); // DELETE

var _default = router;
exports.default = _default;
//# sourceMappingURL=openingtimes.js.map
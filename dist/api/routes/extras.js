"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = _interopRequireDefault(require("express"));
var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));
var _extrasController = require("../controllers/extrasController");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var router = _express.default.Router();

router.use(_authenticate.default); // CHECK TOKEN
router.get("/", _extrasController.extra_get_all); // GET_ALL
router.get("/:id", _extrasController.extra_get_one); // GET_ONE
router.post('/', _extrasController.extra_create); // CREATE
router.put('/:id', _extrasController.extra_update); // UPDATE
router.delete('/:id', _extrasController.extra_delete); // DELETE
var _default =
router;exports.default = _default;
//# sourceMappingURL=extras.js.map
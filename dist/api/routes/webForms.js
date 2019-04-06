"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _webFormsController = require("../controllers/webFormsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post('/', _webFormsController.webform_create); // CREATE

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=webForms.js.map
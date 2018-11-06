"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _pagesController = require("../controllers/pagesController");

var _authenticate = _interopRequireDefault(require("../controllers/authenticate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router(); // check the token from the client


router.use(_authenticate.default); // from PageList (CustomComponent) UPDATE page

router.put('/:id', _pagesController.page_update); // from Resources

router.get("/", _pagesController.page_resources_get_all); // GET_ALL

router.get("/:id", _pagesController.page_resources_get_one); // GET_ONE

router.delete('/:id', _pagesController.page_resources_delete); // DELETE

var _default = router;
exports.default = _default;
//# sourceMappingURL=pages.js.map
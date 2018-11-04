import express from "express";
import {
  page_update,
  page_resources_get_all,
  page_resources_get_one,
  page_resources_delete
} from '../controllers/pagesController';
import authenticate from "../controllers/authenticate";

const router = express.Router();

// check the token from the client
router.use(authenticate);

// from PageList (CustomComponent) UPDATE page
router.put('/:id', page_update);
// from Resources
router.get("/", page_resources_get_all); // GET_ALL
router.get("/:id", page_resources_get_one); // GET_ONE
router.delete('/:id', page_resources_delete); // DELETE

export default router;

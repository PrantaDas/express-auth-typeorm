import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import checkRole from "../middlewares/checkRole";
import UserController from "../controller/UserController";

const router = Router();

router.get('/', [checkAuth, checkRole(['admin'])], UserController.getAll);

router.get('/:id([0-9]+)', [checkAuth, checkRole(['admin'])], UserController.getOne);

router.post('/', [checkAuth, checkRole(['admin'])], UserController.createNew);

router.patch('/:id([0-9]+)', [checkAuth, checkRole(['admin'])], UserController.updateUser);

router.delete('/:id([0-9]+)', [checkAuth, checkRole(['admin'])], UserController.deleteUser);

export default router;
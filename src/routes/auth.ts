import { Router } from "express";
import AuthController from "../controller/AuthController";
import { checkAuth } from "../middlewares/checkAuth";

const router = Router();

router.post('/login', AuthController.login);

router.post('/change-pass', [checkAuth], AuthController.changePassword);

export default router;
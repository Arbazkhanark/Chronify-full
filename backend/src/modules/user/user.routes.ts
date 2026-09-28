// src/modules/user/user.routes.ts
import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { rateLimiter } from "../../middlewares/rate.limiter";


const router = Router();

router.post("/signup",rateLimiter, UserController.signup);                         //Tested
router.get("/verify", rateLimiter, UserController.verify);                          //Tested
router.post('/resend-verification-link',UserController.resendVerificationLink);
router.post("/login", UserController.login);                           //Tested
router.post("/forgot-password", rateLimiter, UserController.forgotPassword);        //Tested
router.post("/reset-password", UserController.resetPassword);                       //Tested

router.post("/change-password", authMiddleware, UserController.changePassword);     //Tested
router.put("/profile", authMiddleware, UserController.updateProfile);
router.get("/me", authMiddleware, UserController.profile);                          //Tested
router.get('/get-profile-by-username',UserController.getPublicProfile)

router.post("/save-fcm-token", authMiddleware, UserController.saveFcmToken);

export default router;


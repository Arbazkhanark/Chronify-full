// src/modules/user/user.routes.ts
import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { rateLimiter } from "../../middlewares/rate.limiter";


const router = Router();

router.post("/signup",rateLimiter, UserController.signup);                         //Tested
router.get("/verify", rateLimiter, UserController.verify);                          //Tested
router.post("/login", UserController.login);                           //Tested
router.post("/forgot-password", rateLimiter, UserController.forgotPassword);        //Tested
router.post("/reset-password", UserController.resetPassword);                       //Tested

router.post("/change-password", authMiddleware, UserController.changePassword);     //Tested
router.put("/profile", authMiddleware, UserController.updateProfile);
router.get("/me", authMiddleware, UserController.profile);                          //Tested

router.post("/save-fcm-token", authMiddleware, UserController.saveFcmToken);

export default router;


















// // src/modules/user/user.routes.ts
// import { Router } from "express";
// import { UserController } from "./user.controller";
// import { authMiddleware } from "../../middlewares/auth.middleware";
// import { rateLimiter } from "../../middlewares/rate.limiter";

// const router = Router();

// // 🔥 DEBUGGING - Yeh add karo
// router.use((req, res, next) => {
//   console.log('🚀 User routes hit:', req.method, req.path);
//   next();
// });

// router.post("/signup", (req, res, next) => {
//   console.log('📝 Signup route hit!');
//   next();
// }, UserController.signup);

// router.get("/verify", rateLimiter, UserController.verify);
// router.post("/login", rateLimiter, UserController.login);
// router.post("/forgot-password", rateLimiter, UserController.forgotPassword);
// router.post("/reset-password", UserController.resetPassword);
// router.post("/change-password", authMiddleware, UserController.changePassword);
// router.put("/profile", authMiddleware, UserController.updateProfile);
// router.get("/me", authMiddleware, UserController.profile);

// export default router;
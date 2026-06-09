import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import projectsRouter from "./projects.js";
import servicesRouter from "./services.js";
import contactsRouter from "./contacts.js";
import openaiRouter from "./openai.js";
import githubRouter from "./github.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(servicesRouter);
router.use(contactsRouter);
router.use(openaiRouter);
router.use(githubRouter);

export default router;

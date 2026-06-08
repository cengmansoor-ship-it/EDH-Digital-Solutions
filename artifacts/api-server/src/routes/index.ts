import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import servicesRouter from "./services";
import contactsRouter from "./contacts";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(servicesRouter);
router.use(contactsRouter);
router.use(openaiRouter);

export default router;

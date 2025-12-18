import { Router } from "express";
import { EnterpriseRoute } from "./enterprise.router";
import { FreelanceRoute } from "./freelance.router";

const router = Router()

router.use('/enterprises', EnterpriseRoute)
router.use('/freelances', FreelanceRoute)

export { router as v1Route }

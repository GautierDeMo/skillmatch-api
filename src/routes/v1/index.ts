import { Router } from "express";
import { EnterpriseRoute } from "./enterprise.routes";
import { FreelanceRoute } from "./freelance.routes";

const router = Router()

router.use('/enterprise', EnterpriseRoute)
router.use('/freelance', FreelanceRoute)

export { router as v1Route }

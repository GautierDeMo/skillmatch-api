import { Router } from "express";
import { EnterpriseRoute } from "./enterprise.routes";
import { FreelanceRoute } from "./freelance.routes";

const router = Router()

router.use('/enterprises', EnterpriseRoute)
router.use('/freelances', FreelanceRoute)

export { router as v1Route }

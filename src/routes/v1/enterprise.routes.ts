import { Router } from "express";
import { createEnterprise, createEnterpriseProject, getAllMatchingFreelances, getEnterpriseById, getEnterpriseProjects, getEnterprises } from "../../controllers/v1";

const router = Router()

router.get('', getEnterprises)
router.get('/:id', getEnterpriseById)
router.get('/:id/projects', getEnterpriseProjects)
router.get('/:id/project/:projectId/matching-candidates', getAllMatchingFreelances)
router.post('', createEnterprise)
router.post('/:id/projects', createEnterpriseProject)

export { router as EnterpriseRoute }

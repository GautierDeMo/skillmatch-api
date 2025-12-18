import { Router } from "express";
import { applyToAProject, createFreelance, getFreelanceById, getFreelances, getProjectsWhereSkillsMatch } from "../../controllers/v1";

const router = Router()

router.get('', getFreelances)
router.get('/:id', getFreelanceById)
router.get('/:id/matching-projects', getProjectsWhereSkillsMatch)
router.post('', createFreelance)
router.post('/:id/apply/:projectId', applyToAProject)

export { router as FreelanceRoute }

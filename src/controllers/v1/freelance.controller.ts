import { NextFunction, Request, Response } from "express";
import { prisma } from "../../orm/v1";
import { generateSalt, sanitizeFreelance } from "../../utils/v1";
import { CreateFreelanceDTOInputs } from "../../dtos/v1";

export const getFreelances = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const freelances = await prisma.freelance.findMany()
    if (!freelances.length) {
      return res.jsonError('No freelances found', 404)
    }
    return res.jsonSuccess(freelances.map(sanitizeFreelance), 200)
  } catch (error) {
    next(error)
  }
}

export const getFreelanceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const { id } = req.params
    if (id && !isNaN(+id)) {
      const freelance = await prisma.freelance.findUnique({
        /** '+' operator to cast string into a number because query params are
        always string */
        where: { id: +id }
      })
      if (!freelance) {
        return res.jsonError('Freelance not found', 404)
      }
      return res.jsonSuccess(sanitizeFreelance(freelance), 200)
    }
    return res.jsonError('Invalid or missing Freelance ID', 400)
  } catch (error) {
    next(error)
  }
}

export const createFreelance = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const body = req.body as CreateFreelanceDTOInputs

    const existingfreelance = await prisma.freelance.findUnique({
      where: { email: body.email }
    })
    if (existingfreelance) {
      return res.jsonError(`Email: ${body.email} already exist`, 400)
    }

    const salt = await generateSalt()
    const freelance = await prisma.freelance.create({
      data: { ...body, salt }
    })
    return res.jsonSuccess(sanitizeFreelance(freelance), 201)
  } catch (error) {
    next(error)
  }
}

export const getProjectsWhereSkillsMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const { id } = req.params
    if (id && !isNaN(+id)) {
      const freelance = await prisma.freelance.findUnique({
        where: { id: +id }
      })

      if (freelance && freelance.skills) {
        const matchingProjects = await prisma.project.findMany({
          where: {
            requiredSkills: {
              hasSome: freelance.skills
            }
          }
        })
        return res.jsonSuccess(`Here are the matching projects: ${matchingProjects.map(project => project.title).join(', ')}`, 200)
      }
      return res.jsonError('Freelance not found or has no skills', 404)
    }
    return res.jsonError('Invalid or missing Freelance ID', 400)
  } catch (error) {
    next(error)
  }
}

export const applyToAProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const { id, projectId } = req.params
    if (id && projectId && !isNaN(+id) && !isNaN(+projectId)) {
      const freelance = await prisma.freelance.findUnique({ where: { id: +id } })
      const project = await prisma.project.findUnique({ where: { id: +projectId } })

      if (project && freelance) {
        const missingSkills = project.requiredSkills.filter(skill => !freelance.skills.includes(skill));

        if (missingSkills.length === 0) {

          if (freelance.tjm <= project.maxTjm) {

            if (!project.freelanceId) {
              await prisma.project.update({
                where: { id: +projectId },
                data: { freelanceId: +id }
              })
              return res.jsonSuccess(`The project ${project.title} has now a freelance assigned: ${freelance.name}`, 200)
            }
            return res.jsonError(`The project ${project.title} is already assigned (FreelanceID: ${project.freelanceId})`, 400)
          }
          return res.jsonError(`Your tjm is above the project maxTjm: ${freelance.tjm} > ${project.maxTjm}`, 400)
        }
        return res.jsonError(`Your appliance has been rejected, you miss the following skills: ${missingSkills.join(', ')}`, 400)
      }
      return res.jsonError('Freelance or Project not found', 404)
    }
    return res.jsonError('Missing or invalid id/projectId parameters', 400)
  } catch (error) {
    next(error)
  }
}

// TODO: gérer lorsque le tableau est pas dans le même sens, avec ça la casse

// TODO: matching partiel avec score de compatibilité
// TODO: implémenter un endpoint all available projects
// TODO: add a filter by skill like = GET ..../freelances?skill=Python

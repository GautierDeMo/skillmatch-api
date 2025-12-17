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
    if (id) {
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
    if (req.params.id) {
      const freelance = await prisma.freelance.findUnique({
        where: { id: +req.params.id }
      })
      if (freelance?.skills) {
        const matchingProjects = await prisma.project.findMany({
          where: {
            requiredSkills: {
              hasSome: freelance?.skills
            }
          }
        })
        return res.jsonSuccess(`Here are the matching projects: ${matchingProjects.map(project => project.title)}`, 200)
      }
    }
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
    if (id && projectId) {
      const freelance = await prisma.freelance.findUnique({
        where: { id: +id }
      })
      const project = await prisma.project.findUnique({
        where: { id: +projectId }
      })
      if (project?.requiredSkills && freelance?.skills) {
        console.log(project.requiredSkills, freelance.skills)
        const matchingSkills = freelance.skills.filter(skill => project.requiredSkills.indexOf(skill) >= 0)
        if (matchingSkills === freelance.skills) {
          if (project.maxTjm >= freelance.tjm) {
            if (!project.freelanceId) {
              await prisma.project.update({
                where: { id: +projectId },
                data: { freelanceId: +id }
              })
              return res.jsonSuccess(`The project ${project.title} has now a freelance assigned: ${freelance.name}`, 200)
            }
            return res.jsonError(`The project ${project?.title} already has an assigned freelance: ${freelance?.name}`, 400)
          }
          return res.jsonError(`Your tjm is above the project maxTjm: ${freelance.tjm} > ${project.maxTjm}`, 400)
        }
        return res.jsonError("Your appliance has been recorded, you don't have all of the required skills", 400)
      }
    }
  } catch (error) {
    next(error)
  }
}

// TODO: gérer les erreurs en cas de conditions if qui sont false
// TODO: gérer lorsque le tableau est pas dans le même sens, avec ça la casse

// TODO: matching partiel avec score de compatibilité
// TODO: implémenter un endpoint all available projects
// TODO: add a filter by skill like = GET ..../freelances?skill=Python

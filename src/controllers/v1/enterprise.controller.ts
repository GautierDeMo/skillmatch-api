import { NextFunction, Request, Response } from "express";
import { prisma } from "../../orm/v1";
import { generateSalt, sanitizeEnterprise } from "../../utils/v1";
import { CreateEnterpriseDTOInputs, CreateProjectDTOInputs } from "../../dtos/v1";

export const getEnterprises = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const enterprises = await prisma.enterprise.findMany()
    if (!enterprises.length) {
      return res.jsonError('No enterprises found', 404)
    }
    return res.jsonSuccess(enterprises.map(sanitizeEnterprise), 200)
  } catch (error) {
    next(error)
  }
}

export const getEnterpriseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const { id } = req.params
    if (id && !isNaN(+id)) {
      const enterprise = await prisma.enterprise.findUnique({
        /** '+' operator to cast string into a number because query params are
        always string */
        where: { id: +id }
      })
      if (!enterprise) {
        return res.jsonError('Enterprise not found', 404)
      }
      return res.jsonSuccess(sanitizeEnterprise(enterprise), 200)
    }
    return res.jsonError('Invalid or missing Enterprise ID', 400)
  } catch (error) {
    next(error)
  }
}

export const getEnterpriseProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const { id } = req.params
    if (id && !isNaN(+id)) {
      const projects = await prisma.project.findMany({
        where: {
          enterpriseId: +id
        }
      })
      if (!projects.length) return res.jsonError('No projects found', 404)
      return res.jsonSuccess(projects, 200)
    }
    return res.jsonError('Invalid or missing Enterprise ID', 400)
  } catch (error) {
    next(error)
  }
}

export const createEnterprise = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const body = req.body as CreateEnterpriseDTOInputs

      const existingEnterprise = await prisma.enterprise.findFirst({
        where: body
      })
      if (existingEnterprise) {
        return res.jsonError(`Enterprise: ${body.name} already exist`, 400)
      }

      const salt = await generateSalt()
      const enterprise = await prisma.enterprise.create({
        data: { ...body, salt }
      })
      return res.jsonSuccess(sanitizeEnterprise(enterprise), 201)
  } catch (error) {
    next(error)
  }
}

export const createEnterpriseProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const body = req.body as CreateProjectDTOInputs

      const existingProject = await prisma.project.findFirst({
        where: { title: body.title, description: body.description }
      })
      if (existingProject) {
        return res.jsonError(`Project: ${body.title} already exist`, 400)
      }

      const project = await prisma.project.create({
        data: {
          description: body.description,
          title: body.title,
          maxTjm: body.maxTjm,
          enterpriseId: +body.enterpriseId, // Cast string into number
          requiredSkills: body.requiredSkills
        }
      })
      return res.jsonSuccess(project, 201)
  } catch (error) {
    next(error)
  }
}

export const getAllMatchingFreelances = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const { id, projectId } = req.params
    if (id && projectId) {
      const project = await prisma.project.findUnique({
        where: { enterpriseId: +id, id: +projectId}
      })
      if (project) {
        const matchingFreelances = await prisma.freelance.findMany({
          where: {
            skills: {
              hasSome: project.requiredSkills
            }
          }
        })
        return res.jsonSuccess(`Here are the matching freelances: ${matchingFreelances.map(freelance => freelance.name).join(', ')}`)
      }
      return res.jsonError('Project not found', 404)
    }
    return res.jsonError('Missing id or projectId parameters', 400)
  } catch (error) {
    next(error)
  }
}

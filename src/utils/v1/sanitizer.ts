import { Enterprise, Freelance, Project } from "../../../prisma/generated/client";

export const sanitizeEnterprise = (enterprise: Enterprise) => {
  const { salt, ...safeData } = enterprise
  return safeData
}

export const sanitizeFreelance = (freelance: Freelance) => {
  const { salt, ...safeData } = freelance
  return safeData
}

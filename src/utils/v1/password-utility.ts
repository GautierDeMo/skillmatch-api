import bcrypt from "bcrypt";

export const generateSalt = async () => {
  return bcrypt.genSalt();
};

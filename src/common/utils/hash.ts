import * as bcrypt from 'bcrypt';

export const compareStringWithHash = async (
  incomingString: string,
  hash: string
) => {
  try {
    const result = await bcrypt.compare(incomingString, hash);

    return result;
  } catch (error) {
    return false;
  }
};

export const generateHashFromString = async (code: string, salt = 4) => {
  const hashPassword = await bcrypt.hash(code, salt);
  return hashPassword;
};

export const generateHashFromStringSync = (code: string, salt = 4) => {
  const hashPassword = bcrypt.hashSync(code, salt);
  return hashPassword;
};

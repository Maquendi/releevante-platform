import bcrypt from 'bcrypt';

interface VerifyTokenProps{
    inputCode:string,
    storedCodeHash:string
}

export  async function verifyCode({inputCode,storedCodeHash}:VerifyTokenProps): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(inputCode, storedCodeHash);
    return isMatch;
  } catch (error) {
    console.error("Error al verificar el código:", error);
    return false;
  }
}

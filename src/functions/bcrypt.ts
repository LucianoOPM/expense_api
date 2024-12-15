import * as bcrypt from 'bcrypt';
const ROUNDS = 10;

export async function hashPassword(password: string) {
  try {
    return await bcrypt.hash(password, ROUNDS);
  } catch (error) {
    throw new Error('Error al encriptar la contraseña');
  }
}

export async function comparePassword(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Error al comparar la contraseña');
  }
}

export function generateCustomID(prefix) {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 12);
    const customID = `${prefix}_${timestamp}_${randomString}`;
    return customID;
}

export function getCurrentFormattedDate() {
    const currentDate = new Date();
  
    const formattedDate = currentDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  
    return formattedDate;
}

export const validarOAB = (numeroOAB) => {
  const oabPattern = /^[A-Z]{2}\d{4,5}$/;

  if (oabPattern.test(numeroOAB)) {
    return true; 
  } else {
    return false;
  }
}

const CryptoJS = require('crypto-js');
const secretKey = 'JurisEase@2018';

/**
 * Função para criar um hash de senha
 * @param {string} password - A senha a ser criptografada
 * @returns {string} - O hash criptografado da senha
 */
export async function encryptPassword(password) {
  const encryptedData = CryptoJS.AES.encrypt(password, secretKey);
  return encryptedData.toString();
}

/**
 * Função para verificar se a senha fornecida corresponde ao hash armazenado
 * @param {string} inputPassword - A senha inserida pelo usuário
 * @param {string} storedPassword - O hash de senha armazenado
 * @returns {boolean} - true se as senhas corresponderem, false caso contrário
 */
export async function comparePassword(inputPassword, storedPassword) {
  const decryptedBytes = CryptoJS.AES.decrypt(storedPassword, secretKey);

  // Verifique se a senha descriptografada corresponde à senha inserida
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return inputPassword === decryptedData;
}

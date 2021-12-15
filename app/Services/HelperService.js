'use strict'
const { validateAll } = use('Validator')
const ValidationException = use('App/Exceptions/ValidationException');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = Buffer.from('SlegySanjayaRizkiaFikriMaulanaYusupMKDCeria=', 'base64');
const IV_LENGTH = 16;

class HelperService {
  /**
   * Validation
   * @param Request request
   * @param string rules
  **/
  async validate(request, rules) {
    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) throw new ValidationException(validation.messages())
  }

  currencyFormat(number) {
    let tempNum = String(number).split("").reverse()
    let Currency = ''
    for (let i = 0; i < tempNum.length; i++) {
      if ((i + 1) % 3 == 0 && i != tempNum.length - 1) {
        tempNum[i] = `.${ tempNum[i]}`
      }
    }
    Currency = `${tempNum.reverse().join("")}`
    return Currency
  }

  setBoolean(params) {
    let bool = false;
    if (params === 'true' || params == 1) {
      bool = true;
    }

    return bool;
  }

  async encrypt(text){
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  async decrypt(text){
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

module.exports = new HelperService()

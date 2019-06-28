import * as CryptoJS from 'crypto-js';

export class CryptoUtils {

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Hash Input in MD5 and returns it
     * @param input String
     */
    static encryptInput(input: string) : string {
        return CryptoJS.MD5(input).toString();
    };

    /**
     * decrypt md5 string
     * @param input String
     */
    static decryptInput(input: string) : string {
        return CryptoJS.MD5.decrypt(input).toString();
    };


    static aesEncrypt(string: string, pass: string) : string {
        return CryptoJS.AES.encrypt(string, pass);
    };

    static aesDecrpyt(stringEncrypted: string, pass: string) : string {
        return CryptoJS.AES.decrypt(stringEncrypted, pass).toString(CryptoJS.enc.Utf8);
    };
}
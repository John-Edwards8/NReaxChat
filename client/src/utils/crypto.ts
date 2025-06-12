import CryptoJS from "crypto-js";

// ---------------- AES ----------------

const generateIV = (): CryptoJS.lib.WordArray => {
    return CryptoJS.lib.WordArray.random(16);
};

export const encryptWithKey = (text: string, keyHex: string) => {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = generateIV();
    const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return {
        cipher: encrypted.toString(),
        iv: iv.toString(CryptoJS.enc.Hex)
    };
};

export const decryptWithKey = (cipher: string, ivHex: string, keyHex: string): string => {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const decrypted = CryptoJS.AES.decrypt(cipher, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

// ---------------- RSA Keys ----------------

export const generateKeyPair = async (): Promise<CryptoKeyPair> => {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );
};

export const exportPublicKeyToPem = async (key: CryptoKey): Promise<string> => {
    const spki = await window.crypto.subtle.exportKey("spki", key);
    const b64 = window.btoa(String.fromCharCode(...new Uint8Array(spki)));
    return `-----BEGIN PUBLIC KEY-----\n${b64.match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;
};

export const exportPrivateKeyToLocalStorage = async (key: CryptoKey) => {
    const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", key);
    const b64 = window.btoa(String.fromCharCode(...new Uint8Array(pkcs8)));
    localStorage.setItem("privateKey", b64);
};

export const importPrivateKeyFromLocalStorage = async (): Promise<CryptoKey> => {
    const base64 = localStorage.getItem("privateKey");
    if (!base64) throw new Error("No private key found in localStorage");

    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
        "pkcs8",
        binary,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["decrypt"]
    );
};

// ---------------- Decrypt AES key ----------------

export const decryptRoomKey = async (encryptedKey: string): Promise<string> => {
    const privateKey = await importPrivateKeyFromLocalStorage();
    const encryptedBytes = Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0));
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP", hash: "SHA-256" } as RsaOaepParams,
        privateKey,
        encryptedBytes
    );
    const base64Str = new TextDecoder().decode(decrypted);
    const rawKey = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));
    return CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.create(rawKey));
};
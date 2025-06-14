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
        { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256"},
        true,
        ["encrypt", "decrypt"]
    );
};

// ---- Export to PEM ----

const exportKeyToPem = async (key: CryptoKey, format: "spki" | "pkcs8", type: "PUBLIC" | "PRIVATE"): Promise<string> => {
    const exported = await window.crypto.subtle.exportKey(format, key);
    const b64 = window.btoa(String.fromCharCode(...new Uint8Array(exported)));
    const lines = b64.match(/.{1,64}/g)?.join("\n");
    return `-----BEGIN ${type} KEY-----\n${lines}\n-----END ${type} KEY-----`;
};

export const exportPublicKeyToPem = (key: CryptoKey) => exportKeyToPem(key, "spki", "PUBLIC");
export const exportPrivateKeyToPem = (key: CryptoKey) => exportKeyToPem(key, "pkcs8", "PRIVATE");

// ---- Import from PEM ----

const importKeyFromPem = async (pem: string, format: "pkcs8" | "spki", usages: KeyUsage[]): Promise<CryptoKey> => {
    const pemContents = pem.replace(/-----(BEGIN|END) [A-Z ]+-----/g, "").replace(/\s/g, "");
    const binary = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(format, binary, { name: "RSA-OAEP", hash: "SHA-256" }, true, usages );
};

export const importPrivateKeyFromPem = (pem: string) => importKeyFromPem(pem, "pkcs8", ["decrypt"]);

// ---------------- LocalStorage ----------------

export const savePrivateKeyToLocalStorage = async (key: CryptoKey) => {
    const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", key);
    const b64 = window.btoa(String.fromCharCode(...new Uint8Array(pkcs8)));
    localStorage.setItem("privateKey", b64);
};

export const loadPrivateKeyFromLocalStorage = async (): Promise<CryptoKey> => {
    const b64 = localStorage.getItem("privateKey");
    if (!b64) throw new Error("No private key found in localStorage");
    const binary = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey("pkcs8", binary, { name: "RSA-OAEP", hash: "SHA-256" }, true, ["decrypt"]
    );
};

// ---------------- Decrypt AES key ----------------

export const decryptRoomKey = async (encryptedKey: string): Promise<string> => {
    const privateKey = await loadPrivateKeyFromLocalStorage();
    const encryptedBytes = Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0));
    const decrypted = await window.crypto.subtle.decrypt({ name: "RSA-OAEP", hash: "SHA-256" } as RsaOaepParams, privateKey, encryptedBytes );
    const base64Str = new TextDecoder().decode(decrypted);
    const rawKey = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));
    return CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.create(rawKey));
};
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12
const KEY_HEX = process.env.ENCRYPTION_KEY

function getKey(): Buffer {
    if(!KEY_HEX) throw new Error("Encryption key not found!")
    
    const key = Buffer.from(KEY_HEX, "hex")

    if(key.length !== 32) throw new Error("Encryption key has the wrong size!")
    
    return key
}

export function encrypt(plainText: string): string {
    const key = getKey()
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(ALGORITHM, key, iv)

    const cypherText = Buffer.concat([
        cipher.update(plainText, 'utf8'),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return [iv.toString('base64'), authTag.toString('base64'), cypherText.toString('base64')].join(':')
}

export function decrypt(encrypted: string): string {
    const key = getKey()
    const parts = encrypted.split(":")

    if(parts.length !== 3) throw new Error("Wrong format, please try again.")
    
    const [ivB64, authTagB64, ciphertextB64] = parts
    const iv = Buffer.from(ivB64, "base64")
    const authTag = Buffer.from(authTagB64, "base64")
    const ciphertext = Buffer.from(ciphertextB64, "base64")

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    const plainText = Buffer.concat([decipher.update(ciphertext), decipher.final()])
    return plainText.toString('utf8')
}

export function encryptOptional(plainText: string | null | undefined): string | null | undefined {
    if(plainText === null || plainText === undefined) return plainText
    return encrypt(plainText)
}

export function decryptOptional(cipheredText: string | null): string | null  {
    if(cipheredText === null) return cipheredText
    return decrypt(cipheredText)
}
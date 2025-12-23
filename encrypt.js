import crypto from 'crypto';

function encryptAES256CBC_OpenSSL(plaintext, passphrase, options = {}) {
    const {
        keyMethod = 'direct',
        ivMethod = 'zero',
        prependIV = null // Auto-detect based on IV method
    } = options;

    let key;
    switch (keyMethod) {
        case 'sha256':
            // Key Method 2: SHA256 hash
            key = crypto.createHash('sha256').update(passphrase).digest();
            break;
        case 'space':
            // Key Method 3: Direct secret, padded with spaces
            const spaceBytes = Buffer.from(passphrase, 'utf8');
            key = Buffer.alloc(32, 0x20); // Space character
            spaceBytes.copy(key, 0, 0, Math.min(32, spaceBytes.length));
            break;
        case 'repeat':
            // Key Method 4: Direct secret, repeated to 32 bytes
            const repeatBytes = Buffer.from(passphrase, 'utf8');
            if (repeatBytes.length === 0) {
                key = Buffer.alloc(32, 0);
            } else {
                const repeated = Buffer.alloc(32);
                for (let i = 0; i < 32; i++) {
                    repeated[i] = repeatBytes[i % repeatBytes.length];
                }
                key = repeated;
            }
            break;
        case 'direct':
        default:
            // Key Method 1: Direct secret, padded/truncated to 32 bytes with null bytes
            const secretBytes = Buffer.from(passphrase, 'utf8');
            key = Buffer.alloc(32, 0);
            secretBytes.copy(key, 0, 0, Math.min(32, secretBytes.length));
            break;
    }
    
    let iv;
    let shouldPrependIV = prependIV;
    
    switch (ivMethod) {
        case 'zero':
            // IV Method 2: Zero IV (deterministic, matches some online tools)
            iv = Buffer.alloc(16, 0);
            if (shouldPrependIV === null) shouldPrependIV = false; // Don't prepend zero IV
            break;
        case 'hashed':
            // IV Method 3: IV from first 16 bytes of hashed secret (deterministic)
            const hashedSecret = crypto.createHash('sha256').update(passphrase).digest();
            iv = hashedSecret.slice(0, 16);
            if (shouldPrependIV === null) shouldPrependIV = false; // Don't prepend hashed IV
            break;
        case 'random':
        default:
            // IV Method 1: Random IV prepended (most secure)
            iv = crypto.randomBytes(16);
            if (shouldPrependIV === null) shouldPrependIV = true; // Prepend random IV
            break;
    }
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    // Encrypt the plaintext
    let encrypted = cipher.update(plaintext, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Return result with or without IV prepended
    const result = shouldPrependIV ? Buffer.concat([iv, encrypted]) : encrypted;
    return result.toString('base64');
}

// replace the api secret with the actual api secret
let apiSecret = "2iq1xZlRCBBPQLjypsG1UWE83N6Yd8jn";

let payload = {
    action: "clock_in_reminder",
    title: "Clock In Reminder",
    message: "You have a shift today at 10:00 AM. Please clock in.",
    data: {
        username: "cane@snapes.com.au"
    }
};

let payloadWebhook = {
    path: "/api/webhook",
    request_method: "POST",
    timestamp: Math.floor(Date.now() / 1000),
    payload: payload
};
// Example payload - Webhook
const payloadWebhookString = JSON.stringify(payloadWebhook);

const signature = encryptAES256CBC_OpenSSL(payloadWebhookString, apiSecret, {
    keyMethod: 'direct',
    ivMethod: 'zero',
    prependIV: false
});
console.log(signature);
# Request Signature Encryptor

A Node.js utility for generating encrypted signatures using AES-256-CBC encryption. This tool is designed to create secure signatures for webhook payloads and API requests.

## Features

- AES-256-CBC encryption with multiple key derivation methods
- Flexible IV (Initialization Vector) generation options
- Support for webhook payload encryption
- Configurable encryption parameters

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd request-signature-encryptor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   Note: The `crypto` package is included in dependencies, though Node.js has a built-in `crypto` module.

## Usage

1. **Configure your API secret**
   
   Open `encrypt.js` and replace the `apiSecret` variable with your actual API secret:
   ```javascript
   let apiSecret = "your-actual-api-secret-here";
   ```

2. **Customize the payload (optional)**
   
   Modify the `payload` and `payloadWebhook` objects in `encrypt.js` according to your needs.

3. **Run the encryption script**
   ```bash
   node encrypt.js
   ```

4. **Get the encrypted signature**
   
   The encrypted signature will be displayed in the console as a base64-encoded string.

## Encryption Options

The `encryptAES256CBC_OpenSSL` function supports various encryption methods:

### Key Methods

- **`direct`** (default): Direct secret, padded/truncated to 32 bytes with null bytes
- **`sha256`**: SHA256 hash of the passphrase
- **`space`**: Direct secret, padded with spaces to 32 bytes
- **`repeat`**: Direct secret, repeated to 32 bytes

### IV Methods

- **`random`** (default): Random IV prepended to the encrypted data (most secure)
- **`zero`**: Zero IV (deterministic, matches some online tools)
- **`hashed`**: IV from first 16 bytes of hashed secret (deterministic)

### Example Configuration

```javascript
const signature = encryptAES256CBC_OpenSSL(payloadWebhookString, apiSecret, {
    keyMethod: 'direct',    // Key derivation method
    ivMethod: 'zero',        // IV generation method
    prependIV: false         // Whether to prepend IV to output
});
```

## Example Output

When you run `node encrypt.js`, you'll see output like:

```
<base64-encoded-encrypted-signature>
```

This signature can be used for webhook authentication or API request signing.

## Project Structure

```
request-signature-encryptor/
├── encrypt.js          # Main encryption script
├── package.json        # Project dependencies
└── README.md          # This file
```

## Requirements

- Node.js (version 14 or higher recommended)
- npm

## Notes

- The script uses ES modules (`type: "module"` in package.json)
- The encrypted signature is returned as a base64-encoded string
- Make sure to keep your API secret secure and never commit it to version control


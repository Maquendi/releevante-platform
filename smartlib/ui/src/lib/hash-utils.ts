export class HashUtils {
  static async createSHAHash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return HashUtils.convertToHex(hashBuffer);
  }

  static convertToHex(buffer) {
    const hashArray = Array.from(new Uint8Array(buffer)); // Convert buffer to byte array
    let hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    if (hex.startsWith('0')) {
      hex = hex.slice(1);
    }
    return hex;
  }
}

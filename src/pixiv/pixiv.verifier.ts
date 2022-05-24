import { nanoid } from "nanoid";
import crypto from "crypto";

// this function encodes to the RFC 4648 Spec where '+' is
// encoded as '-' and '/' is encoded as '_'.
// the padding character '=' is removed.
function urlSafeBase64Encode(data: string): string {
  return data.replace("+", "-").replace("/", "_").replace("=", "");
}

function generateChallenge(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = Buffer.from(nanoid()).toString("base64").substring(0, 32);
  const codeChallenge = urlSafeBase64Encode(crypto.createHash("sha256").update(codeVerifier).digest("base64"));
  return { codeVerifier, codeChallenge };
}

// TODO: Does this ever have to change?
export default generateChallenge();

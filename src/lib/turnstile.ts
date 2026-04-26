import { AppError } from "@/lib/errors";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(params: { token?: string; remoteIp?: string | null }) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Permite entornos sin captcha configurado sin bloquear envios.
  if (!secretKey) {
    return;
  }

  if (!params.token) {
    throw new AppError("Captcha requerido.", 400, "CAPTCHA_REQUIRED");
  }

  const payload = new URLSearchParams({
    secret: secretKey,
    response: params.token,
  });

  if (params.remoteIp) {
    payload.set("remoteip", params.remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
  });

  if (!response.ok) {
    throw new AppError("No se pudo validar el captcha.", 502, "CAPTCHA_VERIFY_FAILED");
  }

  const result = (await response.json()) as TurnstileVerifyResponse;

  if (!result.success) {
    throw new AppError("Captcha invalido.", 400, "CAPTCHA_INVALID");
  }
}

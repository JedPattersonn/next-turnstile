import {
  TurnstileValidateOptions,
  TurnstileValidateResponse,
  TURNSTILE_CONSTANTS,
} from "../types";

export async function validateTurnstileToken({
  token,
  secretKey,
  remoteip,
  idempotencyKey,
  sandbox = false,
}: TurnstileValidateOptions): Promise<TurnstileValidateResponse> {
  const endpoint = TURNSTILE_CONSTANTS.API_ENDPOINT;

  const sandboxDummyKey = () => {
    switch (sandbox) {
      case "pass":
        return TURNSTILE_CONSTANTS.SERVER_SANDBOX_KEYS.PASS;
      case "fail":
        return TURNSTILE_CONSTANTS.SERVER_SANDBOX_KEYS.FAIL;
      case "error":
        return TURNSTILE_CONSTANTS.SERVER_SANDBOX_KEYS.ERROR;
    }

    return TURNSTILE_CONSTANTS.SERVER_SANDBOX_KEYS.PASS;
  };

  const formData = new URLSearchParams({
    secret: sandbox ? sandboxDummyKey() : secretKey,
    response: token,
    ...(remoteip && { remoteip }),
    ...(idempotencyKey && { idempotency_key: idempotencyKey }),
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to validate Turnstile token: ${error}`);
  }
}

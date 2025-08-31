export interface TurnstileProps {
  siteKey: string;
  onVerify?: (token: string) => void;
  onError?: (error: unknown) => void;
  onExpire?: () => void;
  onLoad?: () => void;
  id?: string;
  className?: string;
  theme?: "light" | "dark" | "auto";
  tabIndex?: number;
  responseField?: boolean;
  responseFieldName?: string;
  size?: "normal" | "compact" | 'flexible';
  retry?: "auto" | "never";
  retryInterval?: number;
  refreshExpired?: "auto" | "manual" | "never";
  appearance?: "always" | "execute" | "interaction-only";
  execution?: "render" | "execute";
  cData?: string;
  language?: string;
  sandbox?: "pass" | "block" | "pass-invisible" | "block-invisible" | boolean;
}

export interface TurnstileValidateOptions {
  token: string;
  secretKey: string;
  remoteip?: string;
  idempotencyKey?: string;
  sandbox?: "pass" | "fail" | "error" | boolean;
}

export interface TurnstileValidateResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  error_codes?: string[];
  action?: string;
  cdata?: string;
}

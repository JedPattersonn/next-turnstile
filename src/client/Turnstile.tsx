import React, { useEffect, useRef, useCallback } from "react";
import { TurnstileProps, TURNSTILE_CONSTANTS } from "../types";

declare global {
  interface Window {
    turnstile: {
      execute: (widgetId: string, options?: any) => void;
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export const Turnstile: React.FC<TurnstileProps> = ({
  siteKey,
  onVerify,
  onError,
  onExpire,
  onLoad,
  onBeforeInteractive,
  onAfterInteractive,
  onUnsupported,
  onTimeout,
  action,
  id = TURNSTILE_CONSTANTS.DEFAULT_ID,
  className,
  theme = TURNSTILE_CONSTANTS.DEFAULT_THEME,
  tabIndex,
  responseField = TURNSTILE_CONSTANTS.DEFAULT_RESPONSE_FIELD,
  responseFieldName = TURNSTILE_CONSTANTS.DEFAULT_RESPONSE_FIELD_NAME,
  size = TURNSTILE_CONSTANTS.DEFAULT_SIZE,
  retry = TURNSTILE_CONSTANTS.DEFAULT_RETRY,
  retryInterval = TURNSTILE_CONSTANTS.DEFAULT_RETRY_INTERVAL,
  refreshExpired = TURNSTILE_CONSTANTS.DEFAULT_REFRESH_EXPIRED,
  refreshTimeout = TURNSTILE_CONSTANTS.DEFAULT_REFRESH_TIMEOUT,
  appearance = TURNSTILE_CONSTANTS.DEFAULT_APPEARANCE,
  execution = TURNSTILE_CONSTANTS.DEFAULT_EXECUTION,
  cData,
  language,
  sandbox = false,
  feedbackEnabled = TURNSTILE_CONSTANTS.DEFAULT_FEEDBACK_ENABLED,
}) => {
  const widgetRef = useRef<string>();
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanup = useCallback(() => {
    if (widgetRef.current) {
      window.turnstile?.remove(widgetRef.current);
      widgetRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    const scriptId = "cf-turnstile-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `${TURNSTILE_CONSTANTS.SCRIPT_URL}?render=explicit&onload=onloadTurnstileCallback`;
      script.async = true;
      script.defer = true;

      window.onloadTurnstileCallback = () => {
        renderWidget();
        onLoad?.();
      };

      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
      onLoad?.();
    }

    return cleanup;
  }, [siteKey, sandbox]);

  const sandboxDummyKey = () => {
    switch (sandbox) {
      case "pass":
        return TURNSTILE_CONSTANTS.SANDBOX_KEYS.PASS;
      case "block":
        return TURNSTILE_CONSTANTS.SANDBOX_KEYS.BLOCK;
      case "pass-invisible":
        return TURNSTILE_CONSTANTS.SANDBOX_KEYS.PASS_INVISIBLE;
      case "block-invisible":
        return TURNSTILE_CONSTANTS.SANDBOX_KEYS.BLOCK_INVISIBLE;
    }

    return TURNSTILE_CONSTANTS.SANDBOX_KEYS.PASS;
  };

  const renderWidget = () => {
    if (!containerRef.current || !window.turnstile) return;

    cleanup();

    widgetRef.current = window.turnstile.render(containerRef.current, {
      sitekey: sandbox ? sandboxDummyKey() : siteKey,
      action,
      callback: onVerify,
      "error-callback": onError,
      "expired-callback": onExpire,
      "before-interactive-callback": onBeforeInteractive,
      "after-interactive-callback": onAfterInteractive,
      "unsupported-callback": onUnsupported,
      "timeout-callback": onTimeout,
      theme,
      tabindex: tabIndex,
      "response-field": responseField,
      "response-field-name": responseFieldName,
      size,
      retry,
      "retry-interval": retryInterval,
      "refresh-expired": refreshExpired,
      "refresh-timeout": refreshTimeout,
      appearance,
      execution,
      cdata: cData,
      language,
      "feedback-enabled": feedbackEnabled,
    });
  };

  return <div ref={containerRef} id={id} className={className} />;
};

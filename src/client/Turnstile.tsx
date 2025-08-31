import React, { useEffect, useRef, useCallback } from "react";
import { TurnstileProps } from "../types";

declare global {
  interface Window {
    turnstile: {
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
  id = "turnstile-widget",
  className,
  theme = "auto",
  tabIndex,
  responseField = true,
  responseFieldName = "cf-turnstile-response",
  size = "flexible",
  retry = "auto",
  retryInterval = 8000,
  refreshExpired = "auto",
  appearance = "always",
  execution = "render",
  cData,
  language,
  sandbox = false,
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
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback";
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
        return "1x00000000000000000000AA";
      case "block":
        return "2x00000000000000000000AB";
      case "pass-invisible":
        return "1x00000000000000000000BB";
      case "block-invisible":
        return "2x00000000000000000000BB";
    }

    return "1x00000000000000000000AA";
  };

  const renderWidget = () => {
    if (!containerRef.current || !window.turnstile) return;

    cleanup();

    widgetRef.current = window.turnstile.render(containerRef.current, {
      sitekey: sandbox ? sandboxDummyKey() : siteKey,
      callback: onVerify,
      "error-callback": onError,
      "expired-callback": onExpire,
      theme,
      tabindex: tabIndex,
      "response-field": responseField,
      "response-field-name": responseFieldName,
      size,
      retry,
      "retry-interval": retryInterval,
      "refresh-expired": refreshExpired,
      appearance,
      execution,
      cdata: cData,
      language,
    });
  };

  return <div ref={containerRef} id={id} className={className} />;
};

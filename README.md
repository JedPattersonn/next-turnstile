# Next-Turnstile

A type-safe, feature-rich integration of Cloudflare Turnstile for Next.js applications. This package provides both client and server-side components for seamless CAPTCHA integration.

[![npm version](https://badge.fury.io/js/next-turnstile.svg)](https://www.npmjs.com/package/next-turnstile)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔒 **Type-safe**: Full TypeScript support
- 🎨 **Customizable**: Extensive styling and behavior options
- 🧪 **Sandbox Mode**: Built-in support for development testing
- ⚡ **Server Validation**: Easy token verification
- 📱 **Responsive**: Works across all device sizes
- 🔄 **Auto-reload**: Configurable token refresh
- 🌙 **Theme Support**: Light, dark, and auto themes
- 🌐 **i18n Ready**: Multiple language support

## Installation

```bash
# npm
npm install next-turnstile

# yarn
yarn add next-turnstile

# pnpm
pnpm add next-turnstile

# bun
bun add next-turnstile
```

## Quick Start

### Client-Side Usage

```tsx
import { Turnstile } from "next-turnstile";

function MyForm() {
  const handleVerify = (token: string) => {
    // Handle the verification token
    console.log("Verification successful:", token);
  };

  return (
    <Turnstile siteKey="your-site-key" onVerify={handleVerify} theme="light" />
  );
}
```

### Server-Side Validation

```tsx
import { validateTurnstileToken } from "next-turnstile";

async function validateToken(token: string) {
  try {
    const result = await validateTurnstileToken({
      token,
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    });

    if (result.success) {
      // Token is valid
      return true;
    }
  } catch (error) {
    console.error("Validation failed:", error);
  }
  return false;
}
```

## API Reference

### Turnstile Component Props

| Prop                  | Type                                                                    | Default                   | Description                                   |
| --------------------- | ----------------------------------------------------------------------- | ------------------------- | --------------------------------------------- |
| `siteKey`             | `string`                                                                | Required                  | Your Cloudflare Turnstile site key            |
| `onVerify`            | `(token: string) => void`                                               | -                         | Callback when verification succeeds           |
| `onError`             | `(error: unknown) => void`                                              | -                         | Callback when an error occurs                 |
| `onExpire`            | `() => void`                                                            | -                         | Callback when the token expires               |
| `onLoad`              | `() => void`                                                            | -                         | Callback when the widget loads                |
| `onBeforeInteractive` | `() => void`                                                            | -                         | Callback before challenge enters interactive  |
| `onAfterInteractive`  | `() => void`                                                            | -                         | Callback after challenge leaves interactive   |
| `onUnsupported`       | `() => void`                                                            | -                         | Callback when browser is not supported        |
| `onTimeout`           | `() => void`                                                            | -                         | Callback when interactive challenge times out |
| `action`              | `string`                                                                | -                         | Custom action value for analytics             |
| `theme`               | `'light' \| 'dark' \| 'auto'`                                           | `'auto'`                  | Widget theme                                  |
| `size`                | `'normal' \| 'compact' \| 'flexible'`                                   | `'flexible'`              | Widget size                                   |
| `appearance`          | `'always' \| 'execute' \| 'interaction-only'`                           | `'always'`                | When to show the widget                       |
| `execution`           | `'render' \| 'execute'`                                                 | `'render'`                | When to execute the challenge                 |
| `retry`               | `'auto' \| 'never'`                                                     | `'auto'`                  | Retry behavior on failure                     |
| `retryInterval`       | `number`                                                                | `8000`                    | Milliseconds between retries                  |
| `refreshExpired`      | `'auto' \| 'manual' \| 'never'`                                         | `'auto'`                  | Token refresh behavior                        |
| `refreshTimeout`      | `'auto' \| 'manual' \| 'never'`                                         | `'auto'`                  | Timeout refresh behavior                      |
| `language`            | `string`                                                                | -                         | Widget language code                          |
| `tabIndex`            | `number`                                                                | -                         | Tab index for accessibility                   |
| `responseField`       | `boolean`                                                               | `true`                    | Create hidden response input                  |
| `responseFieldName`   | `string`                                                                | `'cf-turnstile-response'` | Name of the response input field              |
| `cData`               | `string`                                                                | -                         | Custom data payload                           |
| `feedbackEnabled`     | `boolean`                                                               | `true`                    | Enable visitor feedback collection            |
| `id`                  | `string`                                                                | `'turnstile-widget'`      | Container element ID                          |
| `className`           | `string`                                                                | -                         | Additional CSS classes                        |
| `sandbox`             | `boolean` \| `pass` \| `block` \| `pass-invisible` \| `block-invisible` | `false`                   | Enable sandbox mode                           |

### Server Validation Options

| Option           | Type                                    | Required | Description               |
| ---------------- | --------------------------------------- | -------- | ------------------------- |
| `token`          | `string`                                | Yes      | The token from the client |
| `secretKey`      | `string`                                | Yes      | Your Turnstile secret key |
| `remoteip`       | `string`                                | No       | User's IP address         |
| `idempotencyKey` | `string`                                | No       | Unique request identifier |
| `sandbox`        | `boolean`\| `pass` \| `fail` \| `error` | No       | Enable sandbox mode       |

## Advanced Usage

### With Form Submission

```tsx
import { Turnstile } from "next-turnstile";

export default function Form() {
  const [token, setToken] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const response = await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    });

    // Handle response...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" required />
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onVerify={setToken}
      />
      <button type="submit" disabled={!token}>
        Submit
      </button>
    </form>
  );
}
```

### Server Action Validation

```tsx
import { validateTurnstileToken } from "next-turnstile";

async function submitForm(formData: FormData) {
  "use server";

  const token = formData.get("cf-turnstile-response");
  if (!token || typeof token !== "string") {
    return { error: "No token provided" };
  }

  const result = await validateTurnstileToken({
    token,
    secretKey: process.env.TURNSTILE_SECRET_KEY!,
  });

  if (!result.success) {
    return { error: "Invalid token" };
  }

  // Process form submission...
}
```

### Development Mode

During development, you can use sandbox mode to test without real credentials:

```tsx
<Turnstile
  siteKey="1x00000000000000000000AA"
  sandbox={process.env.NODE_ENV === "development"}
  onVerify={handleVerify}
/>
```

### Dark Mode Support

```tsx
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
  theme="dark"
  onVerify={handleVerify}
/>
```

### With Custom Styling

```tsx
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
  className="my-turnstile-widget"
  onVerify={handleVerify}
/>

<style>
  .my-turnstile-widget {
    margin: 1rem 0;
    /* Note: Internal widget styling is limited by Turnstile */
  }
</style>
```

## Development and Contributing

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start development:
   ```bash
   pnpm dev
   ```

## License

MIT © Jed Patterson

## Credits

Built with ❤️ using:

- [Next.js](https://nextjs.org)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile)
- [TypeScript](https://www.typescriptlang.org)

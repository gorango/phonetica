# Phonetica

Voice-enabled ChatGPT implementation builth with:

- [Nuxt][nuxt] + [Vue][vue]
- [Tailwind][tailwind] + [DaisyUI][daisy]
- [OpenAI][openai] + [Google][google]

## Setup

To start developing locally or to deploy your own version, clone the repo and implement the requirements.

### Requirements

Enable all of the required APIs from the providers:

- [OpenAI API][openai]
- [Cloud Text-to-Speech API][tts]
- [Cloud Translation API][translate]

### Environment Variables

Add OpenAI and Google Cloud keys to the `.env` file.

```sh
cp .env.example .env
```

### Development

Check out `"scripts"` in `package.json` for available actions for development and deployment of the app.

<!-- Links -->

[nuxt]: https://nuxt.com/docs/getting-started/introduction
[vue]: https://vuejs.org/
[tailwind]: https://tailwindcss.com/docs/installation
[daisy]: https://daisyui.com/
[openai]: https://platform.openai.com/account/api-keys
[google]: https://console.cloud.google.com
[tts]: https://console.cloud.google.com/apis/api/texttospeech.googleapis.com
[translate]: https://console.cloud.google.com/apis/api/translate.googleapis.com

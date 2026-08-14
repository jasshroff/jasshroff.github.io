# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## SGV AI Assistant

The website includes a floating 24/7 chatbot widget powered by a local RAG-style retrieval layer. It answers from SGV Jewellers business facts, product/category information, contact details, policies, and blog content already bundled with the site.

By default it works without any backend and uses a careful local answer fallback. To connect a real server-side LLM endpoint, set `VITE_CHATBOT_API_URL` in your environment. The browser will send the visitor's message, recent chat history, retrieved SGV context, detected intent, and a live-verification flag to that endpoint. Keep OpenAI or other LLM API keys only on the server, never in Vite client code.

For live rates, stock, availability, offers, or delivery status, the backend response must include `verifiedLiveData: true`; otherwise the widget will not trust the response and will ask the visitor to call/WhatsApp the showroom. Out-of-scope questions should return `outOfScope: true` or be refused by the backend in the same guarded style.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

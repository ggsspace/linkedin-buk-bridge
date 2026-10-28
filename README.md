This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🔌 Integración con LinkedIn Recruiter API (Producción vs Prototipo)

Este middleware actúa como un **Webhook Receiver** diseñado para procesar eventos entrantes de la API de LinkedIn (*Recruiter System Connect - RSC*).

### Flujo en Entorno de Producción Real:
1. **Trigger:** Un candidato se postula a una oferta laboral en LinkedIn.
2. **Webhook Event:** LinkedIn envía un evento `POST` automático al endpoint `/api/candidates` de este middleware.
3. **Validación & Security:** El middleware valida la firma digital HTTP `x-linkedin-signature`, analiza la estructura del objeto con **Zod** y aplica los filtros de negocio (Filtro Geográfico Colombia).
4. **Transformación & Inserción:** Los datos estandarizados se registran inmediatamente en la API REST de BUK (`ceiba.buk.co`).

### Modo Simulador (Demo Actual):
Ante la ausencia de llaves API empresariales de producción de LinkedIn en entorno de prueba, la interfaz web del prototipo (`/`) y la colección de Postman incluyen un **Payload Generator** que reproduce el contrato JSON oficial entregado por los Webhooks de LinkedIn
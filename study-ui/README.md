# AI Study Assistant UI

Next.js and Tailwind CSS frontend for the Spring Boot service in `../study-service`.

## Run locally

1. Start the Spring Boot service on `http://localhost:8080`.
2. Copy `.env.example` to `.env.local` if the backend uses a different URL.
3. Install dependencies with `npm install`.
4. Start the UI with `npm run dev` and open `http://localhost:3000`.

The browser only calls same-origin `/api/study/*` routes. Next.js forwards those requests to the configured Spring Boot service, so no browser CORS configuration is required.

# Deploy Telemedicine App to Render

## Prerequisites

- [Render](https://render.com) account
- Git repository (GitHub/GitLab) with your code pushed

## Option 1: Deploy via Render Dashboard

1. **Log in** to [Render Dashboard](https://dashboard.render.com)

2. **New → Web Service**

3. **Connect your repository**
   - Connect GitHub/GitLab and select `telemedicine-app` (or your repo name)

4. **Configure the service**
   - **Name:** `telemedicine-app` (or any name)
   - **Region:** Choose closest to your users
   - **Runtime:** **Docker**
   - **Dockerfile Path:** `Dockerfile` (or leave default)
   - **Instance Type:** Free (or paid for production)

5. **Advanced** (optional)
   - **Health Check Path:** `/health` (nginx serves this)
   - **Docker Context:** `.` (root)

6. Click **Create Web Service**

7. Render will build and deploy. Your app will be live at:
   ```
   https://telemedicine-app-xxxx.onrender.com
   ```

## Option 2: Deploy via Blueprint (render.yaml)

1. In Render Dashboard: **New → Blueprint**

2. Connect your repo and Render will detect `render.yaml`

3. Apply the Blueprint — it will create the web service automatically

## Environment Variables (optional)

If you add a backend API later, set in Render Dashboard:

- **Environment → Add Environment Variable**
- e.g. `VITE_API_URL` = `https://your-api.onrender.com`

Then update `vite.config.js` to expose it:
```js
define: {
  'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '')
}
```

## Verify Deployment

- **Root:** `https://your-app.onrender.com/`
- **Health check:** `https://your-app.onrender.com/health` → returns `healthy`
- **SPA routes:** `/patient`, `/doctor`, `/register/doctor` etc. should all load

## Troubleshooting

- **Build fails:** Check Render build logs; ensure `npm run build` works locally
- **404 on refresh:** Nginx `try_files` should handle this; verify nginx.conf
- **Free tier sleeps:** Free services spin down after ~15 min inactivity; first load may be slow

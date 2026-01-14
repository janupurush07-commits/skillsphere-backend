Steps to deploy this backend from a frontend repo to Heroku

1) Merge this backend folder into your frontend repository (for example place contents under `backend/`).

2) Add these repository secrets in GitHub (frontend repo → Settings → Secrets):
   - `HEROKU_API_KEY` — your Heroku API key
   - `HEROKU_APP` — the Heroku app name
   - `HEROKU_EMAIL` — the Heroku account email

3) Ensure `Procfile` is present at repo root and `package.json` has a `heroku-postbuild` script (this repo is already prepared).

4) Push to `main` in the frontend repo. The workflow `.github/workflows/deploy-heroku.yml` will run and deploy the backend to Heroku.

Notes:
- If your frontend is hosted on Vercel, set the backend base URL (Heroku app URL) in the frontend's environment variables so the frontend can call the backend.
- If you want me to create the same workflow directly inside your frontend GitHub repository, provide the repository or grant access and I can add it.

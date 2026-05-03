# ☁️ Google Cloud Deployment Guide - VoteQuest Backend

This guide walks you through deploying the FastAPI backend to **Google Cloud Run** and setting up the PostgreSQL database using **Google Cloud SQL**.

## 📋 Prerequisites

1. A Google Cloud account with billing enabled.
2. [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed and authenticated.
3. Docker installed on your machine.

### Authenticate and Set Project
```bash
# Login to your Google account
gcloud auth login

# Create a new project (or use an existing one)
gcloud projects create votequest-backend-prod

# Set the active project
gcloud config set project votequest-backend-prod

# Enable required APIs
gcloud services enable run.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

---

## 🗄️ Step 1: Set up Google Cloud SQL (PostgreSQL)

Cloud Run needs a database to connect to. We will use Google Cloud SQL.

1. **Create the Database Instance:**
   ```bash
   gcloud sql instances create votequest-db-instance \
       --database-version=POSTGRES_14 \
       --cpu=1 --memory=3840MB \
       --region=us-central1
   ```

2. **Set the default user password:**
   ```bash
   gcloud sql users set-password postgres \
       --instance=votequest-db-instance \
       --password="YOUR_STRONG_PASSWORD"
   ```

3. **Create the VoteQuest database:**
   ```bash
   gcloud sql databases create votequest_db \
       --instance=votequest-db-instance
   ```

4. **Get the Connection Name:**
   ```bash
   gcloud sql instances describe votequest-db-instance --format="value(connectionName)"
   ```
   *(Save this value, it will look like `votequest-backend-prod:us-central1:votequest-db-instance`)*

---

## 🐳 Step 2: Build and Push the Docker Image

We need to upload your backend Docker image to Google Artifact Registry.

1. **Create a repository in Artifact Registry:**
   ```bash
   gcloud artifacts repositories create votequest-repo \
       --repository-format=docker \
       --location=us-central1
   ```

2. **Configure Docker to authenticate with GCP:**
   ```bash
   gcloud auth configure-docker us-central1-docker.pkg.dev
   ```

3. **Build and push the image:**
   ```bash
   cd backend
   
   # Build the image
   docker build -t us-central1-docker.pkg.dev/votequest-backend-prod/votequest-repo/backend:latest .
   
   # Push to Artifact Registry
   docker push us-central1-docker.pkg.dev/votequest-backend-prod/votequest-repo/backend:latest
   ```

---

## 🚀 Step 3: Deploy to Google Cloud Run

Now, deploy the container to Cloud Run and connect it to your Cloud SQL database.

```bash
gcloud run deploy votequest-api \
    --image us-central1-docker.pkg.dev/votequest-backend-prod/votequest-repo/backend:latest \
    --region us-central1 \
    --allow-unauthenticated \
    --add-cloudsql-instances="YOUR_CONNECTION_NAME_FROM_STEP_1" \
    --set-env-vars="ENVIRONMENT=production" \
    --set-env-vars="SECRET_KEY=generate_a_random_secure_string_here" \
    --set-env-vars="GEMINI_API_KEY=your_actual_gemini_api_key" \
    --set-env-vars="CORS_ORIGINS=[\"https://your-frontend-domain.netlify.app\"]" \
    --set-env-vars="DATABASE_URL=postgresql+psycopg2://postgres:YOUR_STRONG_PASSWORD@/votequest_db?host=/cloudsql/YOUR_CONNECTION_NAME_FROM_STEP_1"
```

*Note: Make sure to replace `YOUR_CONNECTION_NAME_FROM_STEP_1`, `YOUR_STRONG_PASSWORD`, and the `CORS_ORIGINS` URL with your actual values.*

---

## 🎉 Step 4: Connect your Frontend

Once the deployment finishes, the terminal will output a **Service URL** (e.g., `https://votequest-api-xyz-uc.a.run.app`).

1. Copy this URL.
2. Open your Netlify Dashboard (or local `.env.local` file).
3. Set your environment variable:
   ```env
   NEXT_PUBLIC_API_URL=https://votequest-api-xyz-uc.a.run.app
   ```
4. Rebuild/Redeploy your frontend.
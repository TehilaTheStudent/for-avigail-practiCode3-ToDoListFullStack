# Render API Service

A Node.js Express application that uses the Render API to list services in your Render account.

## Features

- 🚀 Express.js server with REST API endpoints
- 🔐 Secure API key management with environment variables
- 📋 List all services from your Render account
- 💚 Health check endpoint
- 🛡️ Error handling and validation

## API Endpoints

- `GET /` - Root endpoint with API documentation
- `GET /services` - Get list of all services in your Render account
- `GET /health` - Health check endpoint

## Setup Instructions

### 1. Get Your Render API Key

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Navigate to **Account Settings** → **API Keys**
3. Click **Create API Key**
4. Give it a name (e.g., "Services List App")
5. Copy the generated API key

### 2. Configure Environment Variables

1. Copy the API key you created
2. Open the `.env` file in this project
3. Replace `your_render_api_key_here` with your actual API key:

```env
RENDER_API_KEY=rnd_your_actual_api_key_here
PORT=3000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm start
```

The server will start on `http://localhost:3000`

## Testing the API

### Get Services List
```bash
curl http://localhost:3000/services
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Deployment to Render

### 1. Push to GitHub

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit: Render API service"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/yourusername/render-api-app.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `render-api-service` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or your preferred tier)

5. Add Environment Variable:
   - **Key**: `RENDER_API_KEY`
   - **Value**: Your Render API key

6. Click **Create Web Service**

### 3. Access Your Deployed App

Once deployed, your app will be available at:
`https://your-service-name.onrender.com`

## API Response Examples

### Services List Response
```json
{
  "success": true,
  "count": 3,
  "services": [
    {
      "id": "srv-xxxxx",
      "name": "my-web-app",
      "type": "web_service",
      "repo": "https://github.com/user/repo",
      "branch": "main",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Error Response
```json
{
  "error": "Render API Error",
  "message": "Invalid API key",
  "status": 401
}
```

## Security Notes

- ⚠️ Never commit your API key to version control
- ✅ Always use environment variables for sensitive data
- ✅ The `.env` file is already in `.gitignore`

## Troubleshooting

### "Render API key not configured" Error
- Make sure you've set the `RENDER_API_KEY` in your `.env` file
- Verify the API key is correct and active

### 401 Unauthorized Error
- Check that your API key is valid
- Ensure the API key has the necessary permissions

### Network Errors
- Verify your internet connection
- Check if Render API is accessible

## Documentation References

- [Render API Documentation](https://api-docs.render.com/reference)
- [Render API Keys Guide](https://render.com/docs/api)
- [Express.js Documentation](https://expressjs.com/)

# Deployment Guide for Zertainity.com

This guide will help you deploy the Zertainity platform to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Set up at [supabase.com](https://supabase.com)
3. **OpenAI/OpenRouter API Key**: Get from [openai.com](https://openai.com) or [openrouter.ai](https://openrouter.ai)
4. **GitHub Repository**: Push your code to GitHub

## Step 1: Set up Supabase

1. Create a new Supabase project
2. Go to Settings > API to get your URL and anon key
3. Run the database migrations:
   ```bash
   npx supabase db push
   ```
4. Enable Google Auth in Authentication > Providers

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. Set environment variables:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_API_URL
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   vercel env add OPENAI_API_KEY
   ```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Set environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_API_URL`: Your backend API URL (will be set after backend deployment)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENROUTER_API_KEY`: Your OpenRouter API key (if using OpenRouter)
   - `OPENROUTER_API_URL`: https://openrouter.ai/api/v1 (if using OpenRouter)

## Step 3: Deploy Backend

The backend will be automatically deployed as a Vercel serverless function based on the `vercel.json` configuration.

## Step 4: Configure CORS

Update your backend environment variables to include the frontend URL:
- `FRONTEND_URL`: Your deployed frontend URL (e.g., https://zertainity.vercel.app)

## Step 5: Test Deployment

1. Visit your deployed frontend URL
2. Test the authentication flow
3. Try uploading a marksheet
4. Complete an aptitude test
5. Chat with the AI coach
6. View recommendations

## Environment Variables Reference

### Frontend (.env.local)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### Backend (Vercel Environment Variables)
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
# OR
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=gpt-3.5-turbo
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend environment variables

2. **Database Connection Issues**: Verify Supabase URL and keys are correct

3. **AI API Errors**: Check your OpenAI/OpenRouter API key and credits

4. **Build Failures**: Ensure all dependencies are installed and environment variables are set

### Debugging

1. Check Vercel function logs for backend errors
2. Use browser developer tools for frontend issues
3. Verify environment variables in Vercel dashboard
4. Test API endpoints directly using tools like Postman

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update CORS settings to include your custom domain

## Monitoring

- Use Vercel Analytics for performance monitoring
- Set up error tracking with services like Sentry
- Monitor API usage and costs
- Set up alerts for critical errors

## Security Checklist

- [ ] Environment variables are properly set
- [ ] CORS is configured correctly
- [ ] Database RLS policies are enabled
- [ ] API rate limiting is active
- [ ] HTTPS is enforced
- [ ] Sensitive data is not exposed in client code

## Performance Optimization

- [ ] Images are optimized
- [ ] Code splitting is implemented
- [ ] Caching is configured
- [ ] CDN is enabled
- [ ] Bundle size is minimized

## Backup Strategy

- [ ] Database backups are enabled in Supabase
- [ ] Code is version controlled in Git
- [ ] Environment variables are documented
- [ ] Deployment process is documented

---

For additional support, please refer to the main README.md or create an issue on GitHub.
# Supabase Edge Functions - Quick Setup Checklist

## ✅ What's Been Created

### Edge Functions (3 total)
- ✅ `generate-recommendations-ai` - Farm recommendations
- ✅ `generate-alerts-ai` - Farm alerts  
- ✅ `analyze-crop-ai` - Crop disease analysis

### Frontend Updates
- ✅ Dashboard now uses edge function for recommendations
- ✅ AlertsPanel now uses edge function for alerts
- ✅ ImageUpload now uses edge function for crop analysis

### Features
- ✅ ChatGPT primary provider (gpt-3.5-turbo, gpt-4o-mini)
- ✅ Gemini fallback provider (gemini-pro, gemini-1.5-flash)
- ✅ Smart defaults when no APIs available
- ✅ Proper error handling and logging
- ✅ CORS headers configured
- ✅ Type validation and error responses

## 🚀 Deployment Steps

### 1. Install Supabase CLI
```bash
npm install -g supabase
supabase login
```

### 2. Navigate to Project
```bash
cd supabase/functions
```

### 3. Deploy All Functions
```bash
supabase functions deploy generate-recommendations-ai
supabase functions deploy generate-alerts-ai
supabase functions deploy analyze-crop-ai
```

### 4. Configure Secrets in Supabase Dashboard

Go to: **Settings → Secrets and vars → Secrets**

Add:
- **OPENAI_API_KEY** = `sk-...` (from https://platform.openai.com/api-keys)
- **GEMINI_API_KEY** = `...` (from https://aistudio.google.com/app/apikey)

Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-set

### 5. Test Functions

#### Test Recommendations
```bash
curl -i --location --request POST http://localhost:54321/functions/v1/generate-recommendations-ai \
  --header 'Authorization: Bearer [YOUR_ANON_KEY]' \
  --header 'Content-Type: application/json' \
  --data '{"farmId": "[FARM_ID]", "userId": "[USER_ID]"}'
```

#### Test Alerts
```bash
curl -i --location --request POST http://localhost:54321/functions/v1/generate-alerts-ai \
  --header 'Authorization: Bearer [YOUR_ANON_KEY]' \
  --header 'Content-Type: application/json' \
  --data '{"farmId": "[FARM_ID]", "userId": "[USER_ID]"}'
```

#### Test Crop Analysis
```bash
curl -i --location --request POST http://localhost:54321/functions/v1/analyze-crop-ai \
  --header 'Authorization: Bearer [YOUR_ANON_KEY]' \
  --header 'Content-Type: application/json' \
  --data '{
    "farmId": "[FARM_ID]",
    "userId": "[USER_ID]",
    "imageData": "[BASE64_IMAGE_DATA]",
    "imageName": "test.jpg"
  }'
```

### 6. Verify in App

1. ✅ Register/Login to app
2. ✅ Add a farm
3. ✅ Click "Generate Recommendations" button
   - Should create 5 recommendations
   - Check database or app UI for results
4. ✅ Click "Generate AI Alerts" button
   - Should create 4 alerts
   - Alerts appear in alerts panel (real-time subscription)
5. ✅ Upload a crop image
   - Should trigger analysis
   - Returns disease/health status with confidence

## 📊 Monitoring

### View Logs
Supabase Dashboard → Edge Functions → [Function Name] → Executions

### Monitor Costs
- Keep track of API usage
- ChatGPT is ~$0.0005-0.0015 per 1K tokens
- Gemini has free tier available
- Check billing in OpenAI and Google Cloud dashboards

### Alert Setup
- New functions will show as "Active" in dashboard
- Monitor error rates (should be < 1% normally)
- Set up alerts for high error rates

## 🐛 Troubleshooting

### Function Says "Disabled"
- Check if deployed successfully
- Run: `supabase functions list`
- Redeploy if needed: `supabase functions deploy [function-name]`

### Getting 401/403 Errors
- Verify API keys in Secrets are correct
- Check SUPABASE_SERVICE_ROLE_KEY is set
- Ensure user has proper RLS permissions

### Database Insert Fails
- Check RLS policies in Supabase
- Verify farm ID exists and belongs to user
- Check data types match schema (type must be one of: planting, irrigation, fertilizer, pesticide, harvest)

### Slow Response Times (>5 seconds)
- External API might be rate limited
- Check network connectivity
- Review Supabase function logs for timeouts
- Implement caching if needed

### Images Not Processing
- Check image size (max ~10MB)
- Ensure base64 encoding is valid
- Verify GEMINI_API_KEY is set (as fallback)

## 📚 Documentation

- Full guide: `SUPABASE_FUNCTIONS_GUIDE.md`
- API fixes summary: `AI_FIXES_SUMMARY.md`
- Security notes: `.env.example` (never commit real keys)

## 🔄 Workflow

**For users without API keys**:
1. App uses edge functions to call AI
2. Edge functions check for configured API keys
3. If no API keys, uses smart default recommendations/alerts
4. Crop analysis shows "pending" status with instructions

**For users with API keys configured**:
1. Edge functions use ChatGPT primary
2. Falls back to Gemini if ChatGPT fails
3. Uses smart defaults if both fail
4. All operations logged with provider info

## ✨ What's Next

- [ ] Test all functions in production
- [ ] Monitor error rates for first week
- [ ] Set up rate limiting if needed
- [ ] Optimize AI prompts based on results
- [ ] Add image upload storage integration
- [ ] Implement user credit system for API usage
- [ ] Add analytics/dashboard for AI feature usage

## 📞 Support

For issues:
1. Check logs in Supabase dashboard
2. Review error messages in app UI
3. Check browser console for frontend errors
4. Review git commit messages for recent changes

---

**Status**: ✅ Ready for deployment
**Last Updated**: December 4, 2025

# Supabase Edge Functions - AI Implementation Guide

## Overview

Three production-ready Supabase Edge Functions handle all AI operations for the grow-resiliently app:

1. **generate-recommendations-ai** - Farm recommendations generation
2. **generate-alerts-ai** - Farm alerts generation  
3. **analyze-crop-ai** - Crop image analysis with disease detection

## Architecture

### Benefits of Edge Functions
- **Security**: API keys stored in Supabase secrets, not exposed to frontend
- **Reliability**: Server-side fallback logic ensures features work without API keys
- **Performance**: Reduced frontend complexity and faster processing
- **Scalability**: Backend handles AI operations independently

## Edge Functions

### 1. generate-recommendations-ai

**Purpose**: Generate AI-powered farm management recommendations

**Endpoint**: `supabase.functions.invoke('generate-recommendations-ai')`

**Request Body**:
```typescript
{
  farmId: string;      // UUID of the farm
  userId: string;      // UUID of the user (for future tracking)
}
```

**Response**:
```typescript
{
  success: boolean;
  count: number;       // Number of recommendations created
  recommendations: []  // Array of inserted recommendation records
}
```

**AI Providers (in order)**:
1. ChatGPT (gpt-3.5-turbo) - Via OPENAI_API_KEY
2. Gemini (gemini-pro) - Via GEMINI_API_KEY
3. Smart Defaults - Contextual recommendations based on farm data

**Database Schema**:
The function inserts into `public.recommendations` table with:
- `farm_id`: UUID
- `title`: Recommendation title
- `description`: Detailed description
- `type`: One of: planting, irrigation, fertilizer, pesticide, harvest
- `priority`: One of: low, medium, high

### 2. generate-alerts-ai

**Purpose**: Generate real-time farm alerts and warnings

**Endpoint**: `supabase.functions.invoke('generate-alerts-ai')`

**Request Body**:
```typescript
{
  farmId: string;      // UUID of the farm
  userId: string;      // UUID of the user (for alert filtering)
}
```

**Response**:
```typescript
{
  success: boolean;
  count: number;       // Number of alerts created
  alerts: []           // Array of inserted alert records
}
```

**AI Providers (in order)**:
1. ChatGPT (gpt-3.5-turbo) - Via OPENAI_API_KEY
2. Gemini (gemini-pro) - Via GEMINI_API_KEY
3. Smart Defaults - Contextual alerts based on farm conditions

**Database Schema**:
The function inserts into `public.alerts` table with:
- `farm_id`: UUID
- `user_id`: UUID (for alert ownership)
- `level`: One of: info, warning, critical
- `title`: Alert title
- `message`: Alert message
- `is_read`: Boolean (default false)

### 3. analyze-crop-ai

**Purpose**: Analyze crop images for diseases, pests, and stress conditions

**Endpoint**: `supabase.functions.invoke('analyze-crop-ai')`

**Request Body**:
```typescript
{
  farmId: string;      // UUID of the farm
  userId: string;      // UUID of the user
  imageData: string;   // Base64 encoded image data (with or without data:image/jpeg;base64, prefix)
  imageName: string;   // Original image filename
}
```

**Response**:
```typescript
{
  success: boolean;
  analysis: {
    disease: string;        // Disease/condition name or "Healthy"
    severity: string;       // low|medium|high|critical
    confidence: number;     // 0-100 confidence percentage
    description: string;    // What the AI detected
    recommendations: string; // Treatment recommendations
  },
  imageRecord: {            // Saved image metadata
    id: string;
    storage_path: string;
    ai_label: string;
    ai_confidence: number;
  }
}
```

**AI Providers (in order)**:
1. ChatGPT Vision (gpt-4o-mini) - Via OPENAI_API_KEY
2. Gemini Vision (gemini-1.5-flash) - Via GEMINI_API_KEY
3. Smart Defaults - Informs user to check API keys

**Database Schema**:
Saves to `public.images` and `public.analysis_results` tables

## Deployment

### Prerequisites
```bash
# Install Supabase CLI
npm install -g supabase

# Authenticate
supabase login
```

### Deploy Functions

```bash
# From project root
supabase functions deploy generate-recommendations-ai
supabase functions deploy generate-alerts-ai
supabase functions deploy analyze-crop-ai
```

### Configure Environment Variables

Set these secrets in Supabase Dashboard (Settings > Secrets):

```
OPENAI_API_KEY=sk-...         # From https://platform.openai.com/api-keys
GEMINI_API_KEY=...            # From https://aistudio.google.com/app/apikey
```

The following are already set by Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Frontend Integration

### Dashboard Recommendations

```typescript
const response = await supabase.functions.invoke('generate-recommendations-ai', {
  body: { farmId: selectedFarm.id, userId: user.id }
});
```

### AlertsPanel Alerts

```typescript
const response = await supabase.functions.invoke('generate-alerts-ai', {
  body: { farmId, userId: user.id }
});
```

### ImageUpload Crop Analysis

```typescript
const response = await supabase.functions.invoke('analyze-crop-ai', {
  body: {
    farmId,
    userId: user.id,
    imageData,       // Base64 encoded
    imageName
  }
});
```

## Error Handling

All functions return structured errors:

```typescript
{
  error: {
    message: "Specific error description"
  }
}
```

Common errors:
- **farmId not found**: Farm doesn't exist for this user
- **Missing API keys**: All API keys not configured (falls back gracefully)
- **API rate limit**: Too many requests to external APIs
- **Database error**: RLS policy or constraint violation

## Monitoring

### View Logs
```bash
supabase functions list
supabase functions get [function-name]
supabase functions delete [function-name]  # To remove a function
```

### Check Edge Function Status
- Supabase Dashboard → Edge Functions → View execution logs
- Monitor API rate limits and usage

## Type Safety

For TypeScript projects, define these types:

```typescript
interface GenerateRecommendationsRequest {
  farmId: string;
  userId: string;
}

interface GenerateAlertsRequest {
  farmId: string;
  userId: string;
}

interface AnalyzeCropRequest {
  farmId: string;
  userId: string;
  imageData: string;
  imageName: string;
}

interface AIResponse<T> {
  success: boolean;
  count?: number;
  data?: T;
  error?: {
    message: string;
  };
}
```

## Testing

### Local Testing
```bash
supabase functions serve
```

Then invoke from frontend with:
```typescript
const response = await supabase.functions.invoke('function-name', {
  body: { /* request body */ }
});
```

### Production Testing
Test with real data after deploying to ensure:
- ✅ API keys are properly configured
- ✅ Database inserts work with RLS policies
- ✅ Fallback logic triggers when needed
- ✅ Error handling shows user-friendly messages

## Cost Optimization

### API Usage Tiers
- **ChatGPT**: $0.0005-0.0015 per 1K tokens (text), $0.005 per 1K tokens (vision)
- **Gemini**: Free tier available, paid tier $1-15 per million tokens
- **Supabase**: Edge Functions: $0.0000001 per request (first 2M free)

### Rate Limiting
Consider implementing rate limiting in edge functions:

```typescript
// Example: 5 requests per day per user
const daily_limit = 5;
// Use check_and_use_credit() function from database
```

## Troubleshooting

### Edge functions return 401
- Check API keys are set in Supabase secrets
- Verify SUPABASE_SERVICE_ROLE_KEY environment variable

### Database inserts fail
- Check RLS policies allow service role access
- Verify farm exists and belongs to user
- Check data types match database schema

### Slow response times
- External APIs may be rate limited
- Check network connectivity
- Monitor Supabase function logs for timeouts

## Security Best Practices

✅ **What we do right**:
- API keys stored in Supabase secrets, not in code
- RLS policies enforce user data isolation
- Service role key only used in edge functions
- Validation of all input parameters

✅ **Security considerations**:
- Never log or expose API keys
- Validate image size before processing (>5MB files cause issues)
- Implement rate limiting for production
- Monitor usage for unusual patterns

## Next Steps

1. **Deploy functions** to production Supabase project
2. **Configure API keys** in Supabase secrets
3. **Test all three functions** with real farm data
4. **Monitor logs** for first week after deployment
5. **Optimize prompts** based on AI response quality
6. **Implement rate limiting** if usage exceeds free tier

## References

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime Docs](https://deno.land/manual)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/)

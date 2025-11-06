import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Database, Zap, Shield, Key, Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const API = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">ClimaSmart</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Developer API</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">ClimaSmart API</h1>
            <p className="text-xl text-muted-foreground">
              Build powerful climate-smart agriculture applications with our comprehensive API
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Everything you need to integrate with ClimaSmart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The ClimaSmart API provides programmatic access to farm management, AI-powered crop analysis, 
                    weather data, and personalized recommendations. Built on modern serverless architecture, 
                    our API scales automatically with your needs.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 border rounded-lg">
                      <Zap className="h-8 w-8 text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Edge Functions</h4>
                      <p className="text-sm text-muted-foreground">
                        Serverless functions that scale automatically
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Database className="h-8 w-8 text-primary mb-3" />
                      <h4 className="font-semibold mb-2">PostgreSQL</h4>
                      <p className="text-sm text-muted-foreground">
                        Powerful relational database with real-time capabilities
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Shield className="h-8 w-8 text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Row-Level Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Built-in data protection at the database level
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Base URL</CardTitle>
                  <CardDescription>All API requests should be made to this base URL</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                    https://wemtoxjiimqahpfdqvhd.supabase.co
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    All endpoints require proper authentication headers. See the Authentication tab for details.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rate Limits</CardTitle>
                  <CardDescription>API usage limits and credit system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">Crop Analysis</span>
                      <Badge>5 credits per request</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">Generate Recommendations</span>
                      <Badge>10 credits per request</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">Database Operations</span>
                      <Badge variant="secondary">No credit cost</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Authentication Tab */}
            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Methods</CardTitle>
                  <CardDescription>Secure your API requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      API Key Authentication
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Include your API key in the request headers:
                    </p>
                    <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                      <div>apikey: your_supabase_anon_key</div>
                      <div>Authorization: Bearer your_jwt_token</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Getting Your API Key</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                      <li>1. Sign up for a ClimaSmart account</li>
                      <li>2. Navigate to your account settings</li>
                      <li>3. Generate an API key from the Developer section</li>
                      <li>4. Keep your API key secure and never share it publicly</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm font-semibold text-destructive mb-2">⚠️ Security Warning</p>
                    <p className="text-sm text-muted-foreground">
                      Never expose your API keys in client-side code. Always make API calls from your backend server.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Authentication Flow</CardTitle>
                  <CardDescription>Authenticate users with email/password</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Sign Up</h4>
                      <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{`POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}`}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Sign In</h4>
                      <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{`POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Endpoints Tab */}
            <TabsContent value="endpoints" className="space-y-6">
              {/* Analyze Crop Endpoint */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Analyze Crop Image</CardTitle>
                      <CardDescription>AI-powered crop health analysis</CardDescription>
                    </div>
                    <Badge>POST</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Endpoint</h4>
                    <div className="p-3 bg-muted rounded font-mono text-sm">
                      POST /functions/v1/analyze-crop
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "imageUrl": "https://example.com/crop-image.jpg",
  "farmId": "uuid-of-farm",
  "userId": "uuid-of-user"
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "success": true,
  "analysis": {
    "health_status": "healthy",
    "confidence": 0.92,
    "issues": [],
    "recommendations": [
      "Continue current irrigation schedule",
      "Monitor for early signs of pests"
    ]
  },
  "creditsRemaining": 95
}`}</pre>
                    </div>
                  </div>

                  <div className="p-3 bg-primary/10 border border-primary/20 rounded">
                    <p className="text-sm">
                      <strong>Credit Cost:</strong> 5 credits per analysis
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Recommendations Endpoint */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Generate Recommendations</CardTitle>
                      <CardDescription>Get personalized farming recommendations</CardDescription>
                    </div>
                    <Badge>POST</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Endpoint</h4>
                    <div className="p-3 bg-muted rounded font-mono text-sm">
                      POST /functions/v1/generate-recommendations
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "farmId": "uuid-of-farm",
  "userId": "uuid-of-user"
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "success": true,
  "recommendations": [
    {
      "title": "Optimize Irrigation",
      "description": "Reduce water usage by 20%...",
      "priority": "high",
      "type": "water_management"
    }
  ],
  "creditsRemaining": 85
}`}</pre>
                    </div>
                  </div>

                  <div className="p-3 bg-primary/10 border border-primary/20 rounded">
                    <p className="text-sm">
                      <strong>Credit Cost:</strong> 10 credits per generation
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Database REST API */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Database REST API</CardTitle>
                      <CardDescription>Direct database access via REST</CardDescription>
                    </div>
                    <Badge variant="secondary">GET/POST/PATCH/DELETE</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Access database tables directly using RESTful endpoints. All requests must include authentication headers.
                  </p>

                  <div>
                    <h4 className="font-semibold mb-2">Get Farms</h4>
                    <div className="p-3 bg-muted rounded font-mono text-sm">
                      GET /rest/v1/farms?select=*
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Create Farm</h4>
                    <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`POST /rest/v1/farms
Content-Type: application/json

{
  "name": "Green Valley Farm",
  "area_ha": 5.5,
  "latitude": -1.2921,
  "longitude": 36.8219,
  "soil_type": "loamy",
  "has_irrigation": true
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Get Recommendations</h4>
                    <div className="p-3 bg-muted rounded font-mono text-sm">
                      GET /rest/v1/recommendations?farm_id=eq.{'{farm_id}'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Tab */}
            <TabsContent value="database" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Schema</CardTitle>
                  <CardDescription>Available tables and their structures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Farms Table */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        farms
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Primary Key</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">user_id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">name</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">area_ha</span>
                          <span>numeric</span>
                          <span className="text-muted-foreground">Optional</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">latitude</span>
                          <span>numeric</span>
                          <span className="text-muted-foreground">Optional</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">longitude</span>
                          <span>numeric</span>
                          <span className="text-muted-foreground">Optional</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">soil_type</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Optional</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">has_irrigation</span>
                          <span>boolean</span>
                          <span className="text-muted-foreground">Default: false</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations Table */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        recommendations
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Primary Key</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">farm_id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">title</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">description</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">type</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">priority</span>
                          <span>text</span>
                          <span className="text-muted-foreground">medium</span>
                        </div>
                      </div>
                    </div>

                    {/* Images Table */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        images
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Primary Key</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">user_id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">farm_id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">storage_path</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">ai_label</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Optional</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">ai_confidence</span>
                          <span>numeric</span>
                          <span className="text-muted-foreground">Optional</span>
                        </div>
                      </div>
                    </div>

                    {/* Alerts Table */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        alerts
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Primary Key</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">user_id</span>
                          <span>uuid</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">title</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">message</span>
                          <span>text</span>
                          <span className="text-muted-foreground">Required</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">level</span>
                          <span>text</span>
                          <span className="text-muted-foreground">info</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <span className="text-muted-foreground">is_read</span>
                          <span>boolean</span>
                          <span className="text-muted-foreground">Default: false</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Policies</CardTitle>
                  <CardDescription>Row-Level Security (RLS) policies protect your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">User Data Isolation</h4>
                      <p className="text-sm text-muted-foreground">
                        All tables implement RLS policies ensuring users can only access their own data. 
                        You cannot view, modify, or delete data belonging to other users.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Automatic Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Every request is automatically authenticated using JWT tokens. 
                        The user_id is extracted from the token and used to enforce access control.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Examples Tab */}
            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>JavaScript/TypeScript Example</CardTitle>
                  <CardDescription>Using the Supabase client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wemtoxjiimqahpfdqvhd.supabase.co',
  'your-anon-key'
)

// Analyze crop image
const analyzeCrop = async (imageUrl, farmId) => {
  const { data, error } = await supabase.functions.invoke(
    'analyze-crop',
    {
      body: {
        imageUrl,
        farmId,
        userId: user.id
      }
    }
  )
  
  if (error) throw error
  return data
}

// Get farms
const getFarms = async () => {
  const { data, error } = await supabase
    .from('farms')
    .select('*')
  
  if (error) throw error
  return data
}

// Create a farm
const createFarm = async (farmData) => {
  const { data, error } = await supabase
    .from('farms')
    .insert([farmData])
    .select()
  
  if (error) throw error
  return data
}`}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Python Example</CardTitle>
                  <CardDescription>Using the Supabase Python client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`from supabase import create_client, Client

supabase: Client = create_client(
    "https://wemtoxjiimqahpfdqvhd.supabase.co",
    "your-anon-key"
)

# Get farms
def get_farms():
    response = supabase.table('farms').select("*").execute()
    return response.data

# Create a farm
def create_farm(farm_data):
    response = supabase.table('farms').insert(farm_data).execute()
    return response.data

# Analyze crop
def analyze_crop(image_url, farm_id, user_id):
    response = supabase.functions.invoke(
        'analyze-crop',
        invoke_options={
            'body': {
                'imageUrl': image_url,
                'farmId': farm_id,
                'userId': user_id
            }
        }
    )
    return response.json()`}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>cURL Example</CardTitle>
                  <CardDescription>Direct HTTP requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`# Analyze crop
curl -X POST \\
  https://wemtoxjiimqahpfdqvhd.supabase.co/functions/v1/analyze-crop \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'apikey: YOUR_ANON_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "farmId": "farm-uuid",
    "userId": "user-uuid"
  }'

# Get farms
curl -X GET \\
  'https://wemtoxjiimqahpfdqvhd.supabase.co/rest/v1/farms?select=*' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
  -H 'apikey: YOUR_ANON_KEY'`}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Need Help?</CardTitle>
              <CardDescription className="text-lg">
                Our team is here to help you integrate with ClimaSmart API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/documentation">View Documentation</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:kasainielekireu@gmail.com">Contact Support</a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Email: kasainielekireu@gmail.com | Phone: 0795872528
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">ClimaSmart</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers with climate-smart solutions for sustainable agriculture.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-primary transition-colors">API</Link></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="tel:+254795872528" className="hover:text-primary transition-colors">Phone: 0795872528</a></li>
                <li><a href="mailto:kasainielekireu@gmail.com" className="hover:text-primary transition-colors">Email: kasainielekireu@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 ClimaSmart. Created by Kasainie Lekireu. Empowering farmers with climate-smart solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default API;

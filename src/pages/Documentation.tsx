import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, Cloud, Database, Image, TrendingUp, Users, Zap, Shield, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Documentation = () => {
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
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Complete guide to using ClimaSmart - Your Climate-Smart Agriculture Platform
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="api">API & Backend</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What is ClimaSmart?</CardTitle>
                  <CardDescription>Understanding our climate-smart agriculture platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    ClimaSmart is a comprehensive climate-smart agriculture platform designed to help farmers optimize their farming practices using AI-powered insights, real-time weather data, and personalized recommendations.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="flex gap-3">
                      <Cloud className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Weather Intelligence</h4>
                        <p className="text-sm text-muted-foreground">Real-time weather data and forecasts to plan farming activities</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Image className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">AI Crop Analysis</h4>
                        <p className="text-sm text-muted-foreground">Upload crop images for instant AI-powered health analysis</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Smart Recommendations</h4>
                        <p className="text-sm text-muted-foreground">Personalized farming advice based on your farm conditions</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Bell className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Real-time Alerts</h4>
                        <p className="text-sm text-muted-foreground">Get notified about critical weather and crop conditions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                  <CardDescription>Built with modern, scalable technologies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Frontend</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• React 18</li>
                        <li>• TypeScript</li>
                        <li>• Tailwind CSS</li>
                        <li>• Vite</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Backend</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Lovable Cloud</li>
                        <li>• PostgreSQL</li>
                        <li>• Edge Functions</li>
                        <li>• Real-time subscriptions</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">AI & APIs</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• OpenAI GPT-4 Vision</li>
                        <li>• Weather API</li>
                        <li>• Image Analysis</li>
                        <li>• Natural Language Processing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Getting Started Tab */}
            <TabsContent value="getting-started" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Guide</CardTitle>
                  <CardDescription>Get up and running in minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Create Your Account</h4>
                        <p className="text-sm text-muted-foreground mb-2">Sign up with your email address to get started. Your account will be activated immediately.</p>
                        <Button size="sm" asChild>
                          <Link to="/auth">Sign Up Now</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Register Your Farm</h4>
                        <p className="text-sm text-muted-foreground">Add your farm details including location, size, crops, and soil type. This helps us provide personalized recommendations.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Upload Crop Images</h4>
                        <p className="text-sm text-muted-foreground">Take photos of your crops and upload them for AI-powered health analysis. Get instant insights on crop conditions and potential issues.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Get Recommendations</h4>
                        <p className="text-sm text-muted-foreground">Receive personalized, climate-smart recommendations based on weather patterns, crop conditions, and your farm data.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Requirements</CardTitle>
                  <CardDescription>What you need to use ClimaSmart</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Web Browser</h4>
                      <p className="text-sm text-muted-foreground">Modern web browser (Chrome, Firefox, Safari, or Edge) with JavaScript enabled</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Internet Connection</h4>
                      <p className="text-sm text-muted-foreground">Stable internet connection for real-time features and AI analysis</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Camera (Optional)</h4>
                      <p className="text-sm text-muted-foreground">Device with camera for capturing crop images for analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Features</CardTitle>
                  <CardDescription>Explore what ClimaSmart can do for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        Farm Management
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Register and manage multiple farms with detailed information including location, size, irrigation systems, and soil types. View comprehensive statistics and track farm performance over time.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Image className="h-5 w-5 text-primary" />
                        AI-Powered Crop Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Upload images of your crops and receive instant AI analysis using GPT-4 Vision. Get detailed insights on crop health, disease detection, pest identification, and actionable recommendations for improvement.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-primary" />
                        Weather Intelligence
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Access real-time weather data and forecasts for your farm location. Plan irrigation, planting, and harvesting activities based on accurate weather predictions.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Smart Recommendations
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Receive personalized, climate-smart farming recommendations generated based on your farm conditions, weather patterns, and crop types. Recommendations are prioritized by urgency and impact.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        Real-time Alerts
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified about critical conditions including extreme weather, crop diseases detected in analysis, and urgent farming actions needed. Stay informed to protect your crops.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        User Authentication
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Secure authentication system with email-based login. Your data is protected and accessible only to you. Multi-farm support allows managing multiple properties under one account.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Credit System
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Usage-based credit system for AI features. Each new user starts with 100 free credits. Crop analysis and recommendation generation consume credits based on complexity.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Data Security
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your farm data and images are securely stored with row-level security. Only you can access your information. Regular backups ensure data safety.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Credit Usage Guide</CardTitle>
                  <CardDescription>Understanding how credits work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Starting Credits</h4>
                      <p className="text-sm text-muted-foreground">Every new user receives 100 free credits to get started with AI features.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Credit Costs</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Crop Image Analysis: 5 credits per image</li>
                        <li>• Generate Recommendations: 10 credits per generation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Monitoring Credits</h4>
                      <p className="text-sm text-muted-foreground">Your current credit balance is displayed in the dashboard header. You'll receive warnings when credits are running low.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API & Backend Tab */}
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Backend Architecture</CardTitle>
                  <CardDescription>Understanding the platform's backend</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    ClimaSmart is built on Lovable Cloud, providing a robust, scalable backend infrastructure with PostgreSQL database, authentication, storage, and serverless functions.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Database Tables</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">farms</code> - Farm information</li>
                        <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">recommendations</code> - AI recommendations</li>
                        <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">alerts</code> - System alerts</li>
                        <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">credits</code> - User credits</li>
                        <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">crop_images</code> - Uploaded images</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Edge Functions</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">analyze-crop</code> - Image analysis</li>
                        <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">generate-recommendations</code> - AI recommendations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security & Permissions</CardTitle>
                  <CardDescription>Row-Level Security (RLS) policies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      All database tables are protected with Row-Level Security (RLS) policies ensuring users can only access their own data.
                    </p>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-sm">Data Access Rules</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Users can only view, create, update, and delete their own farms</li>
                        <li>• Recommendations are linked to user's farms only</li>
                        <li>• Crop images are private and accessible only to the owner</li>
                        <li>• Credits are managed per user with secure transactions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Edge Functions</CardTitle>
                  <CardDescription>Serverless backend functions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">analyze-crop</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Analyzes crop images using OpenAI GPT-4 Vision API. Checks user credits, processes the image, stores results, and creates alerts if issues are detected.
                      </p>
                      <div className="text-xs bg-muted p-3 rounded">
                        <div><strong>Input:</strong> Image URL, Farm ID, User ID</div>
                        <div><strong>Output:</strong> Analysis results with health status and recommendations</div>
                        <div><strong>Cost:</strong> 5 credits per analysis</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">generate-recommendations</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Generates personalized farming recommendations based on farm data, weather conditions, and historical patterns.
                      </p>
                      <div className="text-xs bg-muted p-3 rounded">
                        <div><strong>Input:</strong> Farm ID, User ID</div>
                        <div><strong>Output:</strong> List of prioritized recommendations</div>
                        <div><strong>Cost:</strong> 10 credits per generation</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get Support</CardTitle>
                  <CardDescription>We're here to help you succeed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg">
                      <h4 className="font-semibold mb-4">Contact Information</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Phone</div>
                          <a href="tel:+254795872528" className="text-primary hover:underline font-medium">
                            0795872528
                          </a>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Email</div>
                          <a href="mailto:kasainielekireu@gmail.com" className="text-primary hover:underline font-medium">
                            kasainielekireu@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border rounded-lg">
                      <h4 className="font-semibold mb-4">Response Times</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email Support</span>
                          <span className="font-medium">24-48 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone Support</span>
                          <span className="font-medium">Business hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Critical Issues</span>
                          <span className="font-medium">Same day</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Common questions and answers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2">How do I reset my password?</h4>
                      <p className="text-sm text-muted-foreground">
                        Click on "Forgot Password" on the login page and follow the instructions sent to your email.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2">Can I manage multiple farms?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! You can register and manage multiple farms under one account. Switch between farms using the dropdown in the dashboard.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2">What image formats are supported?</h4>
                      <p className="text-sm text-muted-foreground">
                        We support JPEG, PNG, and WebP formats. Images should be clear and well-lit for best analysis results.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2">How accurate is the AI analysis?</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI uses GPT-4 Vision, providing highly accurate analysis. However, always consult with agricultural experts for critical decisions.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2">What happens when I run out of credits?</h4>
                      <p className="text-sm text-muted-foreground">
                        Contact our support team to purchase additional credits. We offer various credit packages to suit your needs.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2">Is my data secure?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! All data is encrypted and protected with row-level security. Only you can access your farm information and images.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                  <CardDescription>Learn more about climate-smart agriculture</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/">Visit Our Blog</Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/auth">Create Free Account</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ClimaSmart. Created by Kasainie Lekireu. Empowering farmers with climate-smart solutions.</p>
        </div>
      </footer>
    </div>
  );
};

// Import Leaf icon
import { Leaf } from "lucide-react";

export default Documentation;

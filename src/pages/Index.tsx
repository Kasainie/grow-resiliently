import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Cloud, Droplets, Sprout, TrendingUp, 
  AlertTriangle, Smartphone, BarChart3, Leaf 
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import heroImage from "@/assets/hero-farm.jpg";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import farmerMobile from "@/assets/farmer-mobile.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">CSA.AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">How It Works</a>
            <a href="#impact" className="text-foreground/80 hover:text-primary transition-colors">Impact</a>
            <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">About</Link>
            <Link to="/pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</Link>
            <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors">Contact</Link>
            <ThemeToggle />
            <Button variant="default" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-success/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-sm font-semibold text-primary">Climate-Smart Agriculture Platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Farm Smarter,<br />
                <span className="text-primary">Adapt Faster</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                AI-powered recommendations to help smallholder farmers adapt to climate change, 
                boost resilience, and increase yields while reducing emissions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground" asChild>
                  <Link to="/auth">Start Free Trial</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Farmers Supported</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <div className="text-3xl font-bold text-success">+35%</div>
                  <div className="text-sm text-muted-foreground">Avg. Yield Increase</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <div className="text-3xl font-bold text-accent">15+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <img 
                src={heroImage} 
                alt="Farmer using CSA.AI technology in field" 
                className="relative rounded-2xl shadow-strong w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Adapt
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From climate forecasts to AI-powered recommendations, CSA.AI gives farmers 
              the tools to thrive in a changing climate.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-strong transition-shadow bg-card">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Climate Forecasts</h3>
              <p className="text-muted-foreground">
                7-14 day and seasonal forecasts tailored to your exact location and crops.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-strong transition-shadow bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Crop Management</h3>
              <p className="text-muted-foreground">
                AI recommendations for planting, irrigation, and fertilizer to maximize yields.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-strong transition-shadow bg-card">
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Early Warnings</h3>
              <p className="text-muted-foreground">
                Real-time alerts for drought, floods, pests, and diseases before they strike.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-strong transition-shadow bg-card">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Mobile-First</h3>
              <p className="text-muted-foreground">
                Works offline, supports SMS/USSD for areas with limited connectivity.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-strong transition-shadow bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Water Management</h3>
              <p className="text-muted-foreground">
                Optimize irrigation schedules based on soil moisture and rainfall forecasts.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-strong transition-shadow bg-card">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Yield Forecasting</h3>
              <p className="text-muted-foreground">
                Predict harvest outcomes to plan sales and manage risk effectively.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-strong transition-shadow bg-card">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Impact Analytics</h3>
              <p className="text-muted-foreground">
                Track your progress and see how you're contributing to SDG 13 goals.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-strong transition-shadow bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Lower Emissions</h3>
              <p className="text-muted-foreground">
                Precision recommendations reduce fertilizer use and greenhouse gas emissions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Designed for Farmers,<br />Powered by AI
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Register Your Farm</h3>
                    <p className="text-muted-foreground">
                      Add your location, farm size, crops, and soil type. We'll customize everything for you.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Get Weekly Action Plans</h3>
                    <p className="text-muted-foreground">
                      Receive AI-generated recommendations on when to plant, water, fertilize, and harvest.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Monitor & Adapt</h3>
                    <p className="text-muted-foreground">
                      Upload crop images, report observations, and get real-time alerts for pests or weather risks.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center text-warning font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Track Your Impact</h3>
                    <p className="text-muted-foreground">
                      See how your farm is becoming more resilient and reducing emissions over time.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="mt-8 bg-primary hover:bg-primary-hover" asChild>
                <Link to="/auth">Try It Now</Link>
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src={farmerMobile} 
                alt="Farmer using CSA.AI mobile app" 
                className="rounded-2xl shadow-strong"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={dashboardPreview} 
                alt="CSA.AI Dashboard" 
                className="rounded-2xl shadow-strong"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Aligned with SDG 13:<br />Climate Action
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-6">
                CSA.AI directly supports global climate adaptation goals by strengthening 
                resilience, improving climate literacy, and reducing disaster impacts for 
                vulnerable farming communities.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-success-foreground">✓</span>
                  </div>
                  <p className="text-primary-foreground/90">
                    <strong>Strengthened resilience:</strong> Farmers adapt faster to climate shocks with early warnings
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-success-foreground">✓</span>
                  </div>
                  <p className="text-primary-foreground/90">
                    <strong>Reduced emissions:</strong> Precision fertilizer recommendations cut GHG by up to 25%
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-success-foreground">✓</span>
                  </div>
                  <p className="text-primary-foreground/90">
                    <strong>Measurable impact:</strong> Track progress with SDG-aligned metrics and reporting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using CSA.AI to adapt to climate change 
            and build sustainable livelihoods.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground" asChild>
            <Link to="/auth">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">CSA.AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Climate-smart agriculture for a resilient future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-primary transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
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
            <div>
              <h3 className="font-semibold text-foreground mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 ClimaSmart. Created by Kasainie Lekireu. Supporting SDG 13: Climate Action.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

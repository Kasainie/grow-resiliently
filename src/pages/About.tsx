import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Leaf, Target, Users, Award, ArrowRight, Cloud, TrendingUp, Shield } from "lucide-react";

const About = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ClimaSmart</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium text-primary">
              About
            </Link>
            <Link to="/documentation" className="text-sm font-medium hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/api" className="text-sm font-medium hover:text-primary transition-colors">
              API
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            <ThemeToggle />
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl">
          <div className="text-center space-y-6 animate-fade-up">
            <h1 className="text-5xl font-bold tracking-tight">
              About ClimaSmart
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering farmers with AI-driven climate intelligence to build resilient and sustainable agricultural practices
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To revolutionize agriculture by providing farmers with intelligent, 
                      data-driven insights that help them adapt to climate change, optimize 
                      crop yields, and ensure food security for future generations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      A world where every farmer has access to cutting-edge climate intelligence, 
                      enabling sustainable farming practices that protect our planet while 
                      maximizing productivity and profitability.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                ClimaSmart was born from a simple observation: farmers around the world are 
                facing unprecedented challenges from climate change, yet they lack access to 
                the tools and technology that could help them adapt and thrive.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2025 by Kasainie Lekireu, ClimaSmart combines advanced artificial 
                intelligence, real-time weather data, and agricultural expertise to provide 
                farmers with actionable insights. Our platform analyzes climate patterns, 
                soil conditions, and crop health to deliver personalized recommendations that 
                help farmers make informed decisions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, ClimaSmart serves farmers across multiple regions, helping them increase 
                yields, reduce waste, and build more sustainable farming operations. We're 
                committed to democratizing access to agricultural technology and making climate 
                intelligence available to farmers of all sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Cloud className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Climate Intelligence</h3>
                <p className="text-muted-foreground">
                  Real-time weather data and climate forecasts tailored to your farm location
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Crop Analytics</h3>
                <p className="text-muted-foreground">
                  AI-powered analysis of crop health and yield predictions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Risk Management</h3>
                <p className="text-muted-foreground">
                  Early warning systems for pests, diseases, and extreme weather events
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold">Farmer-First</h3>
              <p className="text-sm text-muted-foreground">
                Every decision we make puts farmers' needs at the center
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Promoting practices that protect our planet for future generations
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Leveraging cutting-edge technology to solve real-world challenges
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold">Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                Making powerful tools available to farmers everywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl">
          <Card className="border-2 bg-primary/5">
            <CardContent className="pt-10 pb-10 text-center space-y-6">
              <h2 className="text-3xl font-bold">Join the ClimaSmart Community</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start making smarter farming decisions today with our AI-powered platform
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-secondary/20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">ClimaSmart</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered climate intelligence for sustainable farming
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/api" className="hover:text-primary transition-colors">API</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                  required
                />
                <Button type="submit" className="w-full" size="sm">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 ClimaSmart. Created by Kasainie Lekireu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;

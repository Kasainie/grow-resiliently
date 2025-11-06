import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Leaf, Zap, TrendingUp, Crown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PricingTier {
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: any;
  pricePerCredit: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "KES 0",
    credits: 100,
    pricePerCredit: "Free",
    description: "Perfect for trying out ClimaSmart",
    icon: Leaf,
    features: [
      "100 free credits on signup",
      "AI crop image analysis",
      "Weather forecasts",
      "Basic recommendations",
      "Mobile & web access",
      "Email support"
    ]
  },
  {
    name: "Farmer",
    price: "KES 500",
    credits: 250,
    pricePerCredit: "KES 2.00",
    description: "Great for small to medium farms",
    icon: Zap,
    features: [
      "250 AI credits",
      "Priority AI analysis",
      "Advanced weather insights",
      "Personalized recommendations",
      "Multiple farm management",
      "Real-time alerts",
      "Email & phone support"
    ]
  },
  {
    name: "Professional",
    price: "KES 1,500",
    credits: 1000,
    pricePerCredit: "KES 1.50",
    description: "Best value for active farmers",
    icon: TrendingUp,
    popular: true,
    features: [
      "1,000 AI credits",
      "Fastest AI processing",
      "Premium weather data",
      "Expert recommendations",
      "Unlimited farms",
      "Priority real-time alerts",
      "Detailed analytics",
      "Priority support (24/7)"
    ]
  },
  {
    name: "Enterprise",
    price: "KES 4,000",
    credits: 3000,
    pricePerCredit: "KES 1.33",
    description: "For large-scale operations",
    icon: Crown,
    features: [
      "3,000 AI credits",
      "Dedicated AI resources",
      "Advanced analytics dashboard",
      "Custom recommendations",
      "Team collaboration tools",
      "API access",
      "Dedicated account manager",
      "Premium support (24/7)",
      "Custom integrations"
    ]
  }
];

const creditUsage = [
  { feature: "Crop Image Analysis", cost: "5 credits" },
  { feature: "Generate Recommendations", cost: "10 credits" },
  { feature: "Detailed Weather Report", cost: "3 credits" },
  { feature: "Pest Detection Analysis", cost: "5 credits" }
];

const Pricing = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground mb-4">
              Choose the perfect plan for your farming needs
            </p>
            <p className="text-muted-foreground">
              All prices in Kenya Shillings (KES). No hidden fees. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
            {pricingTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={tier.name} 
                  className={`relative overflow-hidden ${
                    tier.popular 
                      ? 'border-primary shadow-lg scale-105' 
                      : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4">
                      <div className="text-4xl font-bold">{tier.price}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {tier.credits.toLocaleString()} credits
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tier.pricePerCredit} per credit
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={tier.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link to="/auth">
                        {tier.name === "Starter" ? "Get Started Free" : "Choose Plan"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Credit Usage Guide */}
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>How Credits Work</CardTitle>
                <CardDescription>
                  Understand how your credits are used for different features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditUsage.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <span className="font-medium">{item.feature}</span>
                      <Badge variant="secondary">{item.cost}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> With the Professional plan (1,000 credits), you can perform approximately 200 crop analyses or generate 100 recommendation reports, or any combination of features.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens when I run out of credits?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You can easily purchase more credits at any time. Simply go to your dashboard and choose a credit package that suits your needs. You'll receive a notification when your credits are running low.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do credits expire?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No! Your credits never expire. Use them at your own pace, whenever you need AI-powered insights for your farm.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change plans?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can purchase additional credits anytime. If you need a custom solution for your organization, contact our support team for enterprise options.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept M-Pesa, credit/debit cards, and bank transfers. All payments are processed securely through our payment partners.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! Every new user receives 100 free credits to explore all features of ClimaSmart. No credit card required to start.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer discounts for bulk purchases?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! The more credits you purchase, the lower the cost per credit. Contact us at kasainielekireu@gmail.com for custom enterprise packages and volume discounts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of farmers using ClimaSmart to improve their yields and adapt to climate change
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/auth">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:kasainielekireu@gmail.com">Contact Sales</a>
                </Button>
              </div>
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
                <li><Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
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

export default Pricing;

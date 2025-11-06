import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Leaf, Send } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    window.location.href = "mailto:kasainielekireu@gmail.com";
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Get in touch with us directly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a 
                          href="mailto:kasainielekireu@gmail.com"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          kasainielekireu@gmail.com
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          Send us an email anytime
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <a 
                          href="tel:+254795872528"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          0795872528
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mon-Fri from 8am to 5pm EAT
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Location</h3>
                        <p className="text-muted-foreground">
                          Kenya
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Serving farmers across East Africa
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Creator</CardTitle>
                  <CardDescription>Meet the founder</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-xl">
                      KL
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Kasainie Lekireu</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        Founder & Creator of ClimaSmart
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Passionate about using technology to help farmers adapt to climate change and improve agricultural productivity across Africa.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href="mailto:kasainielekireu@gmail.com">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href="tel:+254795872528">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Hours</CardTitle>
                  <CardDescription>When you can reach us</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    * All times are in East Africa Time (EAT)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="What is this about?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-muted-foreground">Email inquiries:</span>
                      <span className="font-medium">24-48 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-muted-foreground">Phone calls:</span>
                      <span className="font-medium">Same day during business hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-muted-foreground">Critical issues:</span>
                      <span className="font-medium">Immediate response</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Answers</h2>
            <p className="text-muted-foreground">
              Before reaching out, check if your question is answered here
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How quickly will I get a response?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We typically respond to emails within 24-48 hours during business days. Phone calls are answered during business hours, and critical issues receive immediate attention.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's the best way to reach you?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  For general inquiries, email is best. For urgent matters or technical support, phone calls during business hours are preferred. You can also use the contact form on this page.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer technical support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We provide comprehensive technical support for all ClimaSmart users. Contact us via phone or email, and our team will assist you with any technical issues.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I schedule a demo?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! Contact us to schedule a personalized demo of ClimaSmart. We'll walk you through all features and answer your questions.
                </p>
              </CardContent>
            </Card>
          </div>
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
              <h3 className="font-semibold text-foreground mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="tel:+254795872528" className="hover:text-primary transition-colors">Phone: 0795872528</a></li>
                <li><a href="mailto:kasainielekireu@gmail.com" className="hover:text-primary transition-colors">Email: kasainielekireu@gmail.com</a></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Form</Link></li>
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

export default Contact;

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Target, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ConsultiesHub</span>
            </Link>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About ConsultiesHub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting local businesses with customers, fostering community growth and economic development
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-card">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To empower local businesses by providing them with a powerful platform to reach their community,
                while helping customers discover trusted services and products in their area.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <Award className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become the leading local business directory platform, fostering thriving local economies
                and creating meaningful connections between businesses and communities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card">
              <CardHeader>
                <Building2 className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Business Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive listings of local businesses across various categories, making it easy
                  for customers to find what they need.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Community Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Building bridges between businesses and customers through reviews, feedback,
                  and direct service bookings.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <Target className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Marketing Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Professional photography, videography, and advertising services to help
                  businesses showcase their offerings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="shadow-card text-center">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Join ConsultiesHub Today</CardTitle>
            <p className="text-muted-foreground text-lg mb-6">
              Whether you're a business owner or a customer, we're here to help you connect and grow
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/">Learn More</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

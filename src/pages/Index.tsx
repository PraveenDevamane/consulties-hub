import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Search, Star, Camera, Heart, TrendingUp } from 'lucide-react';

export default function Index() {
  const categories = [
    { name: 'Restaurants', icon: '🍽️' },
    { name: 'Hotels', icon: '🏨' },
    { name: 'Footwear', icon: '👟' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👗' },
    { name: 'Healthcare', icon: '🏥' },
  ];

  const services = [
    {
      title: 'Advertisement Shoots',
      description: 'Professional photography and videography for your business',
      icon: Camera,
    },
    {
      title: 'Marriage Shoots',
      description: 'Capture your special moments with our expert team',
      icon: Heart,
    },
    {
      title: 'Advertisement Publishing',
      description: 'Promote your business across our platform',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ConsultiesHub</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link to="/about">About</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 text-foreground">
          Discover Local Businesses
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your trusted directory for finding the best local services, restaurants, and businesses in your area
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/user/categories">Browse Categories</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-card transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl mb-2">{category.icon}</div>
                <p className="font-semibold">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose ConsultiesHub</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <Search className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Easy Discovery</CardTitle>
              <CardDescription>
                Find local businesses quickly with our intuitive search and category system
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <Star className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Trusted Reviews</CardTitle>
              <CardDescription>
                Read authentic feedback from real customers to make informed decisions
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <Building2 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Business Growth</CardTitle>
              <CardDescription>
                Help local businesses thrive by connecting them with customers
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Agency Services */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="shadow-card">
              <CardHeader>
                <service.icon className="h-12 w-12 text-accent mb-4" />
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/services">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="shadow-card max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg mb-6">
              Join ConsultiesHub today and connect with your local community
            </CardDescription>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth">List Your Business</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-sm border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 ConsultiesHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

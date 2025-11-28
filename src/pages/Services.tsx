import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Camera, Heart, TrendingUp, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const services = [
  {
    id: 'advertisement-shoots',
    title: 'Advertisement Shoots',
    description: 'Professional photography and videography services for your business advertisements',
    icon: Camera,
    features: [
      'Professional photography',
      'Video production',
      'Product photography',
      'Location shoots',
    ],
  },
  {
    id: 'marriage-shoots',
    title: 'Marriage Shoots',
    description: 'Capture your special moments with our expert wedding photography team',
    icon: Heart,
    features: [
      'Pre-wedding shoots',
      'Wedding day coverage',
      'Candid photography',
      'Video highlights',
    ],
  },
  {
    id: 'advertisement-publishing',
    title: 'Advertisement Publishing',
    description: 'Promote your business across our platform and reach thousands of customers',
    icon: TrendingUp,
    features: [
      'Featured listings',
      'Banner advertisements',
      'Category sponsorship',
      'Social media promotion',
    ],
  },
];

export default function Services() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/auth');
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const details = formData.get('details') as string;

    const { error } = await supabase.from('service_bookings').insert({
      user_id: user.id,
      service_type: selectedService!,
      details,
    });

    if (error) {
      toast.error('Failed to book service. Please try again.');
      console.error('Booking error:', error);
    } else {
      toast.success('Service booked successfully! We will contact you soon.');
      setSelectedService(null);
      (e.target as HTMLFormElement).reset();
    }

    setLoading(false);
  };

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
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {user ? (
                <Button variant="default" onClick={() => navigate('/user/dashboard')}>
                  Dashboard
                </Button>
              ) : (
                <Button variant="default" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional services to help your business grow and shine
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <Card key={service.id} className="shadow-card hover:shadow-lg transition-all">
              <CardHeader>
                <service.icon className="h-12 w-12 text-accent mb-4" />
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => setSelectedService(service.id)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Form */}
        {selectedService && (
          <Card className="max-w-2xl mx-auto shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">Book Service</CardTitle>
              <CardDescription>
                Fill in the details below to book{' '}
                {services.find((s) => s.id === selectedService)?.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details</Label>
                  <Textarea
                    id="details"
                    name="details"
                    placeholder="Tell us about your requirements, preferred dates, location, etc."
                    required
                    rows={6}
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedService(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Booking...' : 'Submit Booking'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

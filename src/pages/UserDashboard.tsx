import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Star, Calendar, LogOut } from 'lucide-react';

interface Business {
  business_id: string;
  name: string;
  description: string;
  rating: number;
  image_url: string | null;
  categories: { name: string };
}

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const categoriesNav = ['RESTAURANT', 'HOTELS', 'NEWS', 'FOOTWEAR', 'ETC'];
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchBusinesses();
  }, [user, navigate]);

  // fetch businesses based on search query (debounced)
  useEffect(() => {
    let timer: any = null;
    const doSearch = async () => {
      setSearchLoading(true);
      try {
        const q = searchQuery?.trim();
        let query = supabase.from('businesses').select('*, categories(name)').order('created_at', { ascending: false }).limit(12);
        if (q && q.length > 0) {
          // use ilike for case-insensitive partial match
          query = supabase.from('businesses').select('*, categories(name)').ilike('name', `%${q}%`).order('created_at', { ascending: false }).limit(50);
        }

        const { data, error } = await query;
        if (error) {
          console.error('Search error:', error);
        } else {
          setBusinesses(data || []);
        }
      } catch (err) {
        console.error('Unexpected search error:', err);
      } finally {
        setSearchLoading(false);
      }
    };

    // debounce by 350ms
    timer = setTimeout(() => {
      doSearch();
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching businesses:', error);
    } else {
      setBusinesses(data || []);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
              <span className="text-muted-foreground">Welcome, {user?.email}</span>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search / Voice input */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search — find anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                if (!SpeechRecognition) {
                  toast('Voice search not supported in this browser');
                  return;
                }
                const rec = new SpeechRecognition();
                rec.lang = 'en-US';
                rec.onresult = (ev: any) => {
                  const transcript = ev.results[0][0].transcript;
                  setSearchQuery(transcript);
                };
                rec.onerror = () => toast('Voice recognition failed');
                rec.start();
              }}
            >
              🎤
            </Button>
          </div>

          {/* Category horizontal nav */}
          <div className="mt-4 overflow-x-auto py-2">
            <div className="flex gap-3">
              {categoriesNav.map((c) => (
                <Button key={c} variant="ghost" className="rounded-full px-4 py-2 font-semibold" onClick={() => navigate('/user/categories')}>
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-card transition-all cursor-pointer" onClick={() => navigate('/user/categories')}>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Browse Businesses</CardTitle>
              <CardDescription>Explore local businesses</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-card transition-all cursor-pointer" onClick={() => navigate('/user/bookings')}>
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View your service bookings</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-card transition-all cursor-pointer" onClick={() => navigate('/user/feedback')}>
            <CardHeader>
              <Star className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>Manage your feedback</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-card transition-all cursor-pointer" onClick={() => navigate('/services')}>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Book Services</CardTitle>
              <CardDescription>Agency services</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Featured Businesses */}
        <h2 className="text-3xl font-bold mb-6">Featured Businesses</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {loading || searchLoading ? (
            <p className="text-muted-foreground">Loading businesses...</p>
          ) : businesses.length === 0 ? (
            <p className="text-muted-foreground">No businesses found</p>
          ) : (
            businesses.map((business) => (
              <Card key={business.business_id} className="hover:shadow-card transition-all overflow-hidden">
                <div className="h-48 bg-muted">
                  {business.image_url ? (
                    <img
                      src={business.image_url}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{business.name}</CardTitle>
                  <CardDescription>{business.categories?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{business.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {business.description}
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/business/${business.business_id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

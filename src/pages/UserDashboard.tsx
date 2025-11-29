import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, MapPin, Star, Calendar, Mic } from 'lucide-react';
import UserMenu from '@/components/UserMenu';

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
    <div className="min-h-screen bg-gradient-to-br from-[#C9F9D6] to-[#9198E5]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                {user?.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || 'Profile'} />
                ) : (
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                )}
              </Avatar>
              <Link to="/user/dashboard" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-serif">ConsultiesHub</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm font-serif">WELCOME</span>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search / Voice input */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex items-center gap-2">
            <Input
              className="bg-white rounded-full border-2"
              placeholder="🔍 Search — find anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white"
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
              <Mic className="h-5 w-5" />
            </Button>
          </div>

          {/* Category horizontal nav */}
          <div className="mt-4 overflow-x-auto py-2">
            <div className="flex gap-3">
              {categoriesNav.map((c) => (
                <Button 
                  key={c} 
                  variant="outline" 
                  className="rounded-full px-6 py-2 font-serif bg-white border-2 hover:bg-primary/10 whitespace-nowrap" 
                  onClick={() => navigate('/user/categories')}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border-2" onClick={() => navigate('/user/categories')}>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif">Browse Businesses</CardTitle>
              <CardDescription>Explore local businesses</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border-2" onClick={() => navigate('/user/bookings')}>
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif">My Bookings</CardTitle>
              <CardDescription>View your service bookings</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border-2" onClick={() => navigate('/user/feedback')}>
            <CardHeader>
              <Star className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif">My Reviews</CardTitle>
              <CardDescription>Manage your feedback</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border-2" onClick={() => navigate('/services')}>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif">Book Services</CardTitle>
              <CardDescription>Agency services</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Top News Feed / Featured Businesses */}
        <h2 className="text-3xl font-bold font-serif mb-6">TOP NEWS FEED</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {loading || searchLoading ? (
            <p className="text-muted-foreground">Loading businesses...</p>
          ) : businesses.length === 0 ? (
            <p className="text-muted-foreground">No businesses found</p>
          ) : (
            businesses.map((business) => (
              <Card key={business.business_id} className="hover:shadow-lg transition-all overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl">
                <div className="h-48 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
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
                  <CardTitle className="font-serif">{business.name}</CardTitle>
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
                  <Button variant="outline" className="w-full rounded-full bg-white border-2" asChild>
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

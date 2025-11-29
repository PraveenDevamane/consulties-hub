import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BusinessCard from '@/components/BusinessCard';
import UserMenu from '@/components/UserMenu';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft } from 'lucide-react';

interface Category {
  category_id: string;
  name: string;
}

interface Business {
  business_id: string;
  name: string;
  description: string;
  rating: number;
  image_url: string | null;
  lat?: number | null;
  lng?: number | null;
  categories: { name: string };
}

export default function Categories() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [sortedBusinesses, setSortedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'near' | 'rating' | 'nonbusy'>('rating');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBusinessesByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    // apply client-side sorting whenever businesses or sortOption changes
    applySorting(businesses, sortOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businesses, sortOption]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const fetchBusinessesByCategory = async (categoryId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('businesses')
      .select('*, categories(name)')
      .eq('category_id', categoryId)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching businesses:', error);
    } else {
      setBusinesses(data || []);
    }
    setLoading(false);
  };

  const haversineDistance = (lat1?: number | null, lon1?: number | null, lat2?: number | null, lon2?: number | null) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Number.MAX_VALUE;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const applySorting = (list: Business[], option: typeof sortOption) => {
    if (!list) return setSortedBusinesses([]);

    if (option === 'rating') {
      setSortedBusinesses([...list].sort((a, b) => b.rating - a.rating));
    } else if (option === 'nonbusy') {
      // no real traffic data — keep order but could be extended
      setSortedBusinesses([...list]);
    } else if (option === 'near') {
      if (!navigator.geolocation) {
        setSortedBusinesses([...list]);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const sorted = [...list].sort((a, b) => {
            const da = haversineDistance(latitude, longitude, a.lat, a.lng);
            const db = haversineDistance(latitude, longitude, b.lat, b.lng);
            return da - db;
          });
          setSortedBusinesses(sorted);
        },
        () => setSortedBusinesses([...list]),
      );
    }
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
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold font-serif mb-8">Browse by Category</h1>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {categories.map((category) => (
            <Card
              key={category.category_id}
              className={`cursor-pointer hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm rounded-3xl border-2 ${
                selectedCategory === category.category_id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(category.category_id)}
            >
              <CardContent className="pt-6 text-center">
                <p className="font-semibold font-serif">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Businesses List */}
        {selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif">
                {categories.find((c) => c.category_id === selectedCategory)?.name}
              </h2>
              <div className="w-56">
                <Select value={sortOption} onValueChange={(v) => setSortOption(v as any)}>
                  <SelectTrigger className="bg-white rounded-full border-2">
                    <SelectValue placeholder={sortOption === 'near' ? 'Near to you' : sortOption === 'rating' ? 'Ratings' : 'Non-Busy'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="near">Near to You</SelectItem>
                    <SelectItem value="rating">Ratings</SelectItem>
                    <SelectItem value="nonbusy">Non-Busy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {loading ? (
              <p className="text-muted-foreground">Loading businesses...</p>
            ) : businesses.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm rounded-3xl">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No businesses found in this category yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                  {sortedBusinesses.map((business) => (
                    <div key={business.business_id}>
                      <BusinessCard business={business} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

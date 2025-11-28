import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
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
  categories: { name: string };
}

export default function Categories() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBusinessesByCategory(selectedCategory);
    }
  }, [selectedCategory]);

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
        <h1 className="text-4xl font-bold mb-8">Browse by Category</h1>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {categories.map((category) => (
            <Card
              key={category.category_id}
              className={`cursor-pointer hover:shadow-card transition-all ${
                selectedCategory === category.category_id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(category.category_id)}
            >
              <CardContent className="pt-6 text-center">
                <p className="font-semibold">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Businesses List */}
        {selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {categories.find((c) => c.category_id === selectedCategory)?.name} Businesses
            </h2>
            {loading ? (
              <p className="text-muted-foreground">Loading businesses...</p>
            ) : businesses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No businesses found in this category yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {businesses.map((business) => (
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
                      <CardDescription>Rating: {business.rating.toFixed(1)} ⭐</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {business.description}
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/business/${business.business_id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

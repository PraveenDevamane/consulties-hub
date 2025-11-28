import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Plus, BarChart3, Image as ImageIcon, LogOut } from 'lucide-react';

interface Business {
  business_id: string;
  name: string;
  description: string;
  rating: number;
}

export default function PublisherDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchMyBusinesses();
  }, [user, navigate]);

  const fetchMyBusinesses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('publisher_id', user.id)
      .order('created_at', { ascending: false });

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
              <span className="text-muted-foreground">Publisher Portal</span>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-card transition-all cursor-pointer" onClick={() => navigate('/publisher/add-business')}>
            <CardHeader>
              <Plus className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Add Business</CardTitle>
              <CardDescription>Create new listing</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-card transition-all cursor-pointer" onClick={() => navigate('/publisher/businesses')}>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Businesses</CardTitle>
              <CardDescription>Manage listings</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-card transition-all cursor-pointer" onClick={() => navigate('/publisher/advertisements')}>
            <CardHeader>
              <ImageIcon className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Advertisements</CardTitle>
              <CardDescription>Publish ads</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-card transition-all cursor-pointer" onClick={() => navigate('/publisher/feedback')}>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Feedback</CardTitle>
              <CardDescription>View reviews</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Businesses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">My Businesses</h2>
            <Button onClick={() => navigate('/publisher/add-business')}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Business
            </Button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading your businesses...</p>
          ) : businesses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No businesses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first business listing
                </p>
                <Button onClick={() => navigate('/publisher/add-business')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Business
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Card key={business.business_id} className="hover:shadow-card transition-all">
                  <CardHeader>
                    <CardTitle>{business.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {business.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        Rating: <span className="font-semibold">{business.rating.toFixed(1)}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/publisher/edit-business/${business.business_id}`}>Edit</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

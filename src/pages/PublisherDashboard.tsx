import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Plus, BarChart3, Image as ImageIcon, LogOut, Menu } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    <div className="min-h-screen bg-gradient-to-br from-[#C9F9D6] to-[#9198E5]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Profile Avatar on the left */}
              <Avatar>
                {user?.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || 'Profile'} />
                ) : (
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                )}
              </Avatar>
              <Link to="/publisher/dashboard" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-serif">ConsultiesHub</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm font-serif">PUBLISHER PORTAL</span>
              {/* Hamburger menu on the right (opens PublisherMenu) */}
              <div className="sm:ml-2">
                {/* We'll render the dialog trigger inline so it shows the Menu icon */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">Publisher Menu</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                      <Button className="w-full justify-start" variant="outline" asChild>
                        <Link to="/user/dashboard">Switch to User Mode</Link>
                      </Button>
                      <Button className="w-full justify-start" variant="outline" asChild>
                        <Link to="/services">Kumar Consulties (Agency Services)</Link>
                      </Button>
                      <Button className="w-full justify-start" variant="outline" asChild>
                        <Link to="/publisher/settings">Settings</Link>
                      </Button>
                      <Button className="w-full justify-start" variant="outline" asChild>
                        <Link to="/publisher/upgrade">Upgrade to Premium</Link>
                      </Button>
                      <div className="border-t pt-3 mt-3">
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleSignOut}>
                          <LogOut className="h-5 w-5 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border-2" onClick={() => navigate('/publisher/add-business')}>
                <CardHeader>
                  <Plus className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="font-serif">Add Your Business</CardTitle>
                  <CardDescription>Create new listing</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border-2" onClick={() => navigate('/publisher/businesses')}>
                <CardHeader>
                  <Building2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="font-serif">My Businesses</CardTitle>
                  <CardDescription>Manage listings</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border-2" onClick={() => navigate('/publisher/advertisements')}>
                <CardHeader>
                  <ImageIcon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="font-serif">Publish Advertisement</CardTitle>
                  <CardDescription>Create ads for user feed</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border-2" onClick={() => navigate('/publisher/feedback')}>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="font-serif">Feedback</CardTitle>
                  <CardDescription>View reviews</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Businesses */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold font-serif">My Businesses</h2>
                <Button className="bg-white text-black border-2 rounded-full" onClick={() => navigate('/publisher/add-business')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Business
                </Button>
              </div>

              {loading ? (
                <p className="text-muted-foreground">Loading your businesses...</p>
              ) : businesses.length === 0 ? (
                <Card className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-3xl">
                  <CardContent>
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold font-serif mb-2">No businesses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first business listing
                    </p>
                    <Button className="bg-white text-black border-2 rounded-full" onClick={() => navigate('/publisher/add-business')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Business
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <Card key={business.business_id} className="hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm rounded-3xl">
                      <CardHeader>
                        <CardTitle className="font-serif">{business.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {business.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            Rating: <span className="font-semibold">{business.rating.toFixed(1)}</span>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-full" asChild>
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

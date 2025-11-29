import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Users, Store } from 'lucide-react';
import { useEffect } from 'react';

export default function SelectRole() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C9F9D6] to-[#9198E5] flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2">
        <CardHeader className="text-center py-8">
          <div className="flex justify-center mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
              <AvatarFallback className="text-2xl font-serif">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-4xl font-serif mb-2">Welcome, {user.user_metadata?.name || user.email}!</CardTitle>
          <CardDescription className="text-lg">How would you like to use ConsultiesHub today?</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Mode */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm rounded-3xl border-2 hover:border-primary"
              onClick={() => navigate('/user/dashboard')}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-serif">Continue as User</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Search and discover local businesses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>View ratings and reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Book services and appointments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Leave feedback for businesses</span>
                  </li>
                </ul>
                <Button className="w-full mt-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                  Enter User Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Publisher Mode */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm rounded-3xl border-2 hover:border-primary"
              onClick={() => navigate('/publisher/dashboard')}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Store className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-serif">Continue as Publisher</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Publish your business listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Manage multiple businesses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Create advertisements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>View customer feedback</span>
                  </li>
                </ul>
                <Button className="w-full mt-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600">
                  Enter Publisher Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            You can switch between modes anytime from your dashboard menu
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, ArrowLeft, User, Bell, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function PublisherSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C9F9D6] to-[#9198E5]">
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
              <Link to="/publisher/dashboard" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-serif">ConsultiesHub</span>
              </Link>
            </div>
            <Button variant="ghost" onClick={() => navigate('/publisher/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold font-serif mb-8">Settings</h1>

        <div className="grid gap-6 max-w-2xl">
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border-2">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <User className="h-6 w-6" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your publisher profile and business information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Email: {user?.email}</p>
              <Button variant="outline" className="rounded-full">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border-2">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="rounded-full">Manage Notifications</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border-2">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Update password and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="rounded-full">Security Settings</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border-2">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Manage your payment methods and subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="rounded-full" onClick={() => navigate('/publisher/upgrade')}>
                View Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

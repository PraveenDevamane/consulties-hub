import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Menu, Building2, Settings, User, LogOut, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Menu</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Button className="w-full justify-start" variant="outline" asChild>
            <Link to="/publisher/dashboard">
              <Building2 className="h-5 w-5 mr-3" />
              Switch to Publisher Mode
            </Link>
          </Button>

          <div className="border-t pt-3"></div>
          
          <Button className="w-full justify-start" variant="outline" asChild>
            <Link to="/services">
              <Building2 className="h-5 w-5 mr-3" />
              Kumar Consulties (Agency Services)
            </Link>
          </Button>
          
          <Button className="w-full justify-start" variant="outline" asChild>
            <Link to="/user/bookings">
              <Star className="h-5 w-5 mr-3" />
              My Bookings
            </Link>
          </Button>

          <Button className="w-full justify-start" variant="outline" asChild>
            <Link to="/user/feedback">
              <Star className="h-5 w-5 mr-3" />
              My Reviews
            </Link>
          </Button>

          <div className="border-t pt-3 mt-3">
            <p className="text-sm font-semibold mb-2 px-2">Settings</p>
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link to="/user/profile">
                <User className="h-5 w-5 mr-3" />
                Profile
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link to="/user/report">
                <Settings className="h-5 w-5 mr-3" />
                Report Issue
              </Link>
            </Button>
            <Button 
              className="w-full justify-start text-destructive hover:text-destructive" 
              variant="ghost"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

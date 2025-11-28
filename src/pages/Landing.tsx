import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, User, Users } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C9F9D6] to-[#9198E5] flex items-center justify-center p-6">
      <Card className="max-w-lg w-full bg-white/80 backdrop-blur-sm rounded-2xl">
        <CardHeader className="text-center py-8">
          <div className="flex justify-center mb-4">
            <Avatar>
              <AvatarFallback>CH</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-4xl font-serif">WELCOME</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground mb-6">Choose how you'd like to enter ConsultiesHub</p>
          <div className="grid gap-4">
            <Button size="lg" className="font-serif bg-white text-black" onClick={() => navigate('/auth?role=user')}>
              <Users className="h-5 w-5 mr-2 inline" /> LOGIN AS USER
            </Button>
            <Button size="lg" className="font-serif bg-white text-black" onClick={() => navigate('/auth?role=publisher')}>
              <User className="h-5 w-5 mr-2 inline" /> LOGIN AS PUBLISHER
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/auth" className="text-sm">Or use email / password</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

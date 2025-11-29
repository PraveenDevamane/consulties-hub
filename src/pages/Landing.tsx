import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C9F9D6] to-[#9198E5] flex items-center justify-center p-6">
      <Card className="max-w-lg w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2">
        <CardHeader className="text-center py-8">
          <div className="flex justify-center mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/logo.png" alt="ConsultiesHub" />
              <AvatarFallback className="text-2xl font-serif">CH</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-5xl font-serif mb-2">WELCOME</CardTitle>
          <p className="text-muted-foreground">to ConsultiesHub</p>
        </CardHeader>
        <CardContent className="py-6 space-y-6">
          <p className="text-center text-muted-foreground mb-6">Your Local Business Directory</p>
          <div className="grid gap-4">
            <Button 
              size="lg" 
              className="font-serif text-lg bg-white text-black hover:bg-gray-50 border-2 rounded-full py-6" 
              onClick={() => navigate('/auth')}
            >
              <Building2 className="h-6 w-6 mr-3 inline" /> GET STARTED
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/auth" className="underline">Sign in</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

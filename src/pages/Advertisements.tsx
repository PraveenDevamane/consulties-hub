import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Advertisements() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from('advertisements').insert({
      publisher_id: user.id,
      title,
      image_url: imageUrl || null,
      target,
    });

    if (error) {
      toast.error('Failed to publish advertisement');
      console.error(error);
    } else {
      toast.success('Advertisement published');
      navigate('/publisher/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ConsultiesHub</span>
            </Link>
            <Button variant="ghost" onClick={() => navigate('/publisher/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl">Publish Advertisement</CardTitle>
            <CardDescription>Create an ad that will appear in users' feeds</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <select id="target" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded border px-3 py-2">
                  <option value="all">All</option>
                  <option value="restaurants">Restaurants</option>
                  <option value="hotels">Hotels</option>
                  <option value="footwear">Footwear</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/publisher/dashboard')}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Publishing...' : 'Publish'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

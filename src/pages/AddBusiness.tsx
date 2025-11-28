import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  category_id: string;
  name: string;
}

export default function AddBusiness() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchCategories();
  }, [user, navigate]);

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('image_url') as string;
    const lat = formData.get('lat') as string;
    const lng = formData.get('lng') as string;

    const { error } = await supabase.from('businesses').insert({
      publisher_id: user.id,
      name,
      category_id: selectedCategory,
      description,
      image_url: imageUrl || null,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
    });

    if (error) {
      toast.error('Failed to add business. Please try again.');
      console.error('Error adding business:', error);
    } else {
      toast.success('Business added successfully!');
      navigate('/publisher/dashboard');
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
            <Button variant="ghost" onClick={() => navigate('/publisher/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl">Add New Business</CardTitle>
            <CardDescription>Create a new business listing on ConsultiesHub</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.category_id} value={category.category_id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your business"
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    name="lat"
                    type="number"
                    step="any"
                    placeholder="40.7128"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    name="lng"
                    type="number"
                    step="any"
                    placeholder="-74.0060"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/publisher/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Business'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowLeft } from 'lucide-react';

interface FeedbackRow {
  feedback_id: string;
  business_id: string;
  comment?: string | null;
  rating?: number | null;
  user_id: string;
  created_at: string;
  businesses?: { name: string } | null;
}

export default function PublisherFeedback() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      // First get businesses for this publisher
      const { data: businesses, error: bizErr } = await supabase
        .from('businesses')
        .select('business_id')
        .eq('publisher_id', user?.id);

      if (bizErr) {
        console.error('Error fetching businesses for publisher:', bizErr);
        setFeedback([]);
        setLoading(false);
        return;
      }

      const businessIds = (businesses || []).map((b: any) => b.business_id);

      if (businessIds.length === 0) {
        setFeedback([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('feedback')
        .select('*, businesses(name)')
        .in('business_id', businessIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        setFeedback([]);
      } else {
        setFeedback(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching feedback:', err);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold mb-6">Ratings & Feedback</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading ratings...</p>
        ) : feedback.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No ratings yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {feedback.map((f) => (
              <Card key={f.feedback_id} className="shadow-card">
                <CardHeader>
                  <CardTitle>{f.businesses?.[0]?.name || 'Business'}</CardTitle>
                  <CardDescription className="text-sm">{f.rating ? `${f.rating} / 5` : 'No rating'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{f.comment || '-'}</p>
                  <div className="text-xs text-muted-foreground">Posted on {new Date(f.created_at).toLocaleString()}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Star } from 'lucide-react';

interface Business {
  business_id: string;
  name: string;
  description?: string;
  rating: number;
  image_url?: string | null;
  lat?: number | null;
  lng?: number | null;
}

export default function BusinessCard({ business }: { business: Business }) {
  const stars = Array.from({ length: 5 }).map((_, i) => i + 1);

  return (
    <Card className="hover:shadow-card transition-all overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        {business.image_url ? (
          // show image if present
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img src={business.image_url} alt={`Image of ${business.name}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <div className="w-20 h-20 rounded-md bg-white/20 mb-2" />
            </div>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="truncate">{business.name}</CardTitle>
        <CardDescription className="text-sm">{business.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {stars.map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${business.rating >= s ? 'text-yellow-400' : 'text-muted-foreground'}`}
              />
            ))}
            <span className="text-sm ml-2">{business.rating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-muted-foreground">Non-busy: Low</div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">View Details</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Feedback</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Feedback</DialogTitle>
                <DialogDescription>Share your experience for {business.name}</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="block text-sm">Rating</label>
                  <div className="flex items-center gap-1">
                    {stars.map((s) => (
                      <Star key={s} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm">Comment</label>
                  <textarea rows={4} className="w-full rounded border p-2" />
                </div>
                <DialogFooter className="pt-2">
                  <Button type="button">Submit</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PublisherMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-10 w-10">
          {/* Trigger rendered by parent (we keep as child for flexibility) */}
          <span className="sr-only">Open menu</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kumar Consulties</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button className="w-full" asChild>
            <Link to="/services">Kumar Consulties (Agency Services)</Link>
          </Button>
          <Button className="w-full" asChild>
            <Link to="/publisher/settings">Settings</Link>
          </Button>
          <Button className="w-full" asChild>
            <Link to="/publisher/upgrade">Upgrade to Premium</Link>
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function RoleDebug() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Role check error:', error);
        setRole(null);
      } else {
        setRole(data?.role || null);
      }
      setLoading(false);
    };

    checkRole();
  }, [user]);

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Debug: Not Logged In</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to see role information</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">Go to Login</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Debug: User Role Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">User ID:</p>
          <p className="font-mono text-xs break-all">{user.id}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email:</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Role:</p>
          {loading ? (
            <p>Loading...</p>
          ) : role ? (
            <p className="font-semibold text-lg capitalize">{role}</p>
          ) : (
            <p className="text-yellow-600">⚠️ No role assigned</p>
          )}
        </div>
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-semibold">Quick Navigation:</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate('/user/dashboard')}>User Dashboard</Button>
            <Button size="sm" onClick={() => navigate('/publisher/dashboard')}>Publisher Dashboard</Button>
          </div>
        </div>
        {!role && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <p className="text-sm font-semibold text-yellow-800 mb-2">No Role Found!</p>
            <p className="text-sm text-yellow-700">
              You need to assign a role in the database. Run the SQL script at:
              <code className="block mt-2 p-2 bg-yellow-100 rounded text-xs">
                scripts/assign-publisher-role.sql
              </code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

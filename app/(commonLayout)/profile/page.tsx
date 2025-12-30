'use client';

import { useEffect, useState } from 'react';
import { getUserProfile } from '@/service/profile';
import type { UserProfile } from '@/service/profile';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import ProfileClient from '@/component/profile/ProfileClient';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        
        if (response.success && response.data) {
          setProfile(response.data.profile);
          toast.success('Profile loaded successfully');
        } else {
          setError(response.message || 'Failed to load profile');
          toast.error(response.message || 'Failed to load profile');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-red-500/50 bg-red-500/10 mb-6">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            {error || 'Failed to load profile'}
          </AlertDescription>
        </Alert>
        <Link href="/login">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  return <ProfileClient initialProfile={profile} error={error ?? undefined} />;
}

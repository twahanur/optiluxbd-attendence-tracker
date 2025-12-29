'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Shield
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Mock auth check - in real app, check if user is admin
  const [isAdmin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAdminAccess = async () => {
      // In real app, validate JWT token and check admin role
      setTimeout(() => {
        setLoading(false);
        // If not admin, redirect to login or unauthorized page
        if (!isAdmin) {
          router.push('/login');
        }
      }, 100);
    };

    checkAdminAccess();
  }, [isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access the admin panel.</p>
          <Button onClick={() => router.push('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      {/* <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <Link href="/admin" className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">Admin Panel</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="hidden sm:flex text-green-700 bg-green-50 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Administrator
            </Badge>
            
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to App
            </Button>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header> */}

      <div className="flex">
        {/* Sidebar Navigation */}
        {/* <nav className={`w-64 bg-white shadow-sm min-h-screen ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav> */}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
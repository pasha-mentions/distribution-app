import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Music, FileText, BarChart3 } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import ReleasesTab from "@/components/admin/releases-tab";

export default function Admin() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Check if user has admin role
  const isAdmin = (user as any)?.role === "ADMIN";
  const [activeTab, setActiveTab] = useState("releases");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Access Denied</h3>
                  <p className="text-muted-foreground">
                    You need administrator privileges to access this page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-destructive-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Admin Panel</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage catalog, releases, and reports
                </p>
              </div>
            </div>
            <Badge variant="destructive" data-testid="badge-admin-only">
              Admin Only
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="catalog" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Catalog</span>
            </TabsTrigger>
            <TabsTrigger value="releases" className="flex items-center space-x-2">
              <Music className="w-4 h-4" />
              <span>Releases</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="catalog" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Catalog Management</h3>
                  <p className="text-muted-foreground">
                    Manage artist profiles, labels, and catalog information
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="releases" className="space-y-6">
            <ReleasesTab />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Reports & Analytics</h3>
                  <p className="text-muted-foreground">
                    View detailed reports and analytics data
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

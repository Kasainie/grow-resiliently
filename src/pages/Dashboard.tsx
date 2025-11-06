import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FarmRegistration } from "@/components/farm/FarmRegistration";
import { ImageUpload } from "@/components/farm/ImageUpload";
import { AlertsPanel } from "@/components/alerts/AlertsPanel";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Sprout, LogOut, Plus, Loader2, Sparkles
} from "lucide-react";

interface Farm {
  id: string;
  name: string;
  area_ha: number;
  latitude: number;
  longitude: number;
  has_irrigation: boolean;
  soil_type: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [generatingRecs, setGeneratingRecs] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFarms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedFarm) {
      fetchRecommendations(selectedFarm.id);
    }
  }, [selectedFarm]);

  const fetchFarms = async () => {
    try {
      const { data, error } = await supabase
        .from("farms")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setFarms(data || []);
      if (data && data.length > 0) {
        setSelectedFarm(data[0]);
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
      toast({
        title: "Error loading farms",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (farmId: string) => {
    try {
      const { data, error } = await supabase
        .from("recommendations")
        .select("*")
        .eq("farm_id", farmId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const generateRecommendations = async () => {
    if (!selectedFarm) return;

    setGeneratingRecs(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-recommendations", {
        body: { farmId: selectedFarm.id },
      });

      if (error) throw error;

      toast({
        title: "Recommendations generated!",
        description: "Check your action plan below.",
      });

      fetchRecommendations(selectedFarm.id);
    } catch (error) {
      toast({
        title: "Failed to generate recommendations",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setGeneratingRecs(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (farms.length === 0 && !showFarmForm) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CSA.AI</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to CSA.AI!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Let's get started by registering your first farm. This helps us provide 
              personalized climate-smart recommendations for your location and crops.
            </p>
            <Button
              size="lg"
              onClick={() => setShowFarmForm(true)}
              className="bg-primary hover:bg-primary-hover"
            >
              <Plus className="h-5 w-5 mr-2" />
              Register Your Farm
            </Button>
          </div>

          {showFarmForm && (
            <FarmRegistration
              onSuccess={() => {
                fetchFarms();
                setShowFarmForm(false);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {selectedFarm?.name || "My Farm"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedFarm?.area_ha} hectares • {selectedFarm?.soil_type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFarmForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Farm
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {showFarmForm && (
          <div className="mb-6">
            <FarmRegistration
              onSuccess={() => {
                fetchFarms();
                setShowFarmForm(false);
              }}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts Panel */}
            <AlertsPanel farmId={selectedFarm?.id} />

            {/* Recommendations */}
            <Card className="p-6 border-primary/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered Climate-Smart Recommendations
                </h2>
                <Button
                  onClick={generateRecommendations}
                  disabled={generatingRecs || !selectedFarm}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {generatingRecs ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate New
                    </>
                  )}
                </Button>
              </div>

              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No recommendations yet. Generate AI-powered recommendations for your farm.
                  </p>
                  <Button
                    onClick={generateRecommendations}
                    disabled={generatingRecs || !selectedFarm}
                    className="flex items-center gap-2"
                  >
                    {generatingRecs ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate AI Recommendations
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{rec.title}</h3>
                        <Badge
                          variant={
                            rec.priority === "high"
                              ? "destructive"
                              : rec.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                        <span>•</span>
                        <span>{new Date(rec.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            {selectedFarm && (
              <ImageUpload
                farmId={selectedFarm.id}
                onUploadComplete={() => {
                  toast({
                    title: "Image uploaded!",
                    description: "AI analysis will be available soon.",
                  });
                }}
              />
            )}

            {/* Farm Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Farm Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-medium">{selectedFarm?.area_ha} ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Soil Type:</span>
                  <span className="font-medium">{selectedFarm?.soil_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Irrigation:</span>
                  <span className="font-medium">
                    {selectedFarm?.has_irrigation ? "Yes" : "No"}
                  </span>
                </div>
                {selectedFarm?.latitude && selectedFarm?.longitude && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-xs">
                      {selectedFarm.latitude.toFixed(4)}, {selectedFarm.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
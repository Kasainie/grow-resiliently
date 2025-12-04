import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FarmRegistration } from "@/components/farm/FarmRegistration";
import { FarmEditor } from "@/components/farm/FarmEditor";
import { ImageUpload } from "@/components/farm/ImageUpload";
import { AlertsPanel } from "@/components/alerts/AlertsPanel";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Sprout, LogOut, Plus, Loader2, Sparkles, Trash2, Edit3, ArrowRight, Home
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
  const [searchParams, setSearchParams] = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "true";
  const showMyFarms = searchParams.get("view") === "farms";
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [editingFarmId, setEditingFarmId] = useState<string | null>(null);
  const [generatingRecs, setGeneratingRecs] = useState(false);

  // Memoize the farm to edit for instant form rendering
  const farmToEdit = useMemo(
    () => (editingFarmId ? farms.find(f => f.id === editingFarmId) : null),
    [editingFarmId, farms]
  );

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
      const prompt = `Generate 5 farm recommendations for ${selectedFarm.name} (${selectedFarm.area_ha}ha, ${selectedFarm.soil_type || "unknown"} soil, irrigation: ${selectedFarm.has_irrigation ? "yes" : "no"}) in JSON only:
{"recommendations": [{"title": "Soil Testing", "description": "Test soil", "type": "soil", "priority": "high"}, {"title": "Crop Rotation", "description": "Rotate crops", "type": "crop_management", "priority": "high"}, {"title": "Water Management", "description": "Monitor moisture", "type": "irrigation", "priority": "medium"}, {"title": "Pest Management", "description": "Use IPM", "type": "pest_management", "priority": "high"}, {"title": "Weekly Monitoring", "description": "Scout fields", "type": "monitoring", "priority": "high"}]}`;

      let recommendations = [];
      let provider = "fallback";

      // Try ChatGPT
      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (openaiKey && openaiKey !== "your-openai-api-key-here") {
        try {
          console.log("Using ChatGPT for recommendations...");
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openaiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.7,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
          }

          const result = await response.json();
          if (result.error) throw new Error(result.error.message);
          
          const content = result.choices?.[0]?.message?.content || "";
          if (!content) throw new Error("No content in ChatGPT response");
          
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
            if (recommendations.length > 0) provider = "ChatGPT";
          }
        } catch (e) {
          console.error("ChatGPT failed:", e);
          if (openaiKey === "your-openai-api-key-here") {
            console.warn("OpenAI API key not configured");
          }
        }
      }

      // Try Gemini if ChatGPT failed
      if (recommendations.length === 0) {
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (geminiKey && geminiKey !== "your-gemini-api-key-here") {
          try {
            console.log("Using Gemini for recommendations...");
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                }),
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
            }

            const result = await response.json();
            if (result.error) throw new Error(result.error.message);

            const content = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (!content) throw new Error("No content in Gemini response");

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
              if (recommendations.length > 0) provider = "Gemini";
            }
          } catch (e) {
            console.error("Gemini failed:", e);
            if (geminiKey === "your-gemini-api-key-here") {
              console.warn("Gemini API key not configured");
            }
          }
        }
      }

      // Fallback recommendations
      if (recommendations.length === 0) {
        recommendations = [
          { title: "Soil Testing", description: "Conduct comprehensive soil analysis", type: "soil", priority: "high" },
          { title: "Crop Rotation", description: "Implement 3-4 year rotation plan", type: "crop_management", priority: "high" },
          { title: selectedFarm.has_irrigation ? "Optimize Irrigation" : "Install Irrigation", description: selectedFarm.has_irrigation ? "Review irrigation schedule" : "Consider drip irrigation system", type: "irrigation", priority: "high" },
          { title: "Integrated Pest Management", description: "Use cultural, biological, and chemical controls", type: "pest_management", priority: "high" },
          { title: "Weekly Farm Monitoring", description: "Scout fields and keep detailed records", type: "monitoring", priority: "high" },
        ];
        provider = "default";
      }

      // Insert recommendations
      const recsToInsert = recommendations.map((rec) => ({
        farm_id: selectedFarm.id,
        title: rec.title,
        description: rec.description,
        type: rec.type || "general",
        priority: rec.priority || "medium",
      }));

      const { error } = await supabase.from("recommendations").insert(recsToInsert);

      if (error) throw error;

      toast({
        title: `Recommendations Generated (${provider})!`,
        description: "Check your action plan below.",
      });

      fetchRecommendations(selectedFarm.id);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      const errorMsg = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Failed to generate recommendations",
        description: errorMsg,
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

  const handleDeleteFarm = async (farmId: string, farmName: string) => {
    if (!confirm(`Are you sure you want to delete "${farmName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("farms")
        .delete()
        .eq("id", farmId)
        .eq("user_id", user?.id);

      if (error) throw error;

      // Remove from local state
      setFarms(farms.filter(f => f.id !== farmId));
      
      // If deleted farm was selected, select another or clear
      if (selectedFarm?.id === farmId) {
        const remainingFarms = farms.filter(f => f.id !== farmId);
        setSelectedFarm(remainingFarms.length > 0 ? remainingFarms[0] : null);
      }

      toast({
        title: "Farm deleted",
        description: `"${farmName}" has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete farm",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFarm = async (farmId: string, updatedData: Omit<Farm, 'id'>) => {
    try {
      const { error } = await supabase
        .from("farms")
        .update({
          name: updatedData.name,
          latitude: updatedData.latitude,
          longitude: updatedData.longitude,
          area_ha: updatedData.area_ha,
          soil_type: updatedData.soil_type,
          has_irrigation: updatedData.has_irrigation,
        })
        .eq("id", farmId)
        .eq("user_id", user?.id);

      if (error) throw error;

      // Update local state
      setFarms(farms.map(f => f.id === farmId ? { ...f, ...updatedData } : f));
      
      // Update selected farm if it's the one being edited
      if (selectedFarm?.id === farmId) {
        setSelectedFarm({ ...selectedFarm, ...updatedData });
      }

      setEditingFarmId(null);
      setShowFarmForm(false);

      toast({
        title: "Farm updated",
        description: `"${updatedData.name}" has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update farm",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show farm form FIRST (highest priority) - edit or add new farm
  if (showFarmForm) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2">
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              title="Go to home"
            >
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-lg md:text-xl font-bold text-primary">CSA.AI</span>
            </button>
            <div className="flex items-center gap-1 md:gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowFarmForm(false);
                  setEditingFarmId(null);
                  setSearchParams({ view: 'farms' });
                }}
                className="text-xs md:text-sm"
              >
                ← <span className="hidden sm:inline ml-1">Back</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs md:text-sm">
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-2xl">
            {farmToEdit ? (
              <FarmEditor
                farm={farmToEdit}
                onSave={(updatedData) => {
                  handleUpdateFarm(editingFarmId, updatedData);
                }}
                onCancel={() => {
                  setShowFarmForm(false);
                  setEditingFarmId(null);
                }}
              />
            ) : (
              <FarmRegistration
                onSuccess={() => {
                  fetchFarms();
                  setShowFarmForm(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show welcome screen after login/signup
  if (isWelcome && farms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              title="Go to home"
            >
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">CSA.AI</span>
            </button>
            <Button variant="ghost" size="sm" onClick={async () => {
              await signOut();
              window.location.href = "/";
            }}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="mb-8">
              <Sprout className="h-20 w-20 text-primary mx-auto mb-6 opacity-80" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Welcome to CSA.AI! 🌾
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Your account has been created successfully.
            </p>
            <p className="text-lg text-muted-foreground mb-12">
              Let's get started by registering your first farm to receive personalized climate-smart recommendations.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 text-left border-2 border-primary/20">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-semibold text-lg mb-2">Register Your Farm</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about your farm location, size, and soil type
                </p>
              </Card>
              <Card className="p-6 text-left border-2 border-primary/20">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="font-semibold text-lg mb-2">Upload Crop Images</h3>
                <p className="text-sm text-muted-foreground">
                  Take photos of your crops for AI analysis
                </p>
              </Card>
              <Card className="p-6 text-left border-2 border-primary/20">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="font-semibold text-lg mb-2">Get Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Receive AI-powered climate-smart recommendations
                </p>
              </Card>
            </div>

            <Button
              size="lg"
              onClick={() => setShowFarmForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all px-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              Register Your First Farm
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isWelcome && farms.length > 0) {
    // Remove welcome parameter and show normal dashboard
    setSearchParams({});
  }

  // Show My Farms view when view=farms
  if (showMyFarms) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2">
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              title="Go to home"
            >
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-lg md:text-xl font-bold text-primary">CSA.AI</span>
            </button>
            <div className="flex items-center gap-1 md:gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchParams({})}
                className="text-xs md:text-sm"
                title="Go back"
              >
                ← <span className="hidden sm:inline ml-1">Back</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = "/"}
                className="text-xs md:text-sm"
                title="Back to Home"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Home</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs md:text-sm">
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-3 md:px-4 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              📋 My Farms
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              You have {farms.length} farm{farms.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          {farms.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <Sprout className="h-16 md:h-20 w-16 md:w-20 mx-auto mb-4 text-primary opacity-30" />
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                No farms registered yet.
              </p>
              <Button
                size="lg"
                onClick={() => setShowFarmForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white w-full sm:w-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Farm
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {farms.map((farm) => (
                <Card
                  key={farm.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                    selectedFarm?.id === farm.id
                      ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
                      : "border-transparent hover:border-green-300"
                  }`}
                  onClick={() => {
                    setSelectedFarm(farm);
                    setSearchParams({});
                  }}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="text-xl font-bold text-foreground">{farm.name}</h3>
                    {selectedFarm?.id === farm.id && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                        ✓ Active
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">📍</span>
                      <span className="text-muted-foreground">{farm.area_ha} hectares</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">🌍</span>
                      <span className="text-muted-foreground capitalize">{farm.soil_type} soil</span>
                    </div>
                    {farm.has_irrigation && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">💧</span>
                        <span className="text-muted-foreground">Irrigation system</span>
                      </div>
                    )}
                    {farm.latitude && farm.longitude && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">🗺️</span>
                        <span className="text-muted-foreground text-xs">
                          {farm.latitude.toFixed(2)}°, {farm.longitude.toFixed(2)}°
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border space-y-2">
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFarm(farm);
                        setSearchParams({});
                      }}
                    >
                      View Farm
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 hover:text-blue-700 hover:border-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFarmId(farm.id);
                          setShowFarmForm(true);
                        }}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:border-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFarm(farm.id, farm.name);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Card 
                className="p-6 flex items-center justify-center border-2 border-dashed border-primary/30 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950 cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95 hover:scale-105"
                onClick={() => {
                  setEditingFarmId(null);
                  setShowFarmForm(true);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setEditingFarmId(null);
                    setShowFarmForm(true);
                  }
                }}
              >
                <div className="text-center w-full">
                  <div className="inline-block p-3 bg-primary/10 rounded-full mb-3 group-hover:bg-green-100 transition-all duration-300">
                    <Plus className="h-12 w-12 text-primary opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="font-bold text-lg text-foreground mb-2 transition-all">Add New Farm</p>
                  <p className="text-sm text-muted-foreground transition-all">Register another farm</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (farms.length === 0) {
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2 md:gap-3">
          <button
            onClick={() => {
              // Toggle farm details modal/view
              const farmDetailsElement = document.getElementById("farm-details-modal");
              if (farmDetailsElement) {
                farmDetailsElement.classList.toggle("hidden");
              }
            }}
            className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 hover:bg-primary/5 rounded-lg p-2 transition-colors cursor-pointer"
            title="Click to view farm details"
          >
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1 text-left">
              <h1 className="text-lg md:text-xl font-bold text-foreground truncate">
                {selectedFarm?.name || "My Farm"}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {selectedFarm?.area_ha} hectares • {selectedFarm?.soil_type}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = "/"}
              className="text-xs md:text-sm"
              title="Back to Home"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Home</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchParams({ view: "farms" })}
              className="text-xs md:text-sm"
              title="View all farms"
            >
              <span className="text-lg mr-1">📋</span>
              <span className="hidden sm:inline">Farms</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setShowFarmForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all text-xs md:text-sm"
              title="Add a new farm"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Add Farm</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs md:text-sm">
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts Panel */}
            <AlertsPanel farmId={selectedFarm?.id} />

            {/* Recommendations */}
            <Card className="p-4 md:p-6 border-primary/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>AI Recommendations</span>
                </h2>
                <Button
                  onClick={generateRecommendations}
                  disabled={generatingRecs || !selectedFarm}
                  size="sm"
                  className="flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  {generatingRecs ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate</span>
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
          <div className="space-y-4 md:space-y-6 lg:col-span-1">
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
            <Card className="p-6" id="farm-details-modal">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Farm Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Farm Name:</span>
                  <span className="font-medium">{selectedFarm?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-medium">{selectedFarm?.area_ha} hectares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Soil Type:</span>
                  <span className="font-medium capitalize">{selectedFarm?.soil_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Irrigation:</span>
                  <span className="font-medium">
                    {selectedFarm?.has_irrigation ? "Yes ✓" : "No"}
                  </span>
                </div>
                {selectedFarm?.latitude && selectedFarm?.longitude && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-xs">
                      {selectedFarm.latitude.toFixed(4)}°, {selectedFarm.longitude.toFixed(4)}°
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
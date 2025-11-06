import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const farmSchema = z.object({
  name: z.string().min(2, "Farm name must be at least 2 characters").max(100),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  area_ha: z.number().positive("Area must be positive").optional(),
  soil_type: z.string().max(50).optional(),
});

export const FarmRegistration = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    area_ha: "",
    soil_type: "loamy",
    has_irrigation: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const data = {
        name: formData.name.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        area_ha: formData.area_ha ? parseFloat(formData.area_ha) : undefined,
        soil_type: formData.soil_type || undefined,
      };

      farmSchema.parse(data);

      const { error } = await supabase.from("farms").insert({
        user_id: user.id,
        ...data,
        has_irrigation: formData.has_irrigation,
      });

      if (error) throw error;

      toast({ title: "Farm registered!", description: "Your farm has been successfully registered." });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation error", description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({
          title: "Registration failed",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register Your Farm</CardTitle>
        <CardDescription>
          Tell us about your farm to get personalized climate-smart recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Farm Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Green Valley Farm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g., -1.2921"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g., 36.8219"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area_ha">Farm Area (hectares)</Label>
              <Input
                id="area_ha"
                type="number"
                step="0.01"
                value={formData.area_ha}
                onChange={(e) => setFormData({ ...formData, area_ha: e.target.value })}
                placeholder="e.g., 2.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil_type">Soil Type</Label>
              <Select
                value={formData.soil_type}
                onValueChange={(value) => setFormData({ ...formData, soil_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="silty">Silty</SelectItem>
                  <SelectItem value="peaty">Peaty</SelectItem>
                  <SelectItem value="chalky">Chalky</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="irrigation"
              checked={formData.has_irrigation}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, has_irrigation: checked })
              }
            />
            <Label htmlFor="irrigation">Farm has irrigation system</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register Farm"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
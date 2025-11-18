import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { AlertCircle } from "lucide-react";

interface Farm {
  id: string;
  name: string;
  area_ha: number;
  latitude: number;
  longitude: number;
  has_irrigation: boolean;
  soil_type: string;
}

const farmSchema = z.object({
  name: z.string().min(2, "Farm name must be at least 2 characters").max(100),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  area_ha: z.number().positive("Area must be a positive number"),
  soil_type: z.string().min(1, "Soil type is required").max(50),
});

interface FarmEditorProps {
  farm: Farm;
  onSave: (farm: Omit<Farm, 'id'>) => void;
  onCancel: () => void;
}

export const FarmEditor = ({ farm, onSave, onCancel }: FarmEditorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: farm.name,
    latitude: farm.latitude.toString(),
    longitude: farm.longitude.toString(),
    area_ha: farm.area_ha.toString(),
    soil_type: farm.soil_type,
    has_irrigation: farm.has_irrigation,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate that all required fields are filled
      if (!formData.name.trim()) {
        toast({ title: "Validation error", description: "Farm name is required", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!formData.latitude) {
        toast({ title: "Validation error", description: "Latitude is required", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!formData.longitude) {
        toast({ title: "Validation error", description: "Longitude is required", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!formData.area_ha) {
        toast({ title: "Validation error", description: "Farm area is required", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!formData.soil_type) {
        toast({ title: "Validation error", description: "Soil type is required", variant: "destructive" });
        setLoading(false);
        return;
      }

      const data = {
        name: formData.name.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        area_ha: parseFloat(formData.area_ha),
        soil_type: formData.soil_type,
      };

      farmSchema.parse(data);

      onSave({
        ...data,
        has_irrigation: formData.has_irrigation,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation error", description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({
          title: "Error",
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
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-blue-600" />
          Edit Farm Details
        </CardTitle>
        <CardDescription>
          Update your farm information. All fields are required.
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
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g., -1.2921"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g., 36.8219"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area_ha">Farm Area (hectares) *</Label>
              <Input
                id="area_ha"
                type="number"
                step="0.01"
                value={formData.area_ha}
                onChange={(e) => setFormData({ ...formData, area_ha: e.target.value })}
                placeholder="e.g., 2.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil_type">Soil Type *</Label>
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

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

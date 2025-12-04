import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Upload, Camera, Sparkles } from "lucide-react";
import { CropAnalysisResults } from "./CropAnalysisResults";

interface ImageUploadProps {
  farmId: string;
  plotId?: string;
  onUploadComplete?: () => void;
}

export const ImageUpload = ({ farmId, plotId, onUploadComplete }: ImageUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: "File too large", 
        description: "Please select an image smaller than 5MB",
        variant: "destructive" 
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ 
        title: "Invalid file type", 
        description: "Please select an image file",
        variant: "destructive" 
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setLoading(true);
    setAnalyzing(false);
    setAnalysis("");

    try {
      // Save the image record first
      const { error: insertError } = await supabase.from("images").insert({
        farm_id: farmId,
        plot_id: plotId || null,
        user_id: user.id,
        storage_path: `crop-images/${user.id}/${Date.now()}.${selectedFile.name.split(".").pop()}`,
        captured_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      toast({ 
        title: "Image uploaded!", 
        description: "Starting AI-powered disease analysis..." 
      });

      // Start AI analysis
      setAnalyzing(true);

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;

        try {
          console.log("Calling analyze-crop-simple for farm:", farmId);
          const { data, error } = await supabase.functions.invoke("analyze-crop-simple", {
            body: { imageData, farmId },
          });

          if (error) {
            console.error("Edge function error:", error);
            if (error.message?.includes("429")) {
              throw new Error("Rate limit exceeded. Please try again later.");
            }
            if (error.message?.includes("402")) {
              throw new Error("AI credits exhausted. Please add credits to continue.");
            }
            throw error;
          }

          console.log("Analysis completed:", data);
          setAnalysis(data.analysis || data.analysis_text);
          
          toast({ 
            title: "Analysis complete!", 
            description: "AI has analyzed your crop image for diseases and pests." 
          });

          if (onUploadComplete) {
            onUploadComplete();
          }
        } catch (analysisError) {
          toast({
            title: "Analysis failed",
            description: analysisError instanceof Error ? analysisError.message : "AI analysis encountered an error",
            variant: "destructive",
          });
        } finally {
          setAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedFile);

    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setLoading(false);
      setAnalyzing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Crop Analysis
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Upload images for AI-powered pest and disease detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Select Crop Image</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="flex items-center gap-2"
                disabled={loading || analyzing}
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile && (
                <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
              )}
            </div>
          </div>

          {preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-md border"
              />
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || loading || analyzing}
            className="w-full"
          >
            {loading ? "Uploading..." : analyzing ? "Analyzing with AI..." : "Upload & Analyze"}
          </Button>
        </CardContent>
      </Card>

      {(analyzing || analysis) && (
        <CropAnalysisResults analysis={analysis} loading={analyzing} />
      )}
    </div>
  );
};
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Upload, Camera, Sparkles } from "lucide-react";
import { CropAnalysisResults } from "./CropAnalysisResults";

export interface AnalysisData {
  disease?: string;
  severity?: string;
  confidence?: number;
  description?: string;
  recommendations?: string;
}

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
  const [analysis, setAnalysis] = useState<any>(null);

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
    setAnalyzing(true);
    setAnalysis("");

    try {
      console.log("Converting image to base64...");

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;

        try {
          console.log("Calling edge function for crop analysis...");

          const response = await supabase.functions.invoke('analyze-crop-ai', {
            body: {
              farmId,
              userId: user.id,
              imageData,
              imageName: selectedFile.name,
            },
          });

          if (response.error) {
            throw new Error(response.error.message || "Edge function failed");
          }

          const { data } = response;
          console.log("Crop analysis complete:", data);

          if (data && data.analysis) {
            setAnalysis(data.analysis);
            toast({
              title: `Analysis Complete!`,
              description: `Detected: ${data.analysis.disease || "Unknown"}`,
            });
          } else {
            throw new Error("Invalid response format from analysis");
          }

          if (onUploadComplete) {
            onUploadComplete();
          }
        } catch (analysisError) {
          console.error("Analysis error:", analysisError);
          console.error("Full error object:", { analysisError });
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
      console.error("Upload error:", error);
      console.error("Full error object:", { error });
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
                title="Select crop image"
                aria-label="Select crop image"
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
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
          console.log("Starting AI crop analysis...");

          const prompt = `You are an expert agricultural pathologist. Analyze this crop image and identify:
1. Any visible diseases, pests, or stress conditions
2. Severity level (low, medium, high, critical)
3. Specific treatment recommendations

Respond in JSON format only:
{"disease": "Disease name or 'Healthy'", "severity": "low|medium|high", "confidence": 0-100, "description": "What you see", "recommendations": "Treatment steps"}`;

          let analysis = null;
          let provider = "fallback";

          // Try ChatGPT with vision
          const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
          if (openaiKey && openaiKey !== "your-openai-api-key-here") {
            try {
              console.log("Using ChatGPT for crop analysis...");
              const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${openaiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    {
                      role: "user",
                      content: [
                        {
                          type: "text",
                          text: prompt,
                        },
                        {
                          type: "image_url",
                          image_url: {
                            url: imageData,
                          },
                        },
                      ],
                    },
                  ],
                  max_tokens: 500,
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
                analysis = JSON.parse(jsonMatch[0]);
                provider = "ChatGPT";
              }
            } catch (e) {
              console.error("ChatGPT analysis failed:", e);
              if (openaiKey === "your-openai-api-key-here") {
                console.warn("OpenAI API key not configured");
              }
            }
          }

          // Try Gemini if ChatGPT failed
          if (!analysis) {
            const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (geminiKey && geminiKey !== "your-gemini-api-key-here") {
              try {
                console.log("Using Gemini for crop analysis...");
                const base64Image = imageData.split(",")[1];
                const response = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      contents: [
                        {
                          parts: [
                            { text: prompt },
                            {
                              inlineData: {
                                mimeType: "image/jpeg",
                                data: base64Image,
                              },
                            },
                          ],
                        },
                      ],
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
                  analysis = JSON.parse(jsonMatch[0]);
                  provider = "Gemini";
                }
              } catch (e) {
                console.error("Gemini analysis failed:", e);
                if (geminiKey === "your-gemini-api-key-here") {
                  console.warn("Gemini API key not configured");
                }
              }
            }
          }

          // Fallback analysis
          if (!analysis) {
            analysis = {
              disease: "Image analysis pending",
              severity: "low",
              confidence: 0,
              description: "Could not analyze image with AI. Please check your API keys or try again.",
              recommendations: "Ensure API keys are configured in .env file",
            };
            provider = "fallback";
          }

          setAnalysis(analysis);

          toast({
            title: `Analysis Complete (${provider})!`,
            description: `Detected: ${analysis.disease || "Unknown"}`,
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
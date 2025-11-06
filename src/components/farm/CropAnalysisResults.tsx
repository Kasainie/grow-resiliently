import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";

interface CropAnalysisResultsProps {
  analysis: string;
  loading?: boolean;
}

export const CropAnalysisResults = ({ analysis, loading }: CropAnalysisResultsProps) => {
  if (loading) {
    return (
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            AI Analysis in Progress
          </CardTitle>
          <CardDescription>
            Our AI is analyzing your crop image for diseases and pests...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  // Parse severity from analysis text
  const getSeverityBadge = () => {
    const lowerAnalysis = analysis.toLowerCase();
    if (lowerAnalysis.includes("high") || lowerAnalysis.includes("severe") || lowerAnalysis.includes("critical")) {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />High Severity</Badge>;
    }
    if (lowerAnalysis.includes("medium") || lowerAnalysis.includes("moderate")) {
      return <Badge className="bg-warning text-warning-foreground flex items-center gap-1"><Info className="h-3 w-3" />Medium Severity</Badge>;
    }
    if (lowerAnalysis.includes("low") || lowerAnalysis.includes("healthy")) {
      return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Low/Healthy</Badge>;
    }
    return <Badge variant="outline">Analysis Complete</Badge>;
  };

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Analysis Results
          </CardTitle>
          {getSeverityBadge()}
        </div>
        <CardDescription>
          Powered by advanced AI crop disease detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {analysis}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

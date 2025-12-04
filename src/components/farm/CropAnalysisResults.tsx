import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";

interface AnalysisData {
  disease?: string;
  severity?: string;
  confidence?: number;
  description?: string;
  recommendations?: string;
}

interface CropAnalysisResultsProps {
  analysis: AnalysisData | null;
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

  const getSeverityBadge = () => {
    const severity = analysis.severity?.toLowerCase() || "";
    if (severity === "critical" || severity === "high") {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />High Severity</Badge>;
    }
    if (severity === "medium") {
      return <Badge className="bg-orange-500 text-white flex items-center gap-1"><Info className="h-3 w-3" />Medium Severity</Badge>;
    }
    if (severity === "low" || analysis.disease?.toLowerCase() === "healthy") {
      return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Healthy</Badge>;
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
      <CardContent className="space-y-4">
        {analysis.disease && (
          <div>
            <h3 className="font-semibold text-sm mb-1">Detected Issue</h3>
            <p className="text-foreground">{analysis.disease}</p>
          </div>
        )}
        {analysis.confidence !== undefined && (
          <div>
            <h3 className="font-semibold text-sm mb-1">Confidence</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{width: `${Math.min(analysis.confidence, 100)}%`}}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">{Math.round(analysis.confidence || 0)}%</span>
            </div>
          </div>
        )}
        {analysis.description && (
          <div>
            <h3 className="font-semibold text-sm mb-1">Description</h3>
            <p className="text-foreground text-sm">{analysis.description}</p>
          </div>
        )}
        {analysis.recommendations && (
          <div>
            <h3 className="font-semibold text-sm mb-1">Recommendations</h3>
            <p className="text-foreground text-sm">{analysis.recommendations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

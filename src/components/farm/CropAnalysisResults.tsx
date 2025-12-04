import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";

interface AnalysisData {
  disease?: string;
  severity?: string;
  confidence?: number;
  cropType?: string;
  growthStage?: string;
  overallHealth?: string;
  description?: string;
  symptoms?: string[];
  possibleCauses?: string[];
  riskFactors?: string;
  immediateActions?: string;
  shortTermTreatment?: string;
  longTermManagement?: string;
  recommendedProducts?: string[];
  monitoringSchedule?: string;
  weatherConsiderations?: string;
  alternativeSolutions?: string;
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
      <CardContent className="space-y-6 max-h-96 overflow-y-auto">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          {analysis.cropType && (
            <div className="col-span-1">
              <h3 className="font-semibold text-xs text-muted-foreground mb-1">Crop Type</h3>
              <p className="text-sm font-medium">{analysis.cropType}</p>
            </div>
          )}
          {analysis.growthStage && (
            <div className="col-span-1">
              <h3 className="font-semibold text-xs text-muted-foreground mb-1">Growth Stage</h3>
              <p className="text-sm font-medium">{analysis.growthStage}</p>
            </div>
          )}
        </div>

        {/* Overall Health */}
        {analysis.overallHealth && (
          <div className="p-3 bg-secondary/50 rounded-lg border border-secondary">
            <h3 className="font-semibold text-sm mb-2">Overall Health</h3>
            <p className="text-sm text-foreground">{analysis.overallHealth}</p>
          </div>
        )}

        {/* Main Issue */}
        {analysis.disease && (
          <div>
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Primary Issue
            </h3>
            <p className="text-sm font-medium">{analysis.disease}</p>
            {analysis.confidence !== undefined && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{width: `${Math.min(analysis.confidence, 100)}%`}}
                  />
                </div>
                <span className="text-xs font-medium w-10 text-right">{Math.round(analysis.confidence || 0)}%</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {analysis.description && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Visual Assessment</h3>
            <p className="text-sm text-foreground leading-relaxed">{analysis.description}</p>
          </div>
        )}

        {/* Symptoms */}
        {analysis.symptoms && analysis.symptoms.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Visible Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.symptoms.map((symptom, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">{symptom}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Possible Causes */}
        {analysis.possibleCauses && analysis.possibleCauses.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Possible Causes</h3>
            <ul className="text-sm space-y-1">
              {analysis.possibleCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Factors */}
        {analysis.riskFactors && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Risk Factors</h3>
            <p className="text-sm text-foreground">{analysis.riskFactors}</p>
          </div>
        )}

        {/* Weather */}
        {analysis.weatherConsiderations && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Weather Impact</h3>
            <p className="text-sm text-foreground">{analysis.weatherConsiderations}</p>
          </div>
        )}

        {/* Immediate Actions */}
        {analysis.immediateActions && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 text-red-700">⚡ Immediate Actions (Next 24-48 hours)</h3>
            <p className="text-sm text-foreground">{analysis.immediateActions}</p>
          </div>
        )}

        {/* Short Term Treatment */}
        {analysis.shortTermTreatment && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 text-orange-700">📅 Short Term (1-2 weeks)</h3>
            <p className="text-sm text-foreground">{analysis.shortTermTreatment}</p>
          </div>
        )}

        {/* Recommended Products */}
        {analysis.recommendedProducts && analysis.recommendedProducts.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Recommended Products</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendedProducts.map((product, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">{product}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Long Term Management */}
        {analysis.longTermManagement && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 text-green-700">🌱 Long Term Strategy</h3>
            <p className="text-sm text-foreground">{analysis.longTermManagement}</p>
          </div>
        )}

        {/* Monitoring Schedule */}
        {analysis.monitoringSchedule && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Monitoring Schedule</h3>
            <p className="text-sm text-foreground">{analysis.monitoringSchedule}</p>
          </div>
        )}

        {/* Alternative Solutions */}
        {analysis.alternativeSolutions && (
          <div>
            <h3 className="font-semibold text-sm mb-2">🌿 Organic Alternatives</h3>
            <p className="text-sm text-foreground">{analysis.alternativeSolutions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

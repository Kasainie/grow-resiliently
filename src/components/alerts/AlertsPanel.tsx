import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, CheckCircle, Info, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  level: "info" | "warning" | "critical";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  farm_id?: string;
}

interface AlertsPanelProps {
  farmId?: string;
}

export const AlertsPanel = ({ farmId }: AlertsPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching alerts:", error);
      } else {
        setAlerts((data || []) as Alert[]);
      }
      setLoading(false);
    };

    fetchAlerts();

    // Set up realtime subscription
    const channel = supabase
      .channel("alerts-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "alerts",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newAlert = payload.new as Alert;
          setAlerts((prev) => [newAlert, ...prev]);
          
          // Show toast for new alerts
          toast({
            title: newAlert.title,
            description: newAlert.message,
            variant: newAlert.level === "critical" ? "destructive" : "default",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const generateAIAlerts = async () => {
    if (!farmId) {
      toast({
        title: "No farm selected",
        description: "Please select a farm to generate alerts",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to generate alerts",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      console.log("Calling edge function to generate alerts...");

      const response = await supabase.functions.invoke('generate-alerts-ai', {
        body: {
          farmId,
          userId: user.id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Edge function failed");
      }
      const { data } = response;
      console.log("Alerts generated:", data);

      toast({
        title: "Alerts Generated!",
        description: `Created ${data.count || 0} alerts for your farm.`,
      });
    } catch (error) {
      console.error("Error generating alerts:", error);
      console.error("Full error object:", { error });
      toast({
        title: "Failed to generate alerts",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    const { error } = await supabase
      .from("alerts")
      .update({ is_read: true })
      .eq("id", alertId);

    if (!error) {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading alerts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Powered Alerts & Warnings
            </CardTitle>
            <CardDescription>Real-time AI-generated notifications based on your farm data</CardDescription>
          </div>
          {farmId && (
            <Button
              onClick={generateAIAlerts}
              disabled={generating}
              size="sm"
              className="flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Alerts
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No alerts at this time</p>
            {farmId && (
              <Button onClick={generateAIAlerts} disabled={generating} variant="outline">
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Alerts
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg ${
                  !alert.is_read ? "bg-accent/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.level)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold">{alert.title}</h4>
                      {getLevelBadge(alert.level)}
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!alert.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
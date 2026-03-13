import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startExperiment,
  stopExperiment,
  exportSensorDataUrl,
  exportMetricsUrl,
} from "@/lib/api";
import type { Experiment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsTable } from "./MetricsTable";
import { SensorDataTable } from "./SensorDataTable";
import { toast } from "sonner";
import { Play, Square, Download } from "lucide-react";

export function ExperimentDetail({ experiment }: { experiment: Experiment }) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["experiments", experiment.team_id],
    });

  const start = useMutation({
    mutationFn: () => startExperiment(experiment.id),
    onSuccess: () => {
      toast.success("Eksperiment käivitatud");
      invalidate();
    },
    onError: (err) => toast.error(String(err)),
  });

  const stop = useMutation({
    mutationFn: () => stopExperiment(experiment.id),
    onSuccess: () => {
      toast.success("Eksperiment peatatud");
      invalidate();
    },
    onError: (err) => toast.error(String(err)),
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="overview">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{experiment.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {experiment.is_active ? (
                <Badge className="bg-green-600 text-white">Aktiivne</Badge>
              ) : experiment.stopped_at ? (
                <Badge variant="destructive">Peatatud</Badge>
              ) : (
                <Badge variant="secondary">Ootel</Badge>
              )}
            </div>
          </div>
          <TabsList>
            <TabsTrigger value="overview">Ülevaade</TabsTrigger>
            <TabsTrigger value="metrics">Mõõdikud</TabsTrigger>
            <TabsTrigger value="sensor-data">Sensoriandmed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Käivitatud</span>
                <p className="font-medium">
                  {experiment.started_at
                    ? new Date(experiment.started_at).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Peatatud</span>
                <p className="font-medium">
                  {experiment.stopped_at
                    ? new Date(experiment.stopped_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => start.mutate()}
                disabled={experiment.is_active || start.isPending}
              >
                <Play className="h-4 w-4 mr-1" />
                Käivita
              </Button>
              <Button
                variant="destructive"
                onClick={() => stop.mutate()}
                disabled={!experiment.is_active || stop.isPending}
              >
                <Square className="h-4 w-4 mr-1" />
                Peata
              </Button>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" asChild>
                <a href={exportSensorDataUrl(experiment.id)} download>
                  <Download className="h-4 w-4 mr-1" />
                  Sensoriandmed CSV
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={exportMetricsUrl(experiment.id)} download>
                  <Download className="h-4 w-4 mr-1" />
                  Mõõdikud CSV
                </a>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsTable experimentId={experiment.id} />
        </TabsContent>

        <TabsContent value="sensor-data">
          <SensorDataTable experimentId={experiment.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

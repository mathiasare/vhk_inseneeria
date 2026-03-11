import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getExperiments } from "@/lib/api";
import type { Experiment } from "@/lib/types";
import { ExperimentList } from "@/components/ExperimentList";
import { ExperimentDetail } from "@/components/ExperimentDetail";

export function TeamDashboardPage() {
  const { teamId: rawTeamId } = useParams({ from: "/teams/$teamId" });
  const teamId = Number(rawTeamId);
  const [selectedExpId, setSelectedExpId] = useState<number | null>(null);

  const { data: experiments } = useQuery({
    queryKey: ["experiments", teamId],
    queryFn: () => getExperiments(teamId),
  });

  const selectedExp: Experiment | undefined = experiments?.find(
    (e) => e.id === selectedExpId,
  );

  return (
    <div className="flex h-screen">
      <aside className="w-72 shrink-0 border-r border-border flex flex-col bg-card">
        <ExperimentList
          teamId={teamId}
          experiments={experiments ?? []}
          selectedId={selectedExpId}
          onSelect={setSelectedExpId}
        />
      </aside>

      <main className="flex-1 overflow-auto p-6">
        {selectedExp ? (
          <ExperimentDetail experiment={selectedExp} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select an experiment to view details
          </div>
        )}
      </main>
    </div>
  );
}

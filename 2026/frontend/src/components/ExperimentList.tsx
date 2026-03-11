import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createExperiment } from "@/lib/api";
import type { Experiment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, ArrowLeft } from "lucide-react";

function statusBadge(exp: Experiment) {
  if (exp.is_active) return <Badge className="bg-green-600 text-white">Active</Badge>;
  if (exp.stopped_at) return <Badge variant="destructive">Stopped</Badge>;
  return <Badge variant="secondary">Idle</Badge>;
}

export function ExperimentList({
  teamId,
  experiments,
  selectedId,
  onSelect,
}: {
  teamId: number;
  experiments: Experiment[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const create = useMutation({
    mutationFn: () => createExperiment(teamId, newName),
    onSuccess: (exp) => {
      toast.success(`Experiment "${exp.name}" created`);
      queryClient.invalidateQueries({ queryKey: ["experiments", teamId] });
      setNewName("");
      setDialogOpen(false);
      onSelect(exp.id);
    },
    onError: (err) => toast.error(String(err)),
  });

  return (
    <>
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold text-sm flex-1">Team {teamId}</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Experiment</DialogTitle>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (newName.trim()) create.mutate();
              }}
            >
              <Input
                placeholder="Experiment name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                disabled={!newName.trim() || create.isPending}
              >
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-auto">
        {experiments.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No experiments yet
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {experiments.map((exp) => (
              <li key={exp.id}>
                <button
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors ${
                    selectedId === exp.id ? "bg-accent" : ""
                  }`}
                  onClick={() => onSelect(exp.id)}
                >
                  <span className="text-sm font-medium truncate mr-2">
                    {exp.name}
                  </span>
                  {statusBadge(exp)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

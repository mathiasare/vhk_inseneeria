import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMetrics, addMetric } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MetricsTable({ experimentId }: { experimentId: number }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metrics", experimentId],
    queryFn: () => getMetrics(experimentId),
  });

  const add = useMutation({
    mutationFn: () => addMetric(experimentId, name, parseFloat(value)),
    onSuccess: () => {
      toast.success("Metric added");
      queryClient.invalidateQueries({ queryKey: ["metrics", experimentId] });
      setName("");
      setValue("");
    },
    onError: (err) => toast.error(String(err)),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : metrics?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No metrics recorded
                </TableCell>
              </TableRow>
            ) : (
              metrics?.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.value}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim() && value.trim()) add.mutate();
        }}
      >
        <Input
          placeholder="Metric name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-48"
        />
        <Input
          placeholder="Value"
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="max-w-32"
        />
        <Button
          type="submit"
          disabled={!name.trim() || !value.trim() || add.isPending}
        >
          Add Metric
        </Button>
      </form>
    </div>
  );
}

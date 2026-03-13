import { useQuery } from "@tanstack/react-query";
import { getSensorData } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SensorDataChart } from "./SensorDataChart";

export function SensorDataTable({ experimentId }: { experimentId: number }) {
  const { data: readings, isLoading } = useQuery({
    queryKey: ["sensor-data", experimentId],
    queryFn: () => getSensorData(experimentId),
    refetchInterval: 5_000,
  });

  return (
    <div className="flex flex-col gap-4">
      {readings && readings.length > 0 && <SensorDataChart data={readings} />}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ajatempel</TableHead>
            <TableHead className="text-right">Kiirendus X</TableHead>
            <TableHead className="text-right">Kiirendus Y</TableHead>
            <TableHead className="text-right">Kiirendus Z</TableHead>
            <TableHead className="text-right">Pulsisagedus</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Laen…
              </TableCell>
            </TableRow>
          ) : readings?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Sensoriandmeid pole salvestatud
              </TableCell>
            </TableRow>
          ) : (
            readings?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(s.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {s.acceleration_x.toFixed(3)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {s.acceleration_y.toFixed(3)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {s.acceleration_z.toFixed(3)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {s.heart_rate.toFixed(1)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        </Table>
      </div>
    </div>
  );
}

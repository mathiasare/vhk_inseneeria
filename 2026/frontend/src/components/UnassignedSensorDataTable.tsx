import { useQuery } from "@tanstack/react-query";
import { getUnassignedSensorData } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SensorDataChart } from "./SensorDataChart";

export function UnassignedSensorDataTable({ teamId }: { teamId: number }) {
  const { data: readings, isLoading } = useQuery({
    queryKey: ["unassigned-sensor-data", teamId],
    queryFn: () => getUnassignedSensorData(teamId),
    refetchInterval: 5_000,
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Incoming Sensor Data</h2>
        <p className="text-sm text-muted-foreground">
          Live readings not yet assigned to an experiment
        </p>
      </div>

      {readings && readings.length > 0 && <SensorDataChart data={readings} />}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Accel X</TableHead>
              <TableHead className="text-right">Accel Y</TableHead>
              <TableHead className="text-right">Accel Z</TableHead>
              <TableHead className="text-right">Heart Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : readings?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No incoming sensor data
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

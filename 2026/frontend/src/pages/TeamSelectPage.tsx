import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getTeams, registerTeam } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TeamSelectPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading teams…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">IoT Workshop</h1>
      <p className="text-muted-foreground mb-8">
        Select your team to get started
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {teams?.map((team) => (
          <TeamCard
            key={team.id}
            teamId={team.id}
            name={team.name}
            onRegistered={() => queryClient.invalidateQueries({ queryKey: ["teams"] })}
            onSelect={() =>
              navigate({ to: "/teams/$teamId", params: { teamId: String(team.id) } })
            }
          />
        ))}
      </div>
    </div>
  );
}

function TeamCard({
  teamId,
  name,
  onRegistered,
  onSelect,
}: {
  teamId: number;
  name: string | null;
  onRegistered: () => void;
  onSelect: () => void;
}) {
  const [inputName, setInputName] = useState("");

  const register = useMutation({
    mutationFn: () => registerTeam(teamId, inputName),
    onSuccess: () => {
      toast.success(`Team ${teamId} registered!`);
      setInputName("");
      onRegistered();
    },
    onError: (err) => toast.error(String(err)),
  });

  const isRegistered = name !== null;

  return (
    <Card
      className={`transition-colors ${isRegistered ? "cursor-pointer hover:border-primary/60" : ""}`}
      onClick={isRegistered ? onSelect : undefined}
    >
      <CardHeader>
        <CardTitle>Team {teamId}</CardTitle>
        <CardDescription>
          {isRegistered ? name : "Unregistered"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegistered ? (
          <Button variant="secondary" className="w-full" onClick={onSelect}>
            Enter Dashboard
          </Button>
        ) : (
          <form
            className="flex gap-2"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (inputName.trim()) register.mutate();
            }}
          >
            <Input
              placeholder="Team name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
            <Button
              type="submit"
              disabled={!inputName.trim() || register.isPending}
            >
              Register
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

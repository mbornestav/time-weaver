import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseDurationHours } from "@/lib/timeParser";

type SolveFor = "speed" | "distance" | "time";

const solveLabels: Record<SolveFor, string> = {
  speed: "Speed (kt)",
  distance: "Distance (NM)",
  time: "Time (hr)",
};

const parseNumber = (value: string) => {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value: number, digits = 1) =>
  value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });

const normalizeAngle = (angle: number) => {
  let normalized = angle % 360;
  if (normalized > 180) normalized -= 360;
  if (normalized < -180) normalized += 360;
  return normalized;
};

export function NavTools() {
  const [solveFor, setSolveFor] = useState<SolveFor>("speed");
  const [speed, setSpeed] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");

  const triangleResult = useMemo(() => {
    const speedValue = parseNumber(speed);
    const distanceValue = parseNumber(distance);
    const timeValue = parseDurationHours(time);

    if (solveFor === "speed" && distanceValue !== null && timeValue && timeValue > 0) {
      return { label: solveLabels.speed, value: distanceValue / timeValue, unit: "kt" };
    }

    if (solveFor === "distance" && speedValue !== null && timeValue && timeValue > 0) {
      return { label: solveLabels.distance, value: speedValue * timeValue, unit: "NM" };
    }

    if (solveFor === "time" && speedValue !== null && speedValue > 0 && distanceValue !== null) {
      return { label: solveLabels.time, value: distanceValue / speedValue, unit: "hr" };
    }

    return null;
  }, [speed, distance, time, solveFor]);

  const [runwayHeading, setRunwayHeading] = useState("");
  const [windDirection, setWindDirection] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [windGust, setWindGust] = useState("");

  const windResult = useMemo(() => {
    const heading = parseNumber(runwayHeading);
    const direction = parseNumber(windDirection);
    const speedValue = parseNumber(windSpeed);
    if (heading === null || direction === null || speedValue === null) {
      return null;
    }

    const delta = normalizeAngle(direction - heading);
    const radians = (delta * Math.PI) / 180;
    const headwind = speedValue * Math.cos(radians);
    const crosswind = speedValue * Math.sin(radians);

    const gustValue = parseNumber(windGust);
    const gustHeadwind =
      gustValue !== null ? gustValue * Math.cos(radians) : null;
    const gustCrosswind =
      gustValue !== null ? gustValue * Math.sin(radians) : null;

    return {
      delta,
      headwind,
      crosswind,
      gustHeadwind,
      gustCrosswind,
    };
  }, [runwayHeading, windDirection, windSpeed, windGust]);

  const headwindLabel = windResult
    ? windResult.headwind >= 0
      ? "Headwind"
      : "Tailwind"
    : "Head/Tail";

  const crosswindLabel = windResult
    ? windResult.crosswind >= 0
      ? "Crosswind (Right)"
      : "Crosswind (Left)"
    : "Crosswind";

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Speed / Time / Distance</h2>
          <p className="text-xs text-muted-foreground">
            Solve one value using knots, nautical miles, and hours (HH:MM supported for time).
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["speed", "distance", "time"] as SolveFor[]).map((key) => (
            <Button
              key={key}
              type="button"
              variant={solveFor === key ? "default" : "secondary"}
              className="h-10"
              onClick={() => setSolveFor(key)}
            >
              {solveLabels[key].split(" ")[0]}
            </Button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Speed (kt)</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="e.g. 120"
              value={speed}
              onChange={(event) => setSpeed(event.target.value)}
              disabled={solveFor === "speed"}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Distance (NM)</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="e.g. 90"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
              disabled={solveFor === "distance"}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Time (hr)</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="e.g. 1:30"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              disabled={solveFor === "time"}
            />
          </div>
        </div>

        <div className="display-panel px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {triangleResult ? triangleResult.label : "Result"}
          </div>
          <div className="mt-2 text-lg font-semibold text-foreground font-mono">
            {triangleResult ? `${formatNumber(triangleResult.value)} ${triangleResult.unit}` : "—"}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Wind Components</h2>
          <p className="text-xs text-muted-foreground">
            Headwind/tailwind and crosswind for a given runway heading.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Runway heading (°)</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="e.g. 270"
              value={runwayHeading}
              onChange={(event) => setRunwayHeading(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Wind direction (°)</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="e.g. 240"
              value={windDirection}
              onChange={(event) => setWindDirection(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Wind speed (kt)</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="e.g. 15"
              value={windSpeed}
              onChange={(event) => setWindSpeed(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Gust (kt, optional)</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="e.g. 22"
              value={windGust}
              onChange={(event) => setWindGust(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="display-panel px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{headwindLabel}</div>
            <div className="mt-2 text-lg font-semibold text-foreground font-mono">
              {windResult ? `${formatNumber(Math.abs(windResult.headwind))} kt` : "—"}
            </div>
            {windResult?.gustHeadwind !== null && windResult?.gustHeadwind !== undefined && (
              <div className="text-xs text-muted-foreground mt-1">
                Gust: {formatNumber(Math.abs(windResult.gustHeadwind))} kt
              </div>
            )}
          </div>
          <div className="display-panel px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{crosswindLabel}</div>
            <div className="mt-2 text-lg font-semibold text-foreground font-mono">
              {windResult ? `${formatNumber(Math.abs(windResult.crosswind))} kt` : "—"}
            </div>
            {windResult?.gustCrosswind !== null && windResult?.gustCrosswind !== undefined && (
              <div className="text-xs text-muted-foreground mt-1">
                Gust: {formatNumber(Math.abs(windResult.gustCrosswind))} kt
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Angle difference: {windResult ? `${formatNumber(Math.abs(windResult.delta), 0)}°` : "—"}
        </div>
      </section>
    </div>
  );
}

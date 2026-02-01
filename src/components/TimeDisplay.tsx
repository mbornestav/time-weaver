import { formatTime, formatTimeDecimalHours, formatTimeDecimalTenths } from "@/lib/timeParser";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TimeDisplayProps {
  totalMinutes: number;
  mode: "hhmm" | "decimalExact" | "decimalTenths";
  onModeChange: (mode: "hhmm" | "decimalExact" | "decimalTenths") => void;
}

export function TimeDisplay({ totalMinutes, mode, onModeChange }: TimeDisplayProps) {
  const isNegative = totalMinutes < 0;
  const primaryValue =
    mode === "hhmm"
      ? formatTime(totalMinutes)
      : mode === "decimalTenths"
        ? formatTimeDecimalTenths(totalMinutes)
        : formatTimeDecimalHours(totalMinutes);
  const secondaryValue = [
    `HH:MM ${formatTime(totalMinutes)}`,
    `Decimal (N.NN) ${formatTimeDecimalHours(totalMinutes)}`,
    `Decimal (N.N) ${formatTimeDecimalTenths(totalMinutes)}`,
  ]
    .filter((label) => {
      if (mode === "hhmm") return !label.startsWith("HH:MM");
      if (mode === "decimalExact") return !label.startsWith("Decimal (N.NN)");
      return !label.startsWith("Decimal (N.N)");
    })
    .join(" | ");
  
  return (
    <div className="display-panel p-6 md:p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Result
        </div>
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => value && onModeChange(value as "hhmm" | "decimalExact" | "decimalTenths")}
          className="flex flex-wrap"
          aria-label="Select time format"
        >
          <ToggleGroupItem value="hhmm" size="sm">
            HH:MM
          </ToggleGroupItem>
          <ToggleGroupItem value="decimalTenths" size="sm">
            Decimal (N.N)
          </ToggleGroupItem>
          <ToggleGroupItem value="decimalExact" size="sm">
            Decimal (N.NN)
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground max-w-xs">
          <p>
            Aviation time can be shown as exact decimal hours (minutes / 60) or rounded to tenths
            of an hour (6-minute blocks).
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                aria-label="How tenths rounding works"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Decimal tenths rounds to the nearest 0.1 hour (6 minutes). Example: 1:02 → 1.0,
                1:04 → 1.1, 1:08 → 1.1, 1:11 → 1.2.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div 
        className={`font-mono text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ${
          isNegative ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {primaryValue}
      </div>
      <div className="text-sm text-muted-foreground mt-3 font-medium">
        {secondaryValue}
      </div>
    </div>
  );
}

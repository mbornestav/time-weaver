import { formatTime, formatTimeVerbose } from "@/lib/timeParser";

interface TimeDisplayProps {
  totalMinutes: number;
}

export function TimeDisplay({ totalMinutes }: TimeDisplayProps) {
  const isNegative = totalMinutes < 0;
  
  return (
    <div className="display-panel p-6 md:p-8 text-center">
      <div className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
        Result
      </div>
      <div 
        className={`font-mono text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ${
          isNegative ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {formatTime(totalMinutes)}
      </div>
      <div className="text-sm text-muted-foreground mt-3 font-medium">
        {formatTimeVerbose(totalMinutes)}
      </div>
    </div>
  );
}

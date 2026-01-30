import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeInput({ value, onChange }: TimeInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Expression
      </label>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="e.g., 1+1:30+0:25+:45"
        className="font-mono text-lg h-14 px-4 bg-card border-border focus-visible:ring-primary"
      />
      <p className="text-xs text-muted-foreground">
        Use <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">1:30</code> for 1h 30m, 
        <code className="bg-muted px-1.5 py-0.5 rounded text-foreground ml-1">:45</code> for 45m, 
        <code className="bg-muted px-1.5 py-0.5 rounded text-foreground ml-1">2</code> for 2h
      </p>
    </div>
  );
}

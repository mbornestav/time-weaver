import { useState, useEffect, useCallback } from "react";
import { TimeDisplay } from "./TimeDisplay";
import { TimeInput } from "./TimeInput";
import { TimeControls } from "./TimeControls";
import { parseTimeString } from "@/lib/timeParser";
import { Clock } from "lucide-react";

export function TimeCalculator() {
  const [inputValue, setInputValue] = useState("");
  const [manualMinutes, setManualMinutes] = useState(0);
  
  const parsedTime = parseTimeString(inputValue);
  const totalMinutes = parsedTime.totalMinutes + manualMinutes;

  const handleAddHours = useCallback((hours: number) => {
    setManualMinutes(prev => prev + hours * 60);
  }, []);

  const handleAddMinutes = useCallback((minutes: number) => {
    setManualMinutes(prev => prev + minutes);
  }, []);

  const handleReset = useCallback(() => {
    setInputValue("");
    setManualMinutes(0);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Time Calculator
          </h1>
          <p className="text-muted-foreground mt-2">
            Add and subtract hours & minutes
          </p>
        </div>

        {/* Main card */}
        <div className="main-card bg-card rounded-2xl border border-border p-6 space-y-6">
          {/* Display */}
          <TimeDisplay totalMinutes={totalMinutes} />

          {/* Input */}
          <TimeInput value={inputValue} onChange={handleInputChange} />

          {/* Controls */}
          <TimeControls
            onAddHours={handleAddHours}
            onAddMinutes={handleAddMinutes}
            onReset={handleReset}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Tip: Try entering <code className="bg-muted px-1.5 py-0.5 rounded">1+1:30+:45-0:15</code>
        </p>
      </div>
    </div>
  );
}

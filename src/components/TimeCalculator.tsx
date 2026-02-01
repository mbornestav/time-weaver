import { useState, useEffect, useCallback, useRef } from "react";
import { TimeDisplay } from "./TimeDisplay";
import { TimeInput } from "./TimeInput";
import { TimeControls } from "./TimeControls";
import { formatTime, formatTimeDecimalHours, formatTimeDecimalTenths, parseTimeString } from "@/lib/timeParser";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type DisplayMode = "hhmm" | "decimalExact" | "decimalTenths";

interface HistoryEntry {
  id: string;
  expression: string;
  manualMinutes: number;
  totalMinutes: number;
}

export function TimeCalculator() {
  const [inputValue, setInputValue] = useState("");
  const [manualMinutes, setManualMinutes] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("hhmm");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const lastEntryRef = useRef<HistoryEntry | null>(null);
  const debounceRef = useRef<number | undefined>(undefined);
  
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

  const handleHistorySelect = useCallback((entry: HistoryEntry) => {
    setInputValue(entry.expression);
    setManualMinutes(entry.manualMinutes);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    lastEntryRef.current = null;
  }, []);

  useEffect(() => {
    if (!inputValue.trim() && manualMinutes === 0) {
      return;
    }

    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      expression: inputValue.trim(),
      manualMinutes,
      totalMinutes,
    };

    if (
      lastEntryRef.current &&
      lastEntryRef.current.expression === entry.expression &&
      lastEntryRef.current.totalMinutes === entry.totalMinutes
    ) {
      return;
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setHistory((prev) => [entry, ...prev].slice(0, 10));
      lastEntryRef.current = entry;
    }, 400);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, manualMinutes, totalMinutes]);

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
          <TimeDisplay
            totalMinutes={totalMinutes}
            mode={displayMode}
            onModeChange={setDisplayMode}
          />

          {/* Input */}
          <TimeInput value={inputValue} onChange={handleInputChange} />

          {/* Controls */}
          <TimeControls
            onAddHours={handleAddHours}
            onAddMinutes={handleAddMinutes}
            onReset={handleReset}
          />

          {/* History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                History
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                disabled={history.length === 0}
              >
                Clear
              </Button>
            </div>
            <ScrollArea className="h-40 rounded-lg border border-border">
              {history.length === 0 ? (
                <div className="p-4 text-xs text-muted-foreground">
                  No history yet. Entries appear automatically as you type or adjust time.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {history.map((entry) => {
                    const expressionLabel = entry.expression || "Manual adjustments";
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        className="w-full text-left p-3 hover:bg-muted/60 transition-colors"
                        onClick={() => handleHistorySelect(entry)}
                      >
                        <div className="text-sm font-medium text-foreground">
                          {expressionLabel}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTime(entry.totalMinutes)} | {formatTimeDecimalHours(entry.totalMinutes)} | {formatTimeDecimalTenths(entry.totalMinutes)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Tip: Try entering <code className="bg-muted px-1.5 py-0.5 rounded">1+1:30+:45-0:15</code>
        </p>
      </div>
    </div>
  );
}

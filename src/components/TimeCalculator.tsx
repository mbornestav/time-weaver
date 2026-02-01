import { useState, useEffect, useCallback, useRef } from "react";
import { TimeDisplay } from "./TimeDisplay";
import { TimeInput } from "./TimeInput";
import { TimeControls } from "./TimeControls";
import { KnotsConverter } from "./KnotsConverter";
import { NavTools } from "./NavTools";
import { ConversionTools } from "./ConversionTools";
import { formatTime, formatTimeDecimalHours, formatTimeDecimalTenths, parseTimeString } from "@/lib/timeParser";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"time" | "speed" | "nav" | "convert">("time");
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
    <div className="min-h-[100svh] bg-background flex items-center justify-center px-3 py-3 sm:px-4 md:p-6">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-5 md:mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Aviation Calculator
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {activeTab === "time" && "Add and subtract hours & minutes"}
            {activeTab === "speed" && "Convert knots to common speed units"}
            {activeTab === "nav" && "Navigation tools for speed, time, distance, and wind"}
            {activeTab === "convert" && "Quick aviation unit conversions"}
          </p>
        </div>

        {/* Main card */}
        <div className="main-card bg-card rounded-2xl border border-border p-4 sm:p-5 md:p-6">
          <Tabs
            defaultValue="time"
            className="space-y-4 sm:space-y-5 md:space-y-6"
            onValueChange={(value) =>
              setActiveTab(value as "time" | "speed" | "nav" | "convert")
            }
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="time">Time</TabsTrigger>
              <TabsTrigger value="speed">Speed</TabsTrigger>
              <TabsTrigger value="nav">Nav</TabsTrigger>
              <TabsTrigger value="convert">Convert</TabsTrigger>
            </TabsList>

            <TabsContent value="time" className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Display */}
              <TimeDisplay
                totalMinutes={totalMinutes}
                mode={displayMode}
                onModeChange={setDisplayMode}
              />

              {/* Input */}
              <div className="text-sm sm:text-base">
                <TimeInput value={inputValue} onChange={handleInputChange} />
              </div>

              {/* Controls */}
              <div className="scale-[0.95] sm:scale-100 origin-top">
                <TimeControls
                  onAddHours={handleAddHours}
                  onAddMinutes={handleAddMinutes}
                  onReset={handleReset}
                />
              </div>

              {/* History */}
              <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    History
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearHistory}
                      disabled={history.length === 0}
                    >
                      Clear
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        {isHistoryOpen ? "Hide" : "Show"} ({history.length})
                        <ChevronDown className={`h-4 w-4 transition-transform ${isHistoryOpen ? "rotate-180" : ""}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <ScrollArea className="max-h-[22svh] sm:max-h-[25svh] rounded-lg border border-border">
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
                </CollapsibleContent>
              </Collapsible>

              <p className="text-center text-xs text-muted-foreground">
                Tip: Try entering <code className="bg-muted px-1.5 py-0.5 rounded">1+1:30+:45-0:15</code>
              </p>
            </TabsContent>

            <TabsContent value="speed">
              <KnotsConverter />
            </TabsContent>

            <TabsContent value="nav">
              <NavTools />
            </TabsContent>

            <TabsContent value="convert">
              <ConversionTools />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

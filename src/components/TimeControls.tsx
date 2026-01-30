import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";

interface TimeControlsProps {
  onAddHours: (hours: number) => void;
  onAddMinutes: (minutes: number) => void;
  onReset: () => void;
}

export function TimeControls({ onAddHours, onAddMinutes, onReset }: TimeControlsProps) {
  return (
    <div className="space-y-4">
      {/* Hours controls */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Hours
        </label>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 calc-button h-12"
            onClick={() => onAddHours(-1)}
          >
            <Minus className="h-4 w-4 mr-1" />
            1h
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 calc-button h-12"
            onClick={() => onAddHours(1)}
          >
            <Plus className="h-4 w-4 mr-1" />
            1h
          </Button>
        </div>
      </div>

      {/* Minutes controls */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Minutes
        </label>
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="secondary"
            className="calc-button h-11"
            onClick={() => onAddMinutes(-15)}
          >
            <Minus className="h-3 w-3 mr-0.5" />
            15
          </Button>
          <Button
            variant="secondary"
            className="calc-button h-11"
            onClick={() => onAddMinutes(-5)}
          >
            <Minus className="h-3 w-3 mr-0.5" />
            5
          </Button>
          <Button
            variant="secondary"
            className="calc-button h-11"
            onClick={() => onAddMinutes(5)}
          >
            <Plus className="h-3 w-3 mr-0.5" />
            5
          </Button>
          <Button
            variant="secondary"
            className="calc-button h-11"
            onClick={() => onAddMinutes(15)}
          >
            <Plus className="h-3 w-3 mr-0.5" />
            15
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="secondary"
            className="calc-button h-11"
            onClick={() => onAddMinutes(-30)}
          >
            <Minus className="h-3 w-3 mr-0.5" />
            30
          </Button>
          <Button
            variant="secondary"
            className="calc-button h-11"
            onClick={() => onAddMinutes(-1)}
          >
            <Minus className="h-3 w-3 mr-0.5" />
            1
          </Button>
          <Button
            variant="secondary"
            className="calc-button h-11"
            onClick={() => onAddMinutes(1)}
          >
            <Plus className="h-3 w-3 mr-0.5" />
            1
          </Button>
          <Button
            variant="secondary"
            className="calc-button h-11"
            onClick={() => onAddMinutes(30)}
          >
            <Plus className="h-3 w-3 mr-0.5" />
            30
          </Button>
        </div>
      </div>

      {/* Reset button */}
      <Button
        variant="outline"
        className="w-full h-12 calc-button mt-2"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
}

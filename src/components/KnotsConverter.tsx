import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const KNOT_TO_MPS = 0.514444;
const KNOT_TO_MPH = 1.150779;
const KNOT_TO_KPH = 1.852;

type SpeedField = "knots" | "mps" | "mph" | "kph";

const formatValue = (value: number) =>
  value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatActiveValue = (value: number) =>
  value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const parseValue = (value: string) => {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return null;
  }
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const fieldMeta: Array<{ field: SpeedField; label: string }> = [
  { field: "knots", label: "Knots" },
  { field: "mps", label: "m/s" },
  { field: "mph", label: "mph" },
  { field: "kph", label: "kph" },
];

export function KnotsConverter() {
  const [values, setValues] = useState<Record<SpeedField, string>>({
    knots: "",
    mps: "",
    mph: "",
    kph: "",
  });
  const [activeField, setActiveField] = useState<SpeedField>("knots");

  const updateAllFields = (knotsValue: number | null, active?: SpeedField, raw?: string) => {
    setValues((prev) => {
      const next = { ...prev };
      if (knotsValue === null) {
        (Object.keys(next) as SpeedField[]).forEach((field) => {
          next[field] = "";
        });
        if (active) {
          next[active] = raw ?? "";
        }
        return next;
      }

      next.knots = formatValue(knotsValue);
      next.mps = formatValue(knotsValue * KNOT_TO_MPS);
      next.mph = formatValue(knotsValue * KNOT_TO_MPH);
      next.kph = formatValue(knotsValue * KNOT_TO_KPH);
      if (active) {
        next[active] = raw ?? next[active];
      }
      return next;
    });
  };

  const handleFieldChange = (field: SpeedField, raw: string) => {
    setActiveField(field);
    const parsed = parseValue(raw);
    if (parsed === null) {
      updateAllFields(null, field, raw);
      return;
    }

    let knotsValue = parsed;
    if (field === "mps") {
      knotsValue = parsed / KNOT_TO_MPS;
    } else if (field === "mph") {
      knotsValue = parsed / KNOT_TO_MPH;
    } else if (field === "kph") {
      knotsValue = parsed / KNOT_TO_KPH;
    }

    updateAllFields(knotsValue, field, raw);
  };

  const handleFieldFocus = (field: SpeedField) => {
    setActiveField(field);
    setValues((prev) => {
      const next = { ...prev };
      (Object.keys(next) as SpeedField[]).forEach((key) => {
        next[key] = "";
      });
      return next;
    });
  };

  const handleFieldBlur = (field: SpeedField) => {
    const parsed = parseValue(values[field]);
    if (parsed === null) return;
    setValues((prev) => ({ ...prev, [field]: formatActiveValue(parsed) }));
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {fieldMeta.map(({ field, label }) => {
          const id = `${field}-input`;
          return (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor={id}>
                {label}
              </label>
              <Input
                id={id}
                inputMode="decimal"
                className="h-14 rounded-xl text-lg text-center"
                placeholder={`Enter ${label.toLowerCase()}`}
                value={values[field]}
                onChange={(event) => handleFieldChange(field, event.target.value)}
                onFocus={() => handleFieldFocus(field)}
                onBlur={() => handleFieldBlur(field)}
              />
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        onClick={() => handleFieldChange(activeField, "")}
      >
        Clear
      </Button>

      <div className="text-xs text-muted-foreground">
        1 knot = 0.514444 m/s = 1.150779 mph = 1.852 kph
      </div>
    </div>
  );
}

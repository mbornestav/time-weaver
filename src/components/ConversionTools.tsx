import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DistanceField = "nm" | "km" | "sm";
type AltitudeField = "ft" | "m";
type WeightField = "lb" | "kg";
type FuelField = "l" | "gal";

const NM_TO_M = 1852;
const KM_TO_M = 1000;
const SM_TO_M = 1609.344;
const FT_TO_M = 0.3048;
const LB_TO_KG = 0.45359237;
const GAL_TO_L = 3.785411784;

const formatValue = (value: number, digits = 2) =>
  value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });

const formatActiveValue = (value: number) =>
  value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const parseValue = (value: string) => {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export function ConversionTools() {
  const [distance, setDistance] = useState<Record<DistanceField, string>>({
    nm: "",
    km: "",
    sm: "",
  });
  const [altitude, setAltitude] = useState<Record<AltitudeField, string>>({
    ft: "",
    m: "",
  });
  const [weight, setWeight] = useState<Record<WeightField, string>>({
    lb: "",
    kg: "",
  });
  const [fuel, setFuel] = useState<Record<FuelField, string>>({
    l: "",
    gal: "",
  });

  const updateDistance = (field: DistanceField, raw: string) => {
    const parsed = parseValue(raw);
    if (parsed === null) {
      setDistance((prev) => ({ ...prev, [field]: raw }));
      return;
    }

    const meters =
      field === "nm" ? parsed * NM_TO_M : field === "km" ? parsed * KM_TO_M : parsed * SM_TO_M;

    setDistance({
      nm: field === "nm" ? raw : formatValue(meters / NM_TO_M),
      km: field === "km" ? raw : formatValue(meters / KM_TO_M),
      sm: field === "sm" ? raw : formatValue(meters / SM_TO_M),
    });
  };

  const updateAltitude = (field: AltitudeField, raw: string) => {
    const parsed = parseValue(raw);
    if (parsed === null) {
      setAltitude((prev) => ({ ...prev, [field]: raw }));
      return;
    }

    const meters = field === "ft" ? parsed * FT_TO_M : parsed;
    setAltitude({
      ft: field === "ft" ? raw : formatValue(meters / FT_TO_M),
      m: field === "m" ? raw : formatValue(meters),
    });
  };

  const updateWeight = (field: WeightField, raw: string) => {
    const parsed = parseValue(raw);
    if (parsed === null) {
      setWeight((prev) => ({ ...prev, [field]: raw }));
      return;
    }

    const kilograms = field === "lb" ? parsed * LB_TO_KG : parsed;
    setWeight({
      lb: field === "lb" ? raw : formatValue(kilograms / LB_TO_KG),
      kg: field === "kg" ? raw : formatValue(kilograms),
    });
  };

  const updateFuel = (field: FuelField, raw: string) => {
    const parsed = parseValue(raw);
    if (parsed === null) {
      setFuel((prev) => ({ ...prev, [field]: raw }));
      return;
    }

    const liters = field === "gal" ? parsed * GAL_TO_L : parsed;
    setFuel({
      l: field === "l" ? raw : formatValue(liters),
      gal: field === "gal" ? raw : formatValue(liters / GAL_TO_L),
    });
  };

  const handleDistanceBlur = (field: DistanceField) => {
    const parsed = parseValue(distance[field]);
    if (parsed === null) return;
    setDistance((prev) => ({ ...prev, [field]: formatActiveValue(parsed) }));
  };

  const handleAltitudeBlur = (field: AltitudeField) => {
    const parsed = parseValue(altitude[field]);
    if (parsed === null) return;
    setAltitude((prev) => ({ ...prev, [field]: formatActiveValue(parsed) }));
  };

  const handleWeightBlur = (field: WeightField) => {
    const parsed = parseValue(weight[field]);
    if (parsed === null) return;
    setWeight((prev) => ({ ...prev, [field]: formatActiveValue(parsed) }));
  };

  const handleFuelBlur = (field: FuelField) => {
    const parsed = parseValue(fuel[field]);
    if (parsed === null) return;
    setFuel((prev) => ({ ...prev, [field]: formatActiveValue(parsed) }));
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Distance</h2>
          <p className="text-xs text-muted-foreground">Nautical miles, kilometers, and statute miles.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">NM</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={distance.nm}
              onChange={(event) => updateDistance("nm", event.target.value)}
              onBlur={() => handleDistanceBlur("nm")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">km</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={distance.km}
              onChange={(event) => updateDistance("km", event.target.value)}
              onBlur={() => handleDistanceBlur("km")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">mi</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={distance.sm}
              onChange={(event) => updateDistance("sm", event.target.value)}
              onBlur={() => handleDistanceBlur("sm")}
            />
          </div>
        </div>
        <Button type="button" variant="outline" className="h-10 w-full" onClick={() => setDistance({ nm: "", km: "", sm: "" })}>
          Clear distance
        </Button>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Altitude</h2>
          <p className="text-xs text-muted-foreground">Feet and meters.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">ft</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={altitude.ft}
              onChange={(event) => updateAltitude("ft", event.target.value)}
              onBlur={() => handleAltitudeBlur("ft")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">m</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={altitude.m}
              onChange={(event) => updateAltitude("m", event.target.value)}
              onBlur={() => handleAltitudeBlur("m")}
            />
          </div>
        </div>
        <Button type="button" variant="outline" className="h-10 w-full" onClick={() => setAltitude({ ft: "", m: "" })}>
          Clear altitude
        </Button>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Weight</h2>
          <p className="text-xs text-muted-foreground">Pounds and kilograms.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">lb</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={weight.lb}
              onChange={(event) => updateWeight("lb", event.target.value)}
              onBlur={() => handleWeightBlur("lb")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">kg</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={weight.kg}
              onChange={(event) => updateWeight("kg", event.target.value)}
              onBlur={() => handleWeightBlur("kg")}
            />
          </div>
        </div>
        <Button type="button" variant="outline" className="h-10 w-full" onClick={() => setWeight({ lb: "", kg: "" })}>
          Clear weight
        </Button>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Fuel</h2>
          <p className="text-xs text-muted-foreground">Liters and US gallons.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">L</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={fuel.l}
              onChange={(event) => updateFuel("l", event.target.value)}
              onBlur={() => handleFuelBlur("l")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">gal</label>
            <Input
              inputMode="decimal"
              className="h-12 rounded-xl text-lg text-center"
              placeholder="0.00"
              value={fuel.gal}
              onChange={(event) => updateFuel("gal", event.target.value)}
              onBlur={() => handleFuelBlur("gal")}
            />
          </div>
        </div>
        <Button type="button" variant="outline" className="h-10 w-full" onClick={() => setFuel({ l: "", gal: "" })}>
          Clear fuel
        </Button>
      </section>
    </div>
  );
}

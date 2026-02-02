import { describe, expect, it } from "vitest";
import { formatTime, formatTimeVerbose } from "@/lib/timeParser";

describe("formatTime rounding", () => {
  it("rounds to the nearest minute and carries into hours", () => {
    expect(formatTime(59.6)).toBe("1:00");
    expect(formatTime(59.4)).toBe("0:59");
  });

  it("handles negative values consistently", () => {
    expect(formatTime(-59.6)).toBe("-1:00");
  });
});

describe("formatTimeVerbose rounding", () => {
  it("avoids minute overflow after rounding", () => {
    expect(formatTimeVerbose(59.6)).toBe("1 hour");
    expect(formatTimeVerbose(119.6)).toBe("2 hours");
  });
});

import { describe, expect, it } from "vitest";
import { formatTime, formatTimeVerbose, parseDurationHours, parseTimeString } from "@/lib/timeParser";

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

describe("parseTimeString validation", () => {
  it("parses mixed expression formats", () => {
    const result = parseTimeString("1+1:30+:45-0:15");
    expect(result.totalMinutes).toBe(180);
    expect(result.isValid).toBe(true);
  });

  it("handles repeated operators without lossy normalization", () => {
    const result = parseTimeString("1---2");
    expect(result.totalMinutes).toBe(-60);
    expect(result.isValid).toBe(true);
  });

  it("rejects malformed token text instead of truncating", () => {
    const result = parseTimeString("1:3O+1O");
    expect(result.totalMinutes).toBe(0);
    expect(result.isValid).toBe(false);
  });

  it("rejects out-of-range minute fields", () => {
    const result = parseTimeString("1:75");
    expect(result.totalMinutes).toBe(0);
    expect(result.isValid).toBe(false);
  });
});

describe("parseDurationHours", () => {
  it("accepts HH:MM and :MM inputs", () => {
    expect(parseDurationHours("1:30")).toBe(1.5);
    expect(parseDurationHours(":30")).toBe(0.5);
  });

  it("rejects malformed inputs", () => {
    expect(parseDurationHours("1:75")).toBeNull();
    expect(parseDurationHours("1:3O")).toBeNull();
  });
});

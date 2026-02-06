import { describe, it, expect } from "vitest";
import { parseTimeString } from "@/lib/timeParser";

describe("example", () => {
  it("parses a basic hour expression", () => {
    expect(parseTimeString("2").totalMinutes).toBe(120);
  });
});

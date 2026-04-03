import { describe, expect, test } from "bun:test";
import formatTime from "../src/utils/format-time";

describe("formatTime", () => {
  test("formats zero correctly", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  test("pads single digit minutes and seconds", () => {
    expect(formatTime(65)).toBe("01:05");
  });

  test("floors fractional seconds", () => {
    expect(formatTime(125.9)).toBe("02:05");
  });

  test("handles values above one hour as total minutes", () => {
    expect(formatTime(3605)).toBe("60:05");
  });
});

import { describe, expect, test } from "bun:test";
import extractYouTubeDetails from "../src/utils/extract-id";

describe("extractYouTubeDetails", () => {
  test("extracts ids from watch urls", () => {
    expect(extractYouTubeDetails("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  test("extracts ids from short urls", () => {
    expect(extractYouTubeDetails("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  test("extracts ids from shorts urls", () => {
    expect(extractYouTubeDetails("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  test("extracts ids from embed urls", () => {
    expect(extractYouTubeDetails("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  test("rejects non-youtube domains", () => {
    expect(extractYouTubeDetails("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
  });

  test("returns null for invalid urls", () => {
    expect(extractYouTubeDetails("not a url")).toBeNull();
  });
});

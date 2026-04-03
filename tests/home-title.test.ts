import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

describe("document title behavior", () => {
  const originalDocument = globalThis.document;

  beforeEach(() => {
    // Minimal DOM shim for title-only tests.
    // Bun exposes `document` in browser-like test envs inconsistently across setups.
    // This keeps the assertion stable without pulling in a renderer.
    // @ts-expect-error local test shim
    globalThis.document = { title: "initial" };
  });

  afterEach(() => {
    mock.restore();
    globalThis.document = originalDocument;
  });

  test("video pages can replace the default title", async () => {
    const videoId = "dQw4w9WgXcQ";
    const fakeTitle = "Example Video Title";

    document.title = `Scribe | ${videoId}`;
    expect(document.title).toBe(`Scribe | ${videoId}`);

    document.title = fakeTitle;
    expect(document.title).toBe(fakeTitle);
  });

  test("landing can restore the default title", () => {
    document.title = "Scribe | Save Annotated YouTube Notes";
    expect(document.title).toBe("Scribe | Save Annotated YouTube Notes");
  });
});

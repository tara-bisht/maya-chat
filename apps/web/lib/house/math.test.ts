import { describe, expect, it } from "vitest";
import { normalizeMathMarkdown } from "./math";

describe("normalizeMathMarkdown", () => {
  it("leaves single-dollar inline math alone", () => {
    const source = "The convective term $(\\mathbf{u} \\cdot \\nabla)\\mathbf{u}$.";
    expect(normalizeMathMarkdown(source)).toBe(source);
  });

  it("promotes $$...$$ to a display fence so KaTeX uses display mode", () => {
    expect(normalizeMathMarkdown("$$u(t+\\Delta t) \\sim u(t)$$").trim()).toBe(
      "$$\nu(t+\\Delta t) \\sim u(t)\n$$",
    );
    expect(
      normalizeMathMarkdown("See\n$$\nE = mc^2\n$$\nnext.").trim(),
    ).toBe("See\n\n$$\nE = mc^2\n$$\n\nnext.");
  });

  it("converts \\[ \\] display and \\( \\) inline delimiters", () => {
    expect(normalizeMathMarkdown("Force: \\(F = ma\\).")).toBe("Force: $F = ma$.");
    expect(normalizeMathMarkdown("See\n\\[E = mc^2\\]\nnext.").trim()).toBe(
      "See\n\n$$\nE = mc^2\n$$\n\nnext.",
    );
  });

  it("unwraps mixed dollar-plus-escaped-paren delimiters", () => {
    expect(
      normalizeMathMarkdown("The Culprit: $\\(\\mathbf{u} \\cdot \\nabla)\\mathbf{u}\\)$"),
    ).toBe("The Culprit: $(\\mathbf{u} \\cdot \\nabla)\\mathbf{u})$");
    expect(normalizeMathMarkdown("$$\\[a^2 + b^2 = c^2\\]$$").trim()).toBe(
      "$$\na^2 + b^2 = c^2\n$$",
    );
  });

  it("treats $\\( as an escaped grouping paren when the closer is missing", () => {
    expect(
      normalizeMathMarkdown("The Culprit: $\\(\\mathbf{u} \\cdot \\nabla)\\mathbf{u}$"),
    ).toBe("The Culprit: $(\\mathbf{u} \\cdot \\nabla)\\mathbf{u}$");
  });

  it("does not rewrite math-looking text inside code", () => {
    const fenced = "Use `$x^2$` and:\n\n```\n\\[E = mc^2\\]\n```\n";
    expect(normalizeMathMarkdown(fenced)).toBe(fenced);
  });
});

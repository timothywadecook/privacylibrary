// Parser tests for generate-rules.mjs. Run with: node --test
//
// The rule text contains parentheses, slashes, em-dashes, inline links, and
// (rarely) escaped pipes. A naive `line.split("|")` mangles those silently
// rather than failing, so these fixtures pin the exact behavior on the rows
// most likely to break — including the two the review flagged (Sovereign S-3
// and BR-5) plus a synthetic row with an inline link and an escaped pipe.

import test from "node:test";
import assert from "node:assert/strict";
import { splitRow, parseRuleTable } from "./generate-rules.mjs";

test("splitRow trims cells and drops the leading/trailing pipe", () => {
  assert.deepEqual(splitRow("| S-1 | some rule | Proposed | — |"), [
    "S-1",
    "some rule",
    "Proposed",
    "—",
  ]);
});

test("splitRow preserves escaped pipes inside a cell", () => {
  assert.deepEqual(splitRow("| X-1 | a \\| b | Proposed | — |"), [
    "X-1",
    "a | b",
    "Proposed",
    "—",
  ]);
});

test("parseRuleTable handles the flagged rows and link/verification content", () => {
  const section = `
| # | Rule | Status | Verification |
|---|---|---|---|
| S-3 | All software dependencies are open-source with inspectable source code | Proposed | — |
| BR-5 | Where any capture is persisted or transmitted off-device, bystander faces and identifying speech are redacted (blurred / muted) on-device before it leaves the device | Proposed | — |
| Z-1 | See the [pattern](../foo/bar.md) for redaction, and note a \\| b | Accepted | Audit the output |
`;
  const rules = parseRuleTable(section, "demo");
  assert.equal(rules.length, 3, "three data rows (header + separator skipped)");

  const s3 = rules.find((r) => r.id === "S-3");
  assert.equal(s3.text, "All software dependencies are open-source with inspectable source code");
  assert.equal(s3.status, "Proposed");
  assert.equal(s3.verification, null, "em-dash cell becomes null");

  const br5 = rules.find((r) => r.id === "BR-5");
  assert.match(br5.text, /\(blurred \/ muted\)/, "parentheses and slash preserved");
  assert.ok(!br5.text.includes("|"), "no stray pipe leaked into the text");

  const z1 = rules.find((r) => r.id === "Z-1");
  assert.match(z1.text, /\[pattern\]\(\.\.\/foo\/bar\.md\)/, "inline link preserved");
  assert.match(z1.text, /a \| b/, "escaped pipe restored inside text");
  assert.equal(z1.verification, "Audit the output", "populated verification is kept");
  assert.equal(z1.status, "Accepted");
});

test("parseRuleTable ignores non-rule rows", () => {
  const section = `
Some prose.
| # | Rule | Status | Verification |
|---|---|---|---|
| E-1 | No user content persists | Proposed | — |
More prose, not a table.
`;
  const rules = parseRuleTable(section, "ephemeral");
  assert.equal(rules.length, 1);
  assert.equal(rules[0].id, "E-1");
});

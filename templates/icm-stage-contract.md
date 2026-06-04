# Stage NN: Stage Name

Use this only when the workflow is sequential, repeatable across runs, and improved by human review gates.

## Purpose

One job only.

## Inputs

- Layer 4 working: `../previous_stage/output/file.md`
- Layer 3 reference: `../../_config/rules.md`

Use exact paths. If a file is large, name the relevant section.

## Process

Describe the transformation this stage performs.

Keep this short. The stage contract is an execution contract, not an essay.

## Outputs

- `output-file.md` -> `output/`

## Human Review Gate

Before the next stage runs, a human should review and optionally edit the output.

Continue only when:

- required inputs were checked
- unsupported claims are labelled
- output matches the stage purpose
- blockers are visible

## Verify

- Check this output against the previous stage for alignment.
- Check claims against sources or references.
- Flag discrepancies before final handoff.


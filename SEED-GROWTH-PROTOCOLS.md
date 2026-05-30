# 🌱 Seed Growth Protocols

**Mycelial Nursery — How Seeds Become Living Parts of the System**

This document defines the standardized process for taking raw ideas (seeds) through stages of growth until they become mature, integrated modules.

## Growth Stages

| Stage       | Name            | Description                                      | Duration     | Exit Criteria |
|-------------|-----------------|--------------------------------------------------|--------------|---------------|
| 0           | **Seed**        | Raw idea, note, sketch, or inspiration           | 1–7 days     | Clear enough to describe in 1–2 sentences |
| 1           | **Sprout**      | Basic research, rough outline, initial experiments | 1–2 weeks    | Has a dedicated folder + README |
| 2           | **Sapling**     | Working prototype, core functionality exists     | 2–6 weeks    | Usable by at least one caretaker |
| 3           | **Young Tree**  | Polished, documented, tested, integrated         | 1–3 months   | Used in production workflows |
| 4           | **Mature Tree** | Fully evolved, maintained, contributes to ecosystem | Ongoing     | Has caretaker ownership + health checks |

## Growth Protocol Steps

### Phase 0 → Seed
1. Drop idea into `nursery/seeds/`
2. Create a file named `SEED-[short-name].md`
3. Include:
   - One-sentence description
   - Potential impact / connections
   - Suggested caretaker (Willey / Trillian / Oscar)

### Phase 1 → Sprout
1. Move to `nursery/sprouts/` (or keep in seeds with tag)
2. Create dedicated folder: `sprouts/[name]/`
3. Required files:
   - `README.md` (purpose, goals)
   - `TODO.md` or `TASKS.md`
   - Basic structure matching the idea type

### Phase 2 → Sapling
1. Move to `nursery/saplings/`
2. Must have:
   - Working code / notebook / document
   - Test or validation method
   - Integration plan with existing system
3. Assign primary caretaker

### Phase 3+ → Young Tree → Mature
1. Move to appropriate final home (asteroid/, love-shack/, BookVault/, etc.)
2. Create/update entry in `root-project/SYSTEM.md`
3. Add health monitoring via caretakers
4. Document cross-system workflows

## Decision Gates (Review Points)

At the end of each stage, ask:
- Does this still align with mycelial principles? (local-first, evolutionary, symbiotic)
- Is it adding real value or just bloat?
- Which caretaker should own the next stage?
- Should it be composted instead?

**Convene the Triad** when unsure.

## Tools & Templates

- Use `nursery/soil/templates/` for standard READMEs and structures
- Track progress in `nursery/mini-forest/growth-log.md`
- Stoned-Willey for vision checks
- Trillian for documentation quality
- Oscar for technical feasibility

## Current Priority Areas
- Activate and organize existing seeds
- Turn promising mini-forest projects into saplings
- Define missing tools/ folder in asteroid

---

**Last Updated:** 2026-05-16  
**Status:** Active Protocol — Living Document

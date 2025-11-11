# Agent Quick Reference - Story Workflow

Quick reference guide for agents working with user stories.

---

## Story Statuses

| Status | Emoji | Who Sets | When |
|--------|-------|----------|------|
| Backlog | 📋 | PM/Architect | Story created |
| In Progress | 🚧 | Dev Agent | Starting work |
| Ready to Review by QA | 🔍 | Dev Agent | Implementation complete |
| Changes Requested | ⚠️ | QA Agent | Issues found |
| Approved | ✅ | QA Agent | QA passed |
| Done | ✅ | BMAD Master | Story closed |
| Blocked | 🚫 | Any Agent | External blocker |

---

## Dev Agent Checklist

### When Starting a Story

```markdown
1. Update status in story file:
   **Status:** 🚧 In Progress

2. Add to Status History:
   | 2025-10-08 | In Progress | Dev Agent | Started implementation |

3. Begin implementation work
```

### When Completing a Story

```markdown
1. Mark all acceptance criteria:
   - [x] Criterion 1
   - [x] Criterion 2

2. Write Implementation Summary section (required):
   - Completed Date
   - Deliverables Created
   - Key Features Implemented
   - Technical Decisions
   - Next Steps for Team

3. Update status:
   **Status:** 🔍 Ready to Review by QA

4. Add to Status History:
   | 2025-10-08 | Ready to Review by QA | Dev Agent | Implementation complete - all AC met |
```

---

## QA Agent Checklist

### When Reviewing a Story

```markdown
1. Verify all acceptance criteria are met

2. Run all tests (functional, security, performance)

3. Write complete QA Review section in the story file (required):
   - Review Date, Reviewer, Status, Quality Score
   - Acceptance Criteria Verification (table)
   - Testing Results (table)
   - Deliverables Verified
   - Quality Metrics (table)
   - Key Strengths
   - Issues & Recommendations
   - Security Assessment
   - Compliance Check
   - Final Verdict
   - QA Sign-off

4. Update status:
   - If passed: **Status:** ✅ Approved
   - If failed: **Status:** ⚠️ Changes Requested

5. Add to Status History:
   | 2025-10-08 | Approved | QA Agent | QA review passed - approved for production |
   OR
   | 2025-10-08 | Changes Requested | QA Agent | 2 critical issues found - see QA Review |
```

---

## BMAD Master Checklist

### When Closing a Story

```markdown
1. Verify story is "Approved" by QA

2. Update status:
   **Status:** ✅ Done

3. Add to Status History:
   | 2025-10-08 | Done | BMAD Master | Story completed and closed |
```

---

## Important Rules

### ✅ DO:

- ✅ Update Status History table every time status changes
- ✅ Write all reviews and notes in the story file itself
- ✅ Use consistent date format (YYYY-MM-DD)
- ✅ Be thorough in documentation
- ✅ Include specific details and metrics

### ❌ DON'T:

- ❌ Create separate review documents (use story file)
- ❌ Skip the Status History table updates
- ❌ Leave sections incomplete
- ❌ Use placeholder text in completed sections
- ❌ Mark AC as complete if not actually done

---

## Quick Copy-Paste Templates

### Status History Entry (Dev Starting)
```markdown
| 2025-10-08 | In Progress | Dev Agent | Started implementation |
```

### Status History Entry (Dev Completing)
```markdown
| 2025-10-08 | Ready to Review by QA | Dev Agent | Implementation complete - all AC met |
```

### Status History Entry (QA Approving)
```markdown
| 2025-10-08 | Approved | QA Agent | QA review passed - approved for production |
```

### Status History Entry (QA Requesting Changes)
```markdown
| 2025-10-08 | Changes Requested | QA Agent | [X] critical issues found - see QA Review section |
```

### Status History Entry (Closing)
```markdown
| 2025-10-08 | Done | BMAD Master | Story completed and closed |
```

---

## File Locations

- **Story Files:** `docs/stories/US[X.Y].md`
- **Story Template:** `docs/STORY_TEMPLATE.md`
- **Full Workflow Docs:** `docs/STORY_WORKFLOW.md`
- **This Quick Reference:** `docs/AGENT_QUICK_REFERENCE.md`

---

## Example Story

See `docs/stories/US1.1.md` for a complete example of a fully implemented, reviewed, and closed story.

---

**Quick Tip:** The story file is the single source of truth. All implementation notes, QA reviews, and status updates go directly in the story file, not in separate documents.


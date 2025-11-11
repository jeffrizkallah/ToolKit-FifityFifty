# Story Workflow & Status Management

This document defines the workflow for managing user stories in the FiftyFifty Toolkit project, including status transitions, agent responsibilities, and documentation standards.

---

## Story Statuses

Stories progress through the following statuses:

```
┌─────────────────────────────────────────────────────────────────┐
│                     STORY STATUS WORKFLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. [Backlog]                Initial state                     │
│        ↓                                                        │
│  2. [In Progress]            Dev Agent working on story         │
│        ↓                                                        │
│  3. [Ready to Review by QA]  Dev complete, awaiting QA         │
│        ↓                                                        │
│  4. [Approved]               QA review passed                  │
│        ↓                                                        │
│  5. [Done]                   Story completed & closed          │
│                                                                 │
│  Alternative paths:                                             │
│  - [Changes Requested]       QA found issues → back to Dev     │
│  - [Blocked]                 Waiting on external dependencies  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Status Definitions

| Status | Description | Who Sets It | Next Actions |
|--------|-------------|-------------|--------------|
| **Backlog** | Story defined but not started | PM/Architect | Assign to dev when ready |
| **In Progress** | Development work underway | Dev Agent | Complete implementation |
| **Ready to Review by QA** | Implementation complete | Dev Agent | QA agent to review |
| **Changes Requested** | QA found issues | QA Agent | Dev to address feedback |
| **Approved** | QA review passed | QA Agent | Ready for deployment |
| **Done** | Story completed & closed | BMAD Master | Archive, move to next story |
| **Blocked** | Waiting on dependencies | Any Agent | Resolve blockers |

---

## Story File Structure

Each story file should follow this structure:

```markdown
# [Story ID]: [Story Title]

**Story ID:** [ID]  
**Epic:** [Epic ID and Name]  
**Story Points:** [Points]  
**Priority:** [High/Medium/Low]  
**Dependencies:** [List or None]  
**Status:** [Current Status with emoji]

---

## Story Status History

| Date | Status | Updated By | Notes |
|------|--------|------------|-------|
| YYYY-MM-DD | [Status] | [Agent] | [Brief note] |
| YYYY-MM-DD | [Status] | [Agent] | [Brief note] |

**Current Status:** [Status with emoji]

---

## User Story

**As a** [role]  
**I want to** [action]  
**So that** [benefit]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Implementation Summary

[Written by Dev Agent when work is complete]

**Completed Date:** YYYY-MM-DD

### Deliverables Created

1. [List of files/components created]

### Key Changes

- [Important changes made]

### Technical Decisions

- [Key technical decisions and rationale]

### Next Steps for Team

1. [Steps for team members]

## Technical Notes

- [Technical considerations]
- [Implementation notes]

---

## QA Review

[Written by QA Agent when review is complete]

**Review Date:** YYYY-MM-DD  
**Reviewed By:** QA Agent  
**Review Status:** [APPROVED/CHANGES REQUESTED]  
**Quality Score:** [X/5]

### Acceptance Criteria Verification

| # | Criteria | Status | Score | Notes |
|---|----------|--------|-------|-------|
| 1 | [Criterion] | [✅/❌] | [X/5] | [Notes] |

### Testing Results

[Test results and metrics]

### Deliverables Verified

[List of verified deliverables]

### Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| [Metric] | [%] | [%] | [✅/❌] |

### Key Strengths

✅ [Strength 1]  
✅ [Strength 2]

### Issues & Recommendations

**Critical Issues:** [Count]  
**High Priority Issues:** [Count]  
**Medium Priority Issues:** [Count]  
**Low Priority Issues:** [Count]

[Detailed findings]

### Security Assessment

[Security review results]

### Final Verdict

[APPROVED FOR PRODUCTION / CHANGES REQUESTED]

[Detailed verdict explanation]

### QA Sign-off

- **Functional Requirements:** [✅/❌]
- **Technical Requirements:** [✅/❌]
- **Security Requirements:** [✅/❌]
- **Documentation Requirements:** [✅/❌]
- **Quality Standards:** [✅/❌]

**Confidence Level:** [HIGH/MEDIUM/LOW]  
**Ready for Production:** [YES/NO]
```

---

## Agent Responsibilities

### Dev Agent (@dev.mdc)

**When Starting a Story:**
1. Update story status to "In Progress"
2. Add entry to Status History table
3. Begin implementation work

**When Completing a Story:**
1. Mark all acceptance criteria as complete `[x]`
2. Write Implementation Summary section
3. Document all deliverables created
4. Update story status to "Ready to Review by QA"
5. Add entry to Status History table with completion notes

**Example Status Update:**
```markdown
**Status:** 🔍 Ready to Review by QA

## Story Status History

| Date | Status | Updated By | Notes |
|------|--------|------------|-------|
| 2025-10-08 | In Progress | Dev Agent | Started implementation |
| 2025-10-08 | Ready to Review by QA | Dev Agent | Implementation complete - all AC met |
```

### QA Agent (@qa.mdc)

**When Reviewing a Story:**
1. Verify all acceptance criteria are met
2. Run all necessary tests
3. Write complete QA Review section in story file
4. Update story status to either:
   - "Approved" (if passed)
   - "Changes Requested" (if issues found)
5. Add entry to Status History table with review results

**Example Status Update (Approved):**
```markdown
**Status:** ✅ Approved

## Story Status History

| Date | Status | Updated By | Notes |
|------|--------|------------|-------|
| 2025-10-08 | In Progress | Dev Agent | Started implementation |
| 2025-10-08 | Ready to Review by QA | Dev Agent | Implementation complete |
| 2025-10-08 | Approved | QA Agent | QA review passed - approved for production |
```

**Example Status Update (Changes Requested):**
```markdown
**Status:** ⚠️ Changes Requested

## Story Status History

| Date | Status | Updated By | Notes |
|------|--------|------------|-------|
| 2025-10-08 | In Progress | Dev Agent | Started implementation |
| 2025-10-08 | Ready to Review by QA | Dev Agent | Implementation complete |
| 2025-10-08 | Changes Requested | QA Agent | 2 critical issues found - see QA Review section |
```

### BMAD Master (@bmad-master.mdc)

**When Closing a Story:**
1. Verify story is "Approved" by QA
2. Update story status to "Done"
3. Add final entry to Status History table
4. Archive or move story as needed

**Example Status Update:**
```markdown
**Status:** ✅ Done

## Story Status History

| Date | Status | Updated By | Notes |
|------|--------|------------|-------|
| 2025-10-08 | In Progress | Dev Agent | Started implementation |
| 2025-10-08 | Ready to Review by QA | Dev Agent | Implementation complete |
| 2025-10-08 | Approved | QA Agent | QA review passed |
| 2025-10-08 | Done | BMAD Master | Story completed and closed |
```

---

## Status Emojis

Use these emojis for quick visual status identification:

| Status | Emoji | Markdown |
|--------|-------|----------|
| Backlog | 📋 | `📋 Backlog` |
| In Progress | 🚧 | `🚧 In Progress` |
| Ready to Review by QA | 🔍 | `🔍 Ready to Review by QA` |
| Changes Requested | ⚠️ | `⚠️ Changes Requested` |
| Approved | ✅ | `✅ Approved` |
| Done | ✅ | `✅ Done` |
| Blocked | 🚫 | `🚫 Blocked` |

---

## Best Practices

### For All Agents

1. **Always update the Status History table** when changing status
2. **Include meaningful notes** in status updates
3. **Keep story files as single source of truth** - don't create separate review documents
4. **Use consistent date format** (YYYY-MM-DD)
5. **Be thorough in documentation** - future developers will read this

### For Dev Agent

1. **Write clear implementation summaries** explaining what was done and why
2. **List all deliverables** created during implementation
3. **Document technical decisions** and rationale
4. **Provide next steps** for the team
5. **Ensure all acceptance criteria** are actually met before marking complete

### For QA Agent

1. **Write comprehensive reviews** in the story file itself
2. **Include specific test results** and metrics
3. **Document both strengths and issues** objectively
4. **Provide actionable feedback** if changes are requested
5. **Use tables and formatting** for easy scanning
6. **Include security assessment** for all stories
7. **Give clear final verdict** with confidence level

### For BMAD Master

1. **Verify QA approval** before marking stories as Done
2. **Ensure story files are complete** and well-documented
3. **Check that all sections** have been filled out properly
4. **Maintain consistency** across all story files

---

## Common Workflows

### Happy Path (No Issues)

```
1. Dev Agent starts story
   → Status: In Progress
   → Adds to Status History

2. Dev Agent completes implementation
   → Marks all AC as complete
   → Writes Implementation Summary
   → Status: Ready to Review by QA
   → Updates Status History

3. QA Agent reviews
   → Writes complete QA Review section
   → All tests pass
   → Status: Approved
   → Updates Status History

4. BMAD Master closes story
   → Status: Done
   → Updates Status History
```

### Path with Changes Requested

```
1. Dev Agent starts story
   → Status: In Progress

2. Dev Agent completes implementation
   → Status: Ready to Review by QA

3. QA Agent reviews
   → Finds issues
   → Writes QA Review with detailed feedback
   → Status: Changes Requested
   → Updates Status History

4. Dev Agent addresses feedback
   → Updates implementation
   → Updates Implementation Summary with changes
   → Status: Ready to Review by QA (again)
   → Updates Status History

5. QA Agent re-reviews
   → Issues resolved
   → Updates QA Review section
   → Status: Approved
   → Updates Status History

6. BMAD Master closes story
   → Status: Done
```

---

## File Naming Conventions

Story files should be named: `US[Epic].[Story].md`

Examples:
- `US1.1.md` - Epic 1, Story 1
- `US2.3.md` - Epic 2, Story 3
- `US10.2.md` - Epic 10, Story 2

---

## Quality Standards

### All story files must include:

- ✅ Story metadata (ID, Epic, Points, Priority, Dependencies, Status)
- ✅ Status History table with all transitions
- ✅ User story in proper format
- ✅ Clear acceptance criteria
- ✅ Implementation Summary (when dev work is complete)
- ✅ QA Review section (when QA review is complete)
- ✅ Technical notes

### Story files must NOT:

- ❌ Have separate review documents (QA review goes in the story file)
- ❌ Have outdated status information
- ❌ Skip the Status History table
- ❌ Have incomplete sections for completed stories
- ❌ Contain placeholder text in completed sections

---

## Example: Complete Story File

See `docs/stories/US1.1.md` for a complete example of a fully implemented and reviewed story following this workflow.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-08 | Initial workflow documentation | BMAD Master |

---

**Maintained By:** BMAD Master  
**Last Updated:** 2025-10-08


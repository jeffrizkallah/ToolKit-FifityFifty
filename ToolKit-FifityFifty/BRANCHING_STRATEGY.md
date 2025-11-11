# Branching Strategy

This document outlines the branching strategy and workflow for the ToolKit FiftyFifty project.

## Overview

We use **GitHub Flow** with a development branch, which is a simplified branching strategy that enables continuous delivery while maintaining code quality through reviews and automated testing.

## Branch Structure

### Main Branches

#### `main`
- **Purpose**: Production-ready code
- **Protection**: Branch protection enabled
- **Deployments**: Automatically deploys to production on Vercel
- **Rules**:
  - No direct commits allowed
  - Requires pull request reviews (minimum 1 approval)
  - All status checks must pass
  - Must be up to date before merging
  - Linear history preferred (squash or rebase merge)

#### `develop`
- **Purpose**: Integration branch for ongoing development
- **Protection**: Branch protection enabled
- **Deployments**: Automatically deploys to development environment
- **Rules**:
  - No direct commits (except minor fixes)
  - Requires pull request reviews
  - All status checks must pass
  - Base branch for all feature branches

### Temporary Branches

#### Feature Branches (`feature/*`)
- **Purpose**: Develop new features or enhancements
- **Naming**: `feature/short-description` or `feature/US1.2-github-setup`
- **Base**: Always branch from `develop`
- **Merge to**: `develop` via pull request
- **Lifetime**: Deleted after merge
- **Examples**:
  - `feature/user-authentication`
  - `feature/US2.3-initiatives-page`
  - `feature/arabic-rtl-support`

#### Bugfix Branches (`bugfix/*`)
- **Purpose**: Fix bugs found in development
- **Naming**: `bugfix/short-description` or `bugfix/issue-123`
- **Base**: Branch from `develop`
- **Merge to**: `develop` via pull request
- **Lifetime**: Deleted after merge
- **Examples**:
  - `bugfix/header-alignment`
  - `bugfix/missing-translation`

#### Hotfix Branches (`hotfix/*`)
- **Purpose**: Urgent fixes for production issues
- **Naming**: `hotfix/short-description` or `hotfix/critical-bug`
- **Base**: Branch from `main`
- **Merge to**: Both `main` AND `develop`
- **Lifetime**: Deleted after merge
- **Examples**:
  - `hotfix/security-vulnerability`
  - `hotfix/broken-navigation`

#### Release Branches (`release/*`) - Optional
- **Purpose**: Prepare for production release
- **Naming**: `release/v1.0.0`
- **Base**: Branch from `develop`
- **Merge to**: `main` and back to `develop`
- **Lifetime**: Deleted after merge
- **Use when**: Preparing a major release with final testing

## Workflow

### Feature Development Workflow

1. **Start a new feature**
   ```bash
   # Ensure develop is up to date
   git checkout develop
   git pull origin develop
   
   # Create feature branch
   git checkout -b feature/my-feature
   ```

2. **Work on the feature**
   ```bash
   # Make changes and commit regularly
   git add .
   git commit -m "feat: add user authentication"
   
   # Keep your branch updated with develop
   git fetch origin develop
   git rebase origin/develop
   ```

3. **Push and create pull request**
   ```bash
   # Push your branch
   git push origin feature/my-feature
   
   # Create pull request on GitHub
   # - Base: develop
   # - Compare: feature/my-feature
   # - Add description and link to user story
   ```

4. **Code review and merge**
   - Request review from team members (auto-assigned via CODEOWNERS)
   - Address review comments
   - Wait for approvals and passing checks
   - Merge via GitHub (squash recommended)
   - Delete feature branch

5. **Clean up**
   ```bash
   # Switch back to develop
   git checkout develop
   git pull origin develop
   
   # Delete local feature branch
   git branch -d feature/my-feature
   ```

### Hotfix Workflow

1. **Create hotfix from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-issue
   ```

2. **Fix and test**
   ```bash
   git add .
   git commit -m "fix: resolve critical issue"
   git push origin hotfix/critical-issue
   ```

3. **Create TWO pull requests**
   - PR #1: `hotfix/critical-issue` → `main`
   - PR #2: `hotfix/critical-issue` → `develop`

4. **Merge and deploy**
   - Get expedited review
   - Merge to `main` (triggers production deployment)
   - Merge to `develop` (keeps branches in sync)
   - Delete hotfix branch

### Release Workflow (if used)

1. **Create release branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. **Prepare release**
   - Update version numbers
   - Update changelog
   - Final testing
   - Bug fixes only (no new features)

3. **Merge release**
   ```bash
   # Merge to main
   git checkout main
   git merge --no-ff release/v1.0.0
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin main --tags
   
   # Merge back to develop
   git checkout develop
   git merge --no-ff release/v1.0.0
   git push origin develop
   
   # Delete release branch
   git branch -d release/v1.0.0
   git push origin --delete release/v1.0.0
   ```

## Commit Message Conventions

We follow **Conventional Commits** for clear commit history:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples
```bash
feat(auth): add user login functionality

Implemented JWT-based authentication with email/password.
Includes login form, API integration, and session management.

Closes #123

---

fix(header): correct alignment in mobile view

---

docs(readme): update installation instructions

---

refactor(api): simplify CMS data fetching logic
```

## Pull Request Guidelines

### Creating a Pull Request

1. **Title**: Clear, descriptive title
   - Good: `feat(US2.3): implement initiatives listing page`
   - Bad: `update files`

2. **Description**: Include:
   - Link to user story or issue
   - Summary of changes
   - Testing performed
   - Screenshots (if UI changes)
   - Breaking changes (if any)

3. **Labels**: Add appropriate labels
   - `feature`, `bugfix`, `hotfix`
   - `documentation`, `refactor`
   - `high-priority`, `needs-review`

4. **Assignees**: Assign yourself and relevant reviewers

5. **Reviewers**: Request reviews (auto-assigned via CODEOWNERS)

### Review Process

- **Minimum 1 approval** required before merge
- **All CI/CD checks** must pass
- **Address all comments** or explain why not
- **Update branch** if conflicts arise
- **Squash commits** on merge (keeps history clean)

### Merge Options

- **Squash and merge** (recommended): Combines all commits into one
- **Rebase and merge**: Replays commits on base branch
- **Merge commit**: Creates explicit merge commit (use for important features)

## Branch Protection Rules

### `main` Branch Protection

- ✅ Require pull request reviews (1 approval minimum)
- ✅ Dismiss stale approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Require linear history (optional)
- ✅ Include administrators in restrictions
- ✅ Restrict force pushes
- ✅ Restrict deletions

### `develop` Branch Protection

- ✅ Require pull request reviews (1 approval minimum)
- ✅ Require status checks to pass before merging
- ✅ Allow force pushes by admins only (for rare fixes)
- ✅ Restrict deletions

## Best Practices

### General

1. **Keep branches short-lived**: Merge features within a few days
2. **Commit often**: Small, logical commits are easier to review
3. **Write clear commit messages**: Follow conventional commits
4. **Sync regularly**: Keep your branch updated with base branch
5. **Test before pushing**: Run tests and linting locally

### Branch Management

1. **Delete merged branches**: Keep repository clean
2. **Don't commit directly to main/develop**: Always use pull requests
3. **Rebase before merge**: Keep history clean
4. **Tag releases**: Use semantic versioning (v1.0.0)

### Pull Requests

1. **Keep PRs small**: Easier to review (aim for < 400 lines changed)
2. **One feature per PR**: Don't mix unrelated changes
3. **Add tests**: Include tests for new features
4. **Update documentation**: Keep docs in sync with code
5. **Be responsive**: Address review comments promptly

### Code Review

1. **Be constructive**: Suggest improvements, don't just criticize
2. **Be thorough**: Check logic, style, tests, docs
3. **Be timely**: Review within 24 hours
4. **Ask questions**: If something is unclear, ask
5. **Approve explicitly**: Use GitHub's approval feature

## Emergency Procedures

### Reverting a Bad Deployment

```bash
# Find the last good commit
git log

# Create revert commit
git revert <bad-commit-hash>
git push origin main

# Or reset to last good commit (use with caution)
git reset --hard <good-commit-hash>
git push origin main --force-with-lease
```

### Fixing a Broken Main Branch

```bash
# Create hotfix branch
git checkout main
git checkout -b hotfix/fix-main

# Make fixes
git add .
git commit -m "fix: resolve main branch issues"

# Create PR and get expedited review
git push origin hotfix/fix-main
```

## CI/CD Integration

- **GitHub Actions** runs on all pull requests
- **Status checks** include:
  - Linting (ESLint)
  - Type checking (TypeScript)
  - Tests (if implemented)
  - Build verification

- **Deployment**:
  - `main` → Production (Vercel)
  - `develop` → Development (Vercel preview)
  - Pull requests → Preview deployments

## Questions?

If you have questions about the branching strategy:
1. Check this document first
2. Ask in team chat
3. Discuss in team meetings

---

**Last Updated**: October 17, 2025


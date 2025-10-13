# Contributing to Forecast Website

## Git Workflow

### Branch Strategy
We follow a **feature branch workflow** for collaborative development:

1. **Main Branch**: Always contains production-ready code
2. **Feature Branches**: Created for each new feature/fix
3. **Pull Requests**: Required for merging into main

### Development Process

#### 1. Starting Work on a Feature
```bash
# Always start from main and pull latest changes
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix-name
```

#### 2. Naming Conventions
- **Feature branches**: `feature/descriptive-name`
- **Bug fixes**: `fix/descriptive-name`
- **Hotfixes**: `hotfix/critical-issue`
- **Refactoring**: `refactor/descriptive-name`

#### 3. Development Workflow
```bash
# Make your changes
# Commit frequently with clear messages
git add .
git commit -m "feat: add user authentication system"

# Push your branch to remote
git push origin feature/your-feature-name
```

#### 4. Commit Message Format
Use conventional commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

#### 5. Creating Pull Requests
1. Push your feature branch to remote
2. Create a Pull Request (PR) on GitHub/GitLab
3. Link the PR to relevant issues
4. Request code review from teammates
5. Address review comments
6. Merge only after approval

#### 6. Merging Process
- **Squash and merge** for feature branches
- **Rebase and merge** for clean history
- **Create merge commit** for complex features

### Code Review Guidelines
- All PRs require at least one approval
- Review for:
  - Code quality and standards
  - Functionality
  - Security considerations
  - Performance impact

### Before Merging to Main
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] Issue linked to PR

### Emergency Hotfixes
For critical production issues:
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue
# Make minimal required changes
git commit -m "hotfix: fix critical production issue"
git push origin hotfix/critical-issue
# Create PR and merge immediately after review
```

## Best Practices
- Never commit directly to main
- Keep branches short-lived (merge within a few days)
- Write clear commit messages
- Test your changes before pushing
- Communicate with your team about what you're working on 
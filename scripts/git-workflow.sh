#!/bin/bash

# Git Workflow Helper Script
# Usage: ./scripts/git-workflow.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to start a new feature
start_feature() {
    local feature_name=$1
    
    if [ -z "$feature_name" ]; then
        print_error "Feature name is required"
        echo "Usage: $0 start-feature <feature-name>"
        exit 1
    fi
    
    print_info "Starting new feature: $feature_name"
    
    # Ensure we're on main and up to date
    git checkout main
    git pull origin main
    
    # Create feature branch
    git checkout -b "feature/$feature_name"
    
    print_success "Created feature branch: feature/$feature_name"
    print_info "You can now start working on your feature"
}

# Function to start a bug fix
start_fix() {
    local fix_name=$1
    
    if [ -z "$fix_name" ]; then
        print_error "Fix name is required"
        echo "Usage: $0 start-fix <fix-name>"
        exit 1
    fi
    
    print_info "Starting new bug fix: $fix_name"
    
    # Ensure we're on main and up to date
    git checkout main
    git pull origin main
    
    # Create fix branch
    git checkout -b "fix/$fix_name"
    
    print_success "Created fix branch: fix/$fix_name"
    print_info "You can now start working on your fix"
}

# Function to finish a feature/fix
finish_work() {
    local current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        print_error "You're already on main branch"
        exit 1
    fi
    
    print_info "Finishing work on branch: $current_branch"
    
    # Check if there are uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes"
        git status --short
        read -p "Do you want to commit them? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter commit message: " commit_msg
            git add .
            git commit -m "$commit_msg"
        fi
    fi
    
    # Push the branch
    git push origin "$current_branch"
    
    print_success "Branch $current_branch pushed to remote"
    print_info "Next steps:"
    print_info "1. Create a Pull Request on GitHub/GitLab"
    print_info "2. Request code review from your teammate"
    print_info "3. Address any review comments"
    print_info "4. Merge after approval"
}

# Function to show current status
show_status() {
    print_info "Current Git status:"
    echo
    
    local current_branch=$(git branch --show-current)
    print_info "Current branch: $current_branch"
    
    if [ "$current_branch" != "main" ]; then
        local main_commits=$(git rev-list --count main..HEAD)
        print_info "Commits ahead of main: $main_commits"
    fi
    
    echo
    git status --short
}

# Function to show help
show_help() {
    echo "Git Workflow Helper Script"
    echo
    echo "Usage: $0 [command] [options]"
    echo
    echo "Commands:"
    echo "  start-feature <name>  Start a new feature branch"
    echo "  start-fix <name>      Start a new bug fix branch"
    echo "  finish-work           Finish current work and push to remote"
    echo "  status               Show current Git status"
    echo "  help                 Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start-feature user-authentication"
    echo "  $0 start-fix login-bug"
    echo "  $0 finish-work"
    echo "  $0 status"
}

# Main script logic
case "$1" in
    "start-feature")
        start_feature "$2"
        ;;
    "start-fix")
        start_fix "$2"
        ;;
    "finish-work")
        finish_work
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac 
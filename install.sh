#!/usr/bin/env bash
# install.sh — Installer for Everything For Ai (EFA)
#
# Supports two installation paths:
# 1. Minimal: Zero-dependency, offline-friendly copy of rules and workflows to ~/.claude or .claude
# 2. Full / Hooks Runtime: Automatically restores the Node.js installation scripts from the
#    upstream repository, installs npm dependencies, and delegates to the Node-based installer.

set -euo pipefail

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}        Everything For Ai (EFA) Installer         ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Find absolute path of the script directory
SCRIPT_PATH="$0"
while [ -L "$SCRIPT_PATH" ]; do
    link_dir="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
    SCRIPT_PATH="$(readlink "$SCRIPT_PATH")"
    [[ "$SCRIPT_PATH" != /* ]] && SCRIPT_PATH="$link_dir/$SCRIPT_PATH"
done
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
cd "$SCRIPT_DIR"

# Defaults
PROFILE=""
TARGET="claude"
LEVEL="user"
DRY_RUN=false
MODULES=""
SKILLS=""
RULES=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --profile)
            PROFILE="$2"
            shift 2
            ;;
        --target)
            TARGET="$2"
            shift 2
            ;;
        --level)
            LEVEL="$2"
            shift 2
            ;;
        --project)
            LEVEL="project"
            shift
            ;;
        --user)
            LEVEL="user"
            shift
            ;;
        --modules)
            MODULES="$2"
            shift 2
            ;;
        --skills)
            SKILLS="$2"
            shift 2
            ;;
        --rules)
            RULES="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            echo "Usage: ./install.sh [options]"
            echo ""
            echo "Options:"
            echo "  --profile <minimal|full>   Specify install profile"
            echo "  --target <claude|cursor>    Specify target agent environment (default: claude)"
            echo "  --user                     Install globally to user directory (e.g. ~/.claude) (default)"
            echo "  --project                  Install locally to current project directory (e.g. .claude)"
            echo "  --modules <modules>        Explicit list of modules to install (comma-separated)"
            echo "  --skills <skills>          Explicit list of skills to install (comma-separated)"
            echo "  --rules <rules>            Explicit list of rules to install (comma-separated)"
            echo "  --dry-run                  Show plan without modifying files"
            echo "  -h, --help                 Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Error: Unknown argument: $1${NC}"
            exit 1
            ;;
    esac
done

# If no profile or modules specified, run interactive mode or default to full
if [[ -z "$PROFILE" && -z "$MODULES" && -z "$SKILLS" && -z "$RULES" ]]; then
    # Auto-detect interactive run
    if [ -t 0 ]; then
        echo -e "${YELLOW}No installation options provided. Running interactive configuration...${NC}"
        echo -e "Choose installation profile:"
        echo -e "  1) Full (Recommended) - Installs all rules, skills, workflows, and hook runtimes"
        echo -e "  2) Minimal - Installs only rules and workflows (zero dependencies, offline)"
        read -rp "Selection (1-2) [1]: " profile_choice
        if [[ "$profile_choice" == "2" ]]; then
            PROFILE="minimal"
        else
            PROFILE="full"
        fi
        
        echo -e "\nChoose target directory level:"
        echo -e "  1) User-level (~/.claude/ or ~/.cursor/) - Applies to all projects"
        echo -e "  2) Project-level (.claude/ or .cursorrules) - Applies only here"
        read -rp "Selection (1-2) [1]: " level_choice
        if [[ "$level_choice" == "2" ]]; then
            LEVEL="project"
        else
            LEVEL="user"
        fi
    else
        PROFILE="full"
    fi
fi

# Determine target path
TARGET_DIR=""
if [[ "$TARGET" == "claude" ]]; then
    if [[ "$LEVEL" == "user" ]]; then
        TARGET_DIR="$HOME/.claude"
    else
        TARGET_DIR="./.claude"
    fi
elif [[ "$TARGET" == "cursor" ]]; then
    if [[ "$LEVEL" == "user" ]]; then
        TARGET_DIR="$HOME/.cursor"
    else
        TARGET_DIR="./" # Cursor project-level goes to root .cursorrules
    fi
else
    echo -e "${RED}Error: Unsupported target environment '$TARGET'. Only 'claude' or 'cursor' are supported.${NC}"
    exit 1
fi

# Run minimal path (rules & workflows only, zero dependencies)
if [[ "$PROFILE" == "minimal" ]]; then
    echo -e "${GREEN}[EFA] Running minimal installation to '$TARGET_DIR'...${NC}"
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[Dry Run] Would create directories under $TARGET_DIR"
        echo -e "${YELLOW}[Dry Run] Would copy rules/common to $TARGET_DIR/rules"
        echo -e "${YELLOW}[Dry Run] Would copy workflows to $TARGET_DIR/workflows"
        echo -e "${GREEN}[EFA] Dry run complete!${NC}"
        exit 0
    fi

    # Create target directories
    mkdir -p "$TARGET_DIR/rules"
    mkdir -p "$TARGET_DIR/workflows"

    # Copy rules
    echo -e "${BLUE}[EFA] Copying rules...${NC}"
    if [ -d "rules/common" ]; then
        cp -R rules/common "$TARGET_DIR/rules/"
    fi
    for lang in typescript python golang rust java; do
        if [ -d "rules/$lang" ]; then
            cp -R "rules/$lang" "$TARGET_DIR/rules/"
        fi
    done

    # Copy workflows
    echo -e "${BLUE}[EFA] Copying workflows...${NC}"
    if [ -d "workflows" ]; then
        cp -R workflows/* "$TARGET_DIR/workflows/"
    fi

    echo -e "${GREEN}[EFA] Minimal installation complete!${NC}"
    echo -e "Files installed at: ${YELLOW}$TARGET_DIR${NC}"
    exit 0
fi

# Run full path / custom modules (requires scripts/)
# Check if scripts/ directory exists. If not, download from upstream
if [ ! -d "scripts" ]; then
    echo -e "${YELLOW}[EFA] Script infrastructure not found. Restoring from upstream EFA script repository...${NC}"
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[Dry Run] Would clone upstream script repository and restore scripts/ directory${NC}"
    else
        UPSTREAM_REPO="https://github.com/affaan-m/ECC.git"
        TEMP_DIR="/tmp/efa-upstream-$$"
        
        # Clone upstream
        if ! git clone --depth 1 "$UPSTREAM_REPO" "$TEMP_DIR" &>/dev/null; then
            echo -e "${RED}Error: Failed to clone upstream script repository. Make sure git is installed and you have network access.${NC}"
            exit 1
        fi
        
        # Copy scripts
        mkdir -p scripts
        cp -R "$TEMP_DIR/scripts"/* scripts/
        
        # Copy tests if any
        if [ -d "$TEMP_DIR/tests" ]; then
            mkdir -p tests
            cp -R "$TEMP_DIR/tests"/* tests/
        fi
        
        # Clean up
        rm -rf "$TEMP_DIR"
        echo -e "${GREEN}[EFA] Script infrastructure restored successfully!${NC}"
    fi
fi

# Install Node dependencies
if [ "$DRY_RUN" = false ]; then
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}[EFA] Installing Node.js dependencies...${NC}"
        npm install --no-audit --no-fund --loglevel=error
    fi
fi

# Resolve Node installer path
if command -v cygpath &>/dev/null; then
    NODE_SCRIPT="$(cygpath -w "$SCRIPT_DIR/scripts/install-apply.js")"
else
    NODE_SCRIPT="$SCRIPT_DIR/scripts/install-apply.js"
fi

# Delegate to the Node installer
echo -e "${BLUE}[EFA] Delegating to Node installer...${NC}"
if [ "$DRY_RUN" = true ]; then
    # Add dry-run argument to Node execution
    echo -e "${YELLOW}[Dry Run] Would run: node scripts/install-apply.js --profile $PROFILE --target $TARGET${NC}"
else
    # Forward all arguments directly to the Node script
    # We construct arguments based on parsed choices
    ARGS=()
    if [[ -n "$PROFILE" ]]; then ARGS+=("--profile" "$PROFILE"); fi
    if [[ -n "$TARGET" ]]; then ARGS+=("--target" "$TARGET"); fi
    if [[ "$LEVEL" == "project" ]]; then ARGS+=("--config" "efa-install.json"); fi # default config path for project
    if [[ -n "$MODULES" ]]; then ARGS+=("--modules" "$MODULES"); fi
    if [[ -n "$SKILLS" ]]; then ARGS+=("--skills" "$SKILLS"); fi
    
    # Run Node script
    exec node "$NODE_SCRIPT" "${ARGS[@]}"
fi

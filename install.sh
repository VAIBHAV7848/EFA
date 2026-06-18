#!/usr/bin/env bash
# install.sh — Installer for Everything For Ai (EFA)
#
# Supports two installation paths:
# 1. Minimal: Zero-dependency, offline-friendly copy of rules and workflows to ~/.claude or .claude
# 2. Full / Hooks Runtime: Automatically restores the Node.js installation scripts from the
#    upstream repository, installs npm dependencies, and delegates to the Node-based installer.
#
# Upgraded with:
# - Auto-Stack Detection: Scans project to detect active languages and target install scope.
# - Multi-Agent Rules Consolidation: Generates unified rules files for Cursor (.cursorrules),
#   Windsurf (.windsurfrules), and GitHub Copilot (.github/copilot-instructions.md).

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

# Helper: Detect active stack in the current directory (or target parent)
detect_stack() {
    local detected=()
    # Check TS/JS
    if [ -f "package.json" ] || [ -f "tsconfig.json" ] || ls *.ts *.js *.tsx *.jsx &>/dev/null; then
        detected+=("typescript")
    fi
    # Check Python
    if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "Pipfile" ] || ls *.py &>/dev/null; then
        detected+=("python")
    fi
    # Check Go
    if [ -f "go.mod" ] || ls *.go &>/dev/null; then
        detected+=("golang")
    fi
    # Check Rust
    if [ -f "Cargo.toml" ] || ls src/*.rs &>/dev/null; then
        detected+=("rust")
    fi
    # Check Java
    if [ -f "pom.xml" ] || [ -f "build.gradle" ] || ls src/main/java/**/*.java &>/dev/null; then
        detected+=("java")
    fi
    echo "${detected[@]}"
}

# Helper: Generate consolidated rules file for Cursor/Windsurf/Copilot
generate_consolidated_rules() {
    local out_file="$1"
    local langs=("$@")
    # Shift out the first argument
    langs=("${langs[@]:1}")

    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[Dry Run] Would generate consolidated rules file: $out_file${NC}"
        return
    fi

    # Create parent folder if it doesn't exist
    mkdir -p "$(dirname "$out_file")"

    echo -e "${BLUE}[EFA] Consolidating rules to '$out_file'...${NC}"
    
    # Write Header
    echo "# Everything For Ai (EFA) - Project Rules" > "$out_file"
    echo "# Generated on $(date '+%Y-%m-%d %H:%M:%S')" >> "$out_file"
    echo "" >> "$out_file"
    echo "This file provides system prompt directives and development rules for AI coding agents." >> "$out_file"
    echo "" >> "$out_file"
    
    # Append Common Rules
    if [ -d "rules/common" ]; then
        echo "## Common Rules" >> "$out_file"
        for rule_file in rules/common/*.md; do
            if [ -f "$rule_file" ]; then
                echo -e "\n### $(basename "$rule_file" .md | tr '-' ' ' | tr '[a-z]' '[A-Z]')" >> "$out_file"
                cat "$rule_file" >> "$out_file"
                echo "" >> "$out_file"
            fi
        done
    fi

    # Append Detected Language Rules
    for lang in "${langs[@]}"; do
        if [ -d "rules/$lang" ]; then
            echo -e "\n## ${lang^} Rules" >> "$out_file"
            for rule_file in rules/$lang/*.md; do
                if [ -f "$rule_file" ]; then
                    echo -e "\n### $(basename "$rule_file" .md | tr '-' ' ' | tr '[a-z]' '[A-Z]')" >> "$out_file"
                    cat "$rule_file" >> "$out_file"
                    echo "" >> "$out_file"
                fi
            done
        fi
    done
}

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
            echo "  --target <claude|cursor|windsurf|copilot|all>  Specify target agent environment (default: claude)"
            echo "  --user                     Install globally to user directory (e.g. ~/.claude) (default)"
            echo "  --project                  Install locally to current project directory"
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
        echo -e "  1) User-level (Globally configures agents) - Applies to all projects"
        echo -e "  2) Project-level (Configures current folder/repo) - Applies only here"
        read -rp "Selection (1-2) [1]: " level_choice
        if [[ "$level_choice" == "2" ]]; then
            LEVEL="project"
        else
            LEVEL="user"
        fi
        
        echo -e "\nChoose target agent environment:"
        echo -e "  1) Claude Code (Standard .claude)"
        echo -e "  2) Cursor (.cursorrules)"
        echo -e "  3) Windsurf (.windsurfrules)"
        echo -e "  4) Copilot (.github/copilot-instructions.md)"
        echo -e "  5) All (Configure all active agents/IDEs in workspace)"
        read -rp "Selection (1-5) [1]: " target_choice
        case "$target_choice" in
            2) TARGET="cursor" ;;
            3) TARGET="windsurf" ;;
            4) TARGET="copilot" ;;
            5) TARGET="all" ;;
            *) TARGET="claude" ;;
        esac
    else
        PROFILE="full"
    fi
fi

# Run minimal path (rules & workflows only, zero dependencies)
if [[ "$PROFILE" == "minimal" || "$TARGET" != "claude" ]]; then
    # Auto-detect stack
    echo -e "${BLUE}[EFA] Auto-detecting project tech stack...${NC}"
    DETECTED_LANGS=($(detect_stack))
    if [ ${#DETECTED_LANGS[@]} -gt 0 ]; then
        echo -e "${GREEN}[EFA] Detected languages: ${DETECTED_LANGS[*]}${NC}"
    else
        echo -e "${YELLOW}[EFA] No language manifest files found. Copying common rules only.${NC}"
    fi

    # Perform consolidated files generation or directory copies depending on the targets
    TARGET_ENVIRONMENTS=()
    if [[ "$TARGET" == "all" ]]; then
        TARGET_ENVIRONMENTS=("claude" "cursor" "windsurf" "copilot")
    else
        TARGET_ENVIRONMENTS=("$TARGET")
    fi

    for env in "${TARGET_ENVIRONMENTS[@]}"; do
        if [[ "$env" == "claude" ]]; then
            TARGET_DIR=""
            if [[ "$LEVEL" == "user" ]]; then TARGET_DIR="$HOME/.claude"; else TARGET_DIR="./.claude"; fi
            
            echo -e "${GREEN}[EFA] Installing rules and workflows to Claude directory '$TARGET_DIR'...${NC}"
            if [ "$DRY_RUN" = true ]; then
                echo -e "${YELLOW}[Dry Run] Would create Claude folders and copy files under $TARGET_DIR${NC}"
            else
                mkdir -p "$TARGET_DIR/rules"
                mkdir -p "$TARGET_DIR/workflows"
                if [ -d "rules/common" ]; then cp -R rules/common "$TARGET_DIR/rules/"; fi
                for lang in "${DETECTED_LANGS[@]}"; do
                    if [ -d "rules/$lang" ]; then cp -R "rules/$lang" "$TARGET_DIR/rules/"; fi
                done
                if [ -d "workflows" ]; then cp -R workflows/* "$TARGET_DIR/workflows/"; fi
            fi
        elif [[ "$env" == "cursor" ]]; then
            TARGET_FILE=""
            if [[ "$LEVEL" == "user" ]]; then TARGET_FILE="$HOME/.cursorrules"; else TARGET_FILE="./.cursorrules"; fi
            generate_consolidated_rules "$TARGET_FILE" "${DETECTED_LANGS[@]}"
        elif [[ "$env" == "windsurf" ]]; then
            TARGET_FILE=""
            if [[ "$LEVEL" == "user" ]]; then TARGET_FILE="$HOME/.windsurfrules"; else TARGET_FILE="./.windsurfrules"; fi
            generate_consolidated_rules "$TARGET_FILE" "${DETECTED_LANGS[@]}"
        elif [[ "$env" == "copilot" ]]; then
            TARGET_FILE="./.github/copilot-instructions.md"
            generate_consolidated_rules "$TARGET_FILE" "${DETECTED_LANGS[@]}"
        fi
    done

    echo -e "${GREEN}[EFA] Installation complete!${NC}"
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

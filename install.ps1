# install.ps1 — PowerShell Installer for Everything For Ai (EFA)
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

param (
    [string]$Profile = "",
    [string]$Target = "claude",
    [string]$Level = "user",
    [switch]$Project,
    [switch]$User,
    [string]$Modules = "",
    [string]$Skills = "",
    [string]$Rules = "",
    [switch]$DryRun
)

Write-Host "==================================================" -ForegroundColor Blue
Write-Host "        Everything For Ai (EFA) Installer         " -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Resolve project root directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Determine installation level
if ($Project) {
    $Level = "project"
} elseif ($User) {
    $Level = "user"
}

# Helper: Detect active stack in the current directory
function Detect-Stack {
    $detected = @()
    # Check TS/JS
    if ((Test-Path "package.json") -or (Test-Path "tsconfig.json") -or (Get-ChildItem *.ts, *.js, *.tsx, *.jsx -ErrorAction SilentlyContinue)) {
        $detected += "typescript"
    }
    # Check Python
    if ((Test-Path "requirements.txt") -or (Test-Path "pyproject.toml") -or (Test-Path "Pipfile") -or (Get-ChildItem *.py -ErrorAction SilentlyContinue)) {
        $detected += "python"
    }
    # Check Go
    if ((Test-Path "go.mod") -or (Get-ChildItem *.go -ErrorAction SilentlyContinue)) {
        $detected += "golang"
    }
    # Check Rust
    if ((Test-Path "Cargo.toml") -or (Get-ChildItem src\*.rs -ErrorAction SilentlyContinue)) {
        $detected += "rust"
    }
    # Check Java
    if ((Test-Path "pom.xml") -or (Test-Path "build.gradle") -or (Get-ChildItem src\main\java\**\*.java -ErrorAction SilentlyContinue)) {
        $detected += "java"
    }
    return $detected
}

# Helper: Generate consolidated rules file for Cursor/Windsurf/Copilot
function Generate-ConsolidatedRules {
    param (
        [string]$OutFile,
        [string[]]$Langs
    )

    if ($DryRun) {
        Write-Host "[Dry Run] Would generate consolidated rules file: $OutFile" -ForegroundColor Yellow
        return
    }

    # Ensure parent folder exists
    $parentDir = Split-Path -Parent $OutFile
    if ($parentDir -and -not (Test-Path $parentDir)) {
        $null = New-Item -ItemType Directory -Force -Path $parentDir
    }

    Write-Host "[EFA] Consolidating rules to '$OutFile'..." -ForegroundColor Blue
    
    # Write Header
    $content = @()
    $content += "# Everything For Ai (EFA) - Project Rules"
    $content += "# Generated on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $content += ""
    $content += "This file provides system prompt directives and development rules for AI coding agents."
    $content += ""

    # Append Common Rules
    if (Test-Path "rules\common") {
        $content += "## Common Rules"
        foreach ($ruleFile in Get-ChildItem "rules\common\*.md") {
            $title = (Get-Item $ruleFile).BaseName.Replace("-", " ").ToUpper()
            $content += ""
            $content += "### $title"
            $content += Get-Content $ruleFile.FullName -Raw
            $content += ""
        }
    }

    # Append Language Rules
    foreach ($lang in $Langs) {
        if (Test-Path "rules\$lang") {
            $langTitle = $lang.Substring(0,1).ToUpper() + $lang.Substring(1)
            $content += ""
            $content += "## $langTitle Rules"
            foreach ($ruleFile in Get-ChildItem "rules\$lang\*.md") {
                $title = (Get-Item $ruleFile).BaseName.Replace("-", " ").ToUpper()
                $content += ""
                $content += "### $title"
                $content += Get-Content $ruleFile.FullName -Raw
                $content += ""
            }
        }
    }

    $content | Out-File -FilePath $OutFile -Encoding utf8 -Force
}

# Prompt user if no choices are specified (interactive mode)
if ($Profile -eq "" -and $Modules -eq "" -and $Skills -eq "" -and $Rules -eq "") {
    if ([Environment]::UserInteractive) {
        Write-Host "No installation options provided. Running interactive configuration..." -ForegroundColor Yellow
        $profileChoice = Read-Host "Choose installation profile: `n  1) Full (Recommended) - Installs all rules, skills, workflows, and hook runtimes`n  2) Minimal - Installs only rules and workflows (zero dependencies, offline)`nSelection (1-2) [1]"
        if ($profileChoice -eq "2") {
            $Profile = "minimal"
        } else {
            $Profile = "full"
        }

        $levelChoice = Read-Host "`nChoose target directory level: `n  1) User-level (Globally configures agents) - Applies to all projects`n  2) Project-level (Configures current folder/repo) - Applies only here`nSelection (1-2) [1]"
        if ($levelChoice -eq "2") {
            $Level = "project"
        } else {
            $Level = "user"
        }

        $targetChoice = Read-Host "`nChoose target agent environment: `n  1) Claude Code (Standard .claude)`n  2) Cursor (.cursorrules)`n  3) Windsurf (.windsurfrules)`n  4) Copilot (.github/copilot-instructions.md)`n  5) All (Configure all active agents/IDEs in workspace)`nSelection (1-5) [1]"
        switch ($targetChoice) {
            "2" { $Target = "cursor" }
            "3" { $Target = "windsurf" }
            "4" { $Target = "copilot" }
            "5" { $Target = "all" }
            Default { $Target = "claude" }
        }
    } else {
        $Profile = "full"
    }
}

# Run minimal path (rules & workflows only, zero dependencies)
if ($Profile -eq "minimal" -or $Target -ne "claude") {
    Write-Host "[EFA] Auto-detecting project tech stack..." -ForegroundColor Blue
    $detectedLangs = Detect-Stack
    if ($detectedLangs.Count -gt 0) {
        Write-Host "[EFA] Detected languages: $($detectedLangs -join ', ')" -ForegroundColor Green
    } else {
        Write-Host "[EFA] No language manifest files found. Copying common rules only." -ForegroundColor Yellow
    }

    $targets = @()
    if ($Target -eq "all") {
        $targets = @("claude", "cursor", "windsurf", "copilot")
    } else {
        $targets = @($Target)
    }

    foreach ($env in $targets) {
        if ($env -eq "claude") {
            $TargetDir = ""
            if ($Level -eq "user") { $TargetDir = Join-Path $Home ".claude" } else { $TargetDir = Join-Path $ScriptDir ".claude" }
            
            Write-Host "[EFA] Installing rules and workflows to Claude directory '$TargetDir'..." -ForegroundColor Green
            if ($DryRun) {
                Write-Host "[Dry Run] Would create Claude folders and copy files under $TargetDir" -ForegroundColor Yellow
            } else {
                $null = New-Item -ItemType Directory -Force -Path (Join-Path $TargetDir "rules")
                $null = New-Item -ItemType Directory -Force -Path (Join-Path $TargetDir "workflows")

                if (Test-Path "rules\common") {
                    Copy-Item -Path "rules\common" -Destination (Join-Path $TargetDir "rules\") -Recurse -Force
                }
                foreach ($lang in $detectedLangs) {
                    if (Test-Path "rules\$lang") {
                        Copy-Item -Path "rules\$lang" -Destination (Join-Path $TargetDir "rules\") -Recurse -Force
                    }
                }
                if (Test-Path "workflows") {
                    Copy-Item -Path "workflows\*" -Destination (Join-Path $TargetDir "workflows\") -Recurse -Force
                }
            }
        } elseif ($env -eq "cursor") {
            $TargetFile = ""
            if ($Level -eq "user") { $TargetFile = Join-Path $Home ".cursorrules" } else { $TargetFile = Join-Path $ScriptDir ".cursorrules" }
            Generate-ConsolidatedRules -OutFile $TargetFile -Langs $detectedLangs
        } elseif ($env -eq "windsurf") {
            $TargetFile = ""
            if ($Level -eq "user") { $TargetFile = Join-Path $Home ".windsurfrules" } else { $TargetFile = Join-Path $ScriptDir ".windsurfrules" }
            Generate-ConsolidatedRules -OutFile $TargetFile -Langs $detectedLangs
        } elseif ($env -eq "copilot") {
            $TargetFile = Join-Path $ScriptDir ".github\copilot-instructions.md"
            Generate-ConsolidatedRules -OutFile $TargetFile -Langs $detectedLangs
        }
    }

    Write-Host "[EFA] Installation complete!" -ForegroundColor Green
    exit 0
}

# Full / Custom Profile execution (requires scripts)
if (-not (Test-Path (Join-Path $ScriptDir "scripts"))) {
    Write-Host "[EFA] Script infrastructure not found. Restoring from upstream EFA script repository..." -ForegroundColor Yellow
    if ($DryRun) {
        Write-Host "[Dry Run] Would clone upstream script repository and restore scripts/ directory" -ForegroundColor Yellow
    } else {
        $UpstreamRepo = "https://github.com/VAIBHAV7848/EFA.git"
        $TempDir = Join-Path [System.IO.Path]::GetTempPath() "efa-upstream-$([Guid]::NewGuid())"

        # Clone upstream
        git clone --depth 1 $UpstreamRepo $TempDir
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to clone upstream script repository. Make sure git is installed and you have network access."
            exit 1
        }

        # Copy scripts
        $null = New-Item -ItemType Directory -Force -Path (Join-Path $ScriptDir "scripts")
        Copy-Item -Path (Join-Path $TempDir "scripts\*") -Destination (Join-Path $ScriptDir "scripts\") -Recurse -Force

        # Copy tests if any
        if (Test-Path (Join-Path $TempDir "tests")) {
            $null = New-Item -ItemType Directory -Force -Path (Join-Path $ScriptDir "tests")
            Copy-Item -Path (Join-Path $TempDir "tests\*") -Destination (Join-Path $ScriptDir "tests\") -Recurse -Force
        }

        # Clean up
        Remove-Item -Path $TempDir -Recurse -Force
        Write-Host "[EFA] Script infrastructure restored successfully!" -ForegroundColor Green
    }
}

# Install Node dependencies
if (-not $DryRun) {
    if (-not (Test-Path (Join-Path $ScriptDir "node_modules"))) {
        Write-Host "[EFA] Installing Node.js dependencies..." -ForegroundColor Blue
        npm install --no-audit --no-fund --loglevel=error
    }
}

$NodeScript = Join-Path $ScriptDir "scripts\install-apply.js"

# Delegate to the Node installer
Write-Host "[EFA] Delegating to Node installer..." -ForegroundColor Blue
if ($DryRun) {
    Write-Host "[Dry Run] Would run: node $NodeScript --profile $Profile --target $Target" -ForegroundColor Yellow
} else {
    $ArgsList = @()
    if ($Profile -ne "") { $ArgsList += @("--profile", $Profile) }
    if ($Target -ne "") { $ArgsList += @("--target", $Target) }
    if ($Level -eq "project") { $ArgsList += @("--config", "efa-install.json") }
    if ($Modules -ne "") { $ArgsList += @("--modules", $Modules) }
    if ($Skills -ne "") { $ArgsList += @("--skills", $Skills) }

    Start-Process -FilePath "node" -ArgumentList @($NodeScript, $ArgsList) -NoNewWindow -Wait
}

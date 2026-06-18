# install.ps1 — PowerShell Installer for Everything For Ai (EFA)
#
# Supports two installation paths:
# 1. Minimal: Zero-dependency, offline-friendly copy of rules and workflows to ~/.claude or .claude
# 2. Full / Hooks Runtime: Automatically restores the Node.js installation scripts from the
#    upstream repository, installs npm dependencies, and delegates to the Node-based installer.

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

        $levelChoice = Read-Host "`nChoose target directory level: `n  1) User-level (~/.claude/ or ~/.cursor/) - Applies to all projects`n  2) Project-level (.claude/ or .cursorrules) - Applies only here`nSelection (1-2) [1]"
        if ($levelChoice -eq "2") {
            $Level = "project"
        } else {
            $Level = "user"
        }
    } else {
        $Profile = "full"
    }
}

# Determine target directory path
$TargetDir = ""
if ($Target -eq "claude") {
    if ($Level -eq "user") {
        $TargetDir = Join-Path $Home ".claude"
    } else {
        $TargetDir = Join-Path $ScriptDir ".claude"
    }
} elseif ($Target -eq "cursor") {
    if ($Level -eq "user") {
        $TargetDir = Join-Path $Home ".cursor"
    } else {
        $TargetDir = $ScriptDir
    }
} else {
    Write-Error "Unsupported target environment '$Target'. Only 'claude' or 'cursor' are supported."
    exit 1
}

# Minimal Profile execution (Zero-dependency copy)
if ($Profile -eq "minimal") {
    Write-Host "[EFA] Running minimal installation to '$TargetDir'..." -ForegroundColor Green
    if ($DryRun) {
        Write-Host "[Dry Run] Would create directories under $TargetDir" -ForegroundColor Yellow
        Write-Host "[Dry Run] Would copy rules/common to $TargetDir\rules" -ForegroundColor Yellow
        Write-Host "[Dry Run] Would copy workflows to $TargetDir\workflows" -ForegroundColor Yellow
        Write-Host "[EFA] Dry run complete!" -ForegroundColor Green
        exit 0
    }

    # Ensure directories exist
    $null = New-Item -ItemType Directory -Force -Path (Join-Path $TargetDir "rules")
    $null = New-Item -ItemType Directory -Force -Path (Join-Path $TargetDir "workflows")

    # Copy rules
    Write-Host "[EFA] Copying rules..." -ForegroundColor Blue
    if (Test-Path (Join-Path $ScriptDir "rules\common")) {
        Copy-Item -Path (Join-Path $ScriptDir "rules\common") -Destination (Join-Path $TargetDir "rules\") -Recurse -Force
    }
    foreach ($lang in "typescript", "python", "golang", "rust", "java") {
        if (Test-Path (Join-Path $ScriptDir "rules\$lang")) {
            Copy-Item -Path (Join-Path $ScriptDir "rules\$lang") -Destination (Join-Path $TargetDir "rules\") -Recurse -Force
        }
    }

    # Copy workflows
    Write-Host "[EFA] Copying workflows..." -ForegroundColor Blue
    if (Test-Path (Join-Path $ScriptDir "workflows")) {
        Copy-Item -Path (Join-Path $ScriptDir "workflows\*") -Destination (Join-Path $TargetDir "workflows\") -Recurse -Force
    }

    Write-Host "[EFA] Minimal installation complete!" -ForegroundColor Green
    Write-Host "Files installed at: $TargetDir" -ForegroundColor Yellow
    exit 0
}

# Full / Custom Profile execution (requires scripts)
if (-not (Test-Path (Join-Path $ScriptDir "scripts"))) {
    Write-Host "[EFA] Script infrastructure not found. Restoring from upstream EFA script repository..." -ForegroundColor Yellow
    if ($DryRun) {
        Write-Host "[Dry Run] Would clone upstream script repository and restore scripts/ directory" -ForegroundColor Yellow
    } else {
        $UpstreamRepo = "https://github.com/affaan-m/ECC.git"
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

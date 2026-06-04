param(
  [Parameter(Mandatory = $true)]
  [string]$TargetPath,

  [switch]$Merge,

  [switch]$Overwrite
)

$ErrorActionPreference = "Stop"

if ($Merge -and $Overwrite) {
  throw "Use either -Merge or -Overwrite, not both."
}

$templateRoot = Split-Path -Parent $PSScriptRoot
$target = Resolve-Path -LiteralPath $TargetPath -ErrorAction SilentlyContinue

if ($null -eq $target) {
  New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
  $targetPathResolved = (Resolve-Path -LiteralPath $TargetPath).Path
} else {
  $targetPathResolved = $target.Path
}

$targetHasContent = (Get-ChildItem -LiteralPath $targetPathResolved -Force | Measure-Object).Count -gt 0

if ($targetHasContent -and -not $Merge -and -not $Overwrite) {
  throw "Target path is not empty. Re-run with -Merge to add only non-conflicting template files, or -Overwrite to replace collisions."
}

$sourceItems = Get-ChildItem -LiteralPath $templateRoot -Force | Where-Object {
  $_.Name -ne ".git" -and $_.FullName -ne $targetPathResolved
}

if ($Merge) {
  $collisions = @()

  foreach ($item in $sourceItems) {
    $sourceRoot = $item.FullName
    $relativeRoot = $item.Name

    if ($item.PSIsContainer) {
      Get-ChildItem -LiteralPath $sourceRoot -Recurse -Force -File | ForEach-Object {
        $relativePath = Join-Path $relativeRoot ($_.FullName.Substring($sourceRoot.Length).TrimStart('\'))
        $destination = Join-Path $targetPathResolved $relativePath
        if (Test-Path -LiteralPath $destination) {
          $collisions += $relativePath
        }
      }
    } else {
      $destination = Join-Path $targetPathResolved $relativeRoot
      if (Test-Path -LiteralPath $destination) {
        $collisions += $relativeRoot
      }
    }
  }

  if ($collisions.Count -gt 0) {
    $message = "Merge would overwrite existing files:`n" + ($collisions | Sort-Object | ForEach-Object { "- $_" }) -join "`n"
    throw "$message`nRe-run with -Overwrite only if you intentionally want to replace these files."
  }
}

foreach ($item in $sourceItems) {
  $destination = Join-Path $targetPathResolved $item.Name
  Copy-Item -LiteralPath $item.FullName -Destination $destination -Recurse -Force:$Overwrite
}

Write-Host "iCode project template copied to $targetPathResolved"
Write-Host "Next: open the folder in Codex and start with prompts/00-start-here.md"

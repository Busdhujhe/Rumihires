# Extract product photos from "Rumi Hires Catalogue.pdf"
# Requires Poppler: winget install --id=oschwartz10612.Poppler -e
#
# Usage:
#   1. Copy "Rumi Hires Catalogue.pdf" to the project root (m:\Rumihires)
#   2. Run: .\scripts\extract-catalogue.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

$pdf = Join-Path $root "Rumi Hires Catalogue.pdf"
$outDir = Join-Path $root "assets\img\products"

if (-not (Test-Path $pdf)) {
  Write-Host "PDF not found. Place your catalogue here:" -ForegroundColor Yellow
  Write-Host "  $pdf"
  exit 1
}

New-Item -ItemType Directory -Path $outDir -Force | Out-Null

$pdftoppm = Get-Command pdftoppm -ErrorAction SilentlyContinue
if (-not $pdftoppm) {
  Write-Host "Poppler not found. Install with:" -ForegroundColor Yellow
  Write-Host "  winget install --id=oschwartz10612.Poppler -e"
  Write-Host ""
  Write-Host "Or export each PDF page manually as PNG into:" -ForegroundColor Yellow
  Write-Host "  $outDir"
  Write-Host "Using filenames from js/products.js (slug.png), e.g. french-lite-iron-chair.png"
  exit 1
}

$tempPrefix = Join-Path $outDir "_page"
& pdftoppm -png $pdf $tempPrefix

# Page order matches js/products.js cataloguePage field
$map = @{
  "01" = "french-lite-iron-chair"
  "02" = "french-black-chair-type-a"
  "03" = "french-black-chair-type-b"
  "04" = "french-black-bench"
  "05" = "french-black-day-bed"
  "06" = "french-wave-umbrella"
  "07" = "donut-table"
  "08" = "french-lite-iron-table"
  "09" = "french-lite-iron-set"
  "10" = "champagne-cooler"
  "11" = "stainless-steel-bowls-a"
  "12" = "stainless-steel-bowls-b"
  "13" = "stainless-steel-bowls-c"
  "14" = "european-style-plates"
  "15" = "golden-snack-stand-a"
  "16" = "golden-snack-stand-b"
  "17" = "timeless-snack-stand-a-3"
  "18" = "timeless-snack-stand-a-2"
  "19" = "timeless-snack-stand-b-2"
  "20" = "timeless-snack-stand-b-3"
  "21" = "euro-tongs"
  "22" = "pearl-serving-tray"
  "23" = "fabric-table-lamp"
}

Get-ChildItem $outDir -Filter "_page-*.png" | ForEach-Object {
  if ($_.Name -match '_page-(\d+)\.png$') {
    $num = $Matches[1]
    if ($map.ContainsKey($num)) {
      $dest = Join-Path $outDir ($map[$num] + ".png")
      Move-Item $_.FullName $dest -Force
      Write-Host "Created $dest"
    }
  }
}

Write-Host "Done. Refresh items.html in your browser."

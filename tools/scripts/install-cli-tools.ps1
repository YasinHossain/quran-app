Param()
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "Installing CLI tools (ripgrep, fd, jq, tree)..."

function Install-WithWinget {
  winget install --silent --accept-source-agreements --accept-package-agreements $args
}

function Install-WithChoco {
  choco install -y $args
}

if (Get-Command winget -ErrorAction SilentlyContinue) {
  Install-WithWinget BurntSushi.ripgrep
  Install-WithWinget sharkdp.fd
  Install-WithWinget jqlang.jq
  Install-WithWinget gnuwin32.tree
}
elseif (Get-Command choco -ErrorAction SilentlyContinue) {
  Install-WithChoco ripgrep fd jq tree
}
else {
  Write-Warning "No supported package manager found (winget/choco)."
  Write-Host "You can still use project-local ripgrep via: npm run rg -- ..."
}

Write-Host "Done."


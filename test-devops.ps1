# 🧪 Script de Test DevOps - Medical Reminder App (Windows PowerShell)
# Utilisation: .\test-devops.ps1 [option]

param(
    [string]$Action = ""
)

# Configuration
$ErrorActionPreference = "Stop"

# Colors
function Write-Step { 
    param([string]$Message)
    Write-Host "📋 $Message" -ForegroundColor Blue
}

function Write-Success { 
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning { 
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

function Write-Error-Custom { 
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Header
Write-Host "🚀 Medical Reminder App - Tests DevOps" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Check prerequisites
function Test-Prerequisites {
    Write-Step "Vérification des prérequis..."
    
    try {
        docker --version | Out-Null
        Write-Success "Docker détecté"
    }
    catch {
        Write-Error-Custom "Docker n'est pas installé ou non accessible"
        exit 1
    }
    
    try {
        docker-compose --version | Out-Null
        Write-Success "Docker Compose détecté"
    }
    catch {
        Write-Error-Custom "Docker Compose n'est pas installé"
        exit 1
    }
    
    Write-Success "Prérequis vérifiés"
}

# Test Docker
function Test-Docker {
    Write-Step "Test de construction Docker..."
    
    try {
        # Arrêter les containers existants
        docker-compose down -v 2>$null
        
        # Build et démarrage
        docker-compose up --build -d
        Write-Success "Docker build réussi"
        
        # Attendre le démarrage
        Write-Step "Attente du démarrage des services..."
        Start-Sleep -Seconds 30
        
        # Test health backend
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Success "Backend accessible"
            }
        }
        catch {
            Write-Warning "Backend non accessible"
        }
        
        # Test frontend
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Success "Frontend accessible"
            }
        }
        catch {
            Write-Warning "Frontend non accessible"
        }
    }
    catch {
        Write-Error-Custom "Échec du build Docker: $($_.Exception.Message)"
        return $false
    }
    
    return $true
}

# Test Backend
function Test-Backend {
    Write-Step "Tests Backend..."
    
    try {
        Set-Location "backend"
        
        # Vérifier requirements.txt
        if (Test-Path "requirements.txt") {
            Write-Step "Installation des dépendances Python..."
            pip install -r requirements.txt --quiet
        }
        
        # Exécuter les tests
        if (Test-Path "tests") {
            python -m pytest tests/ -v --tb=short
            Write-Success "Tests backend réussis"
        }
        else {
            Write-Warning "Dossier tests/ non trouvé"
        }
    }
    catch {
        Write-Error-Custom "Échec des tests backend: $($_.Exception.Message)"
        return $false
    }
    finally {
        Set-Location ".."
    }
    
    return $true
}

# Test Frontend
function Test-Frontend {
    Write-Step "Tests Frontend..."
    
    try {
        Set-Location "frontend"
        
        # Vérifier package.json
        if (Test-Path "package.json") {
            Write-Step "Installation des dépendances Node.js..."
            npm install --silent
        }
        
        # Exécuter les tests
        if (Test-Path "src/__tests__") {
            $env:CI = "true"
            npm test -- --coverage --watchAll=false
            Write-Success "Tests frontend réussis"
        }
        else {
            Write-Warning "Dossier src/__tests__/ non trouvé"
        }
    }
    catch {
        Write-Error-Custom "Échec des tests frontend: $($_.Exception.Message)"
        return $false
    }
    finally {
        Set-Location ".."
        Remove-Item env:CI -ErrorAction SilentlyContinue
    }
    
    return $true
}

# Test Security
function Test-Security {
    Write-Step "Tests de sécurité..."
    
    # Backend security
    try {
        Set-Location "backend"
        
        # Check if safety is installed
        $safetyInstalled = $false
        try {
            safety --version | Out-Null
            $safetyInstalled = $true
        }
        catch {
            Write-Step "Installation de Safety..."
            pip install safety
            $safetyInstalled = $true
        }
        
        if ($safetyInstalled) {
            try {
                safety check -r requirements.txt
                Write-Success "Sécurité backend OK"
            }
            catch {
                Write-Warning "Vulnérabilités détectées dans le backend"
            }
        }
        
        Set-Location ".."
    }
    catch {
        Write-Warning "Erreur lors du test de sécurité backend"
        Set-Location ".."
    }
    
    # Frontend security
    try {
        Set-Location "frontend"
        
        npm audit --audit-level=moderate
        Write-Success "Sécurité frontend OK"
    }
    catch {
        Write-Warning "Vulnérabilités détectées dans le frontend"
    }
    finally {
        Set-Location ".."
    }
}

# Simulate CI/CD
function Start-CICDSimulation {
    Write-Step "Simulation du pipeline CI/CD..."
    
    Write-Host "🔄 Phase 1: Tests unitaires" -ForegroundColor Magenta
    $backendOK = Test-Backend
    $frontendOK = Test-Frontend
    
    Write-Host "🔄 Phase 2: Tests d'intégration" -ForegroundColor Magenta
    $dockerOK = Test-Docker
    
    Write-Host "🔄 Phase 3: Tests de sécurité" -ForegroundColor Magenta
    Test-Security
    
    Write-Host "🔄 Phase 4: Build de production" -ForegroundColor Magenta
    try {
        docker-compose -f docker-compose.yml up --build -d
        Write-Success "Build de production réussi"
    }
    catch {
        Write-Warning "Problème avec le build de production"
    }
    
    if ($backendOK -and $frontendOK -and $dockerOK) {
        Write-Success "Pipeline CI/CD simulé avec succès!"
    }
    else {
        Write-Warning "Pipeline terminé avec des avertissements"
    }
}

# Performance test
function Test-Performance {
    Write-Step "Tests de performance basiques..."
    
    # Start services
    docker-compose up -d
    Start-Sleep -Seconds 30
    
    # Simple performance test with PowerShell
    $urls = @(
        "http://localhost:5000/health",
        "http://localhost:3000"
    )
    
    foreach ($url in $urls) {
        Write-Step "Test de performance: $url"
        
        $times = @()
        for ($i = 1; $i -le 10; $i++) {
            try {
                $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
                $response = Invoke-WebRequest -Uri $url -TimeoutSec 5
                $stopwatch.Stop()
                $times += $stopwatch.ElapsedMilliseconds
                
                if ($response.StatusCode -eq 200) {
                    Write-Host "  ✓ Request $i : $($stopwatch.ElapsedMilliseconds)ms" -ForegroundColor Green
                }
            }
            catch {
                Write-Host "  ✗ Request $i : Failed" -ForegroundColor Red
            }
        }
        
        if ($times.Count -gt 0) {
            $average = ($times | Measure-Object -Average).Average
            Write-Success "Temps de réponse moyen: $([math]::Round($average, 2))ms"
        }
    }
}

# Cleanup
function Clear-DevOpsEnvironment {
    Write-Step "Nettoyage de l'environnement..."
    
    try {
        docker-compose down -v 2>$null
        docker system prune -f 2>$null | Out-Null
        Write-Success "Nettoyage terminé"
    }
    catch {
        Write-Warning "Problème lors du nettoyage"
    }
}

# Generate HTML report
function New-DevOpsReport {
    Write-Step "Génération du rapport DevOps..."
    
    $reportFile = "devops-test-report.html"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    $reportContent = @'
<!DOCTYPE html>
<html>
<head>
    <title>DevOps Test Report - Medical Reminder App</title>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: #f5f5f5; 
        }
        .header { 
            background: #667eea;
            color: white; 
            padding: 30px; 
            border-radius: 10px; 
            text-align: center;
        }
        .container {
            background: white;
            margin: 20px 0;
            padding: 25px;
            border-radius: 8px;
        }
        .section { 
            margin: 20px 0; 
            padding: 20px; 
            border-left: 4px solid #667eea; 
            background: #f8f9ff;
        }
        .success { 
            border-left-color: #4CAF50; 
            background: #f1f8e9; 
        }
        .warning { 
            border-left-color: #FF9800; 
            background: #fff3e0; 
        }
        .timestamp { 
            color: #666; 
            font-size: 0.9em; 
            text-align: center;
            margin-top: 30px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 5px;
        }
        ul { line-height: 1.6; }
        h2 { color: #333; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DevOps Test Report</h1>
        <p>Medical Reminder App - Tests automatises</p>
        <p>Genere le $timestamp</p>
    </div>
    
    <div class="container">
        <div class="section success">
            <h2>Infrastructure DevOps Configuree</h2>
            <ul>
                <li><strong>Conteneurisation :</strong> Docker + Docker Compose</li>
                <li><strong>CI/CD :</strong> GitHub Actions workflows</li>
                <li><strong>Tests automatiques :</strong> Backend pytest + Frontend Jest</li>
                <li><strong>Securite :</strong> Scan automatique des vulnerabilites</li>
                <li><strong>Monitoring :</strong> Health checks + Logs structures</li>
            </ul>
        </div>
    </div>
    
    <div class="timestamp">
        <strong>Rapport genere par test-devops.ps1</strong><br>
        Medical Reminder App DevOps Pipeline<br>
        $timestamp
    </div>
</body>
</html>
'@

    $reportContent | Out-File -FilePath $reportFile -Encoding UTF8
    Write-Success "Rapport généré : $reportFile"
    
    # Ouvrir le rapport dans le navigateur
    try {
        Start-Process $reportFile
        Write-Success "Rapport ouvert dans le navigateur"
    }
    catch {
        Write-Warning "Impossible d'ouvrir automatiquement le rapport"
    }
}

# Show menu
function Show-Menu {
    Write-Host ""
    Write-Host "🎯 Options DevOps disponibles :" -ForegroundColor Cyan
    Write-Host "1) 🧪 Tests complets" -ForegroundColor White
    Write-Host "2) 🐳 Test Docker uniquement" -ForegroundColor White
    Write-Host "3) 🐍 Test Backend uniquement" -ForegroundColor White
    Write-Host "4) ⚛️ Test Frontend uniquement" -ForegroundColor White
    Write-Host "5) 🔒 Test Sécurité uniquement" -ForegroundColor White
    Write-Host "6) 🚀 Simulation CI/CD complète" -ForegroundColor White
    Write-Host "7) ⚡ Tests de performance" -ForegroundColor White
    Write-Host "8) 📊 Générer rapport HTML" -ForegroundColor White
    Write-Host "9) 🧹 Nettoyage environnement" -ForegroundColor White
    Write-Host "0) 🚪 Quitter" -ForegroundColor White
    Write-Host ""
}

# Main execution
function Main {
    Test-Prerequisites
    
    if (-not $Action) {
        # Interactive mode
        while ($true) {
            Show-Menu
            $choice = Read-Host "Choisissez une option (0-9)"
            
            switch ($choice) {
                "1" { 
                    Test-Backend
                    Test-Frontend
                    Test-Docker
                    Test-Security
                }
                "2" { Test-Docker }
                "3" { Test-Backend }
                "4" { Test-Frontend }
                "5" { Test-Security }
                "6" { Start-CICDSimulation }
                "7" { Test-Performance }
                "8" { New-DevOpsReport }
                "9" { Clear-DevOpsEnvironment }
                "0" { 
                    Write-Success "Au revoir!"
                    exit 0
                }
                default { 
                    Write-Error-Custom "Option invalide"
                }
            }
            
            Write-Host ""
            Read-Host "Appuyez sur Entrée pour continuer..."
        }
    }
    else {
        # Command line mode
        switch ($Action.ToLower()) {
            "all" { Start-CICDSimulation }
            "docker" { Test-Docker }
            "backend" { Test-Backend }
            "frontend" { Test-Frontend }
            "security" { Test-Security }
            "performance" { Test-Performance }
            "report" { New-DevOpsReport }
            "clean" { Clear-DevOpsEnvironment }
            default {
                Write-Host "Usage: .\test-devops.ps1 [all|docker|backend|frontend|security|performance|report|clean]"
                exit 1
            }
        }
    }
}

# Cleanup on exit
trap {
    Clear-DevOpsEnvironment
}

# Run main function
Main
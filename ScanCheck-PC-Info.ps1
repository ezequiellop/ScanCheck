# ============================================================
# ScanCheck -- Inventario PC + QR para app movil
# Danaide Enterprise
# ============================================================

$ARCHIVO = "$PSScriptRoot\Inventario_PC_$env:COMPUTERNAME.csv"
$XLSX    = "$PSScriptRoot\Inventario_PC_$env:COMPUTERNAME.xlsx"
$TXT     = "$PSScriptRoot\Inventario_PC_$env:COMPUTERNAME.txt"
$LOG     = "$PSScriptRoot\Inventario_ERROR_$env:COMPUTERNAME.txt"
$QR_HTML = "$PSScriptRoot\ScanCheck_QR_$env:COMPUTERNAME.html"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ScanCheck -- Inventario PC + QR" -ForegroundColor Cyan
Write-Host "  $env:COMPUTERNAME" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Recolectando datos del sistema..." -ForegroundColor Yellow

try {
    $cs   = Get-CimInstance Win32_ComputerSystem
    $bios = Get-CimInstance Win32_BIOS
    $os   = Get-CimInstance Win32_OperatingSystem
    $cpu  = Get-CimInstance Win32_Processor | Select-Object -First 1
    $net  = Get-CimInstance Win32_NetworkAdapterConfiguration |
            Where-Object { $_.IPEnabled -eq $true } |
            Select-Object -First 1

    $totalMemGB = [math]::Round($cs.TotalPhysicalMemory / 1GB, 2)
    $freeMemGB  = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
    $usedMemGB  = [math]::Round($totalMemGB - $freeMemGB, 2)
    $memUsePct  = [math]::Round(($usedMemGB / $totalMemGB) * 100, 2)
    $ip         = if ($net) { $net.IPAddress[0] } else { 'N/A' }
    $mac        = if ($net) { $net.MACAddress }   else { 'N/A' }

    # --- AssureID ---
    $assureIDVer     = 'No instalado'
    $docLibVer       = 'No instalado'
    $licEdicion      = 'N/A'
    $licKey          = 'N/A'
    $licTipo         = 'N/A'
    $licActivacion   = 'N/A'
    $licVencimiento  = 'N/A'
    $licActivationID = 'N/A'

    $assureIDReg = "HKLM:\SOFTWARE\AssureTec\AssureID Professional"
    if (Test-Path $assureIDReg) {
        $regData     = Get-ItemProperty $assureIDReg
        $assureIDVer = $regData.ProductVersion

        $docTypesXml = "C:\Program Files\Acuant\AssureID\library\DocumentTypes.xml"
        if (Test-Path $docTypesXml) {
            $xml       = [xml](Get-Content $docTypesXml)
            $docLibVer = $xml.documentTypes.libraryVersion
        }

        $logPath = "C:\Users\Public\Documents\My AssureID Data\logs\AssureTec.AssureID.LicenseActivator.log"
        if (Test-Path $logPath) {
            $logContent = Get-Content $logPath -Raw

            $m = [regex]::Matches($logContent, 'Product edition name = ([^<]+)')
            if ($m.Count -gt 0) { $licEdicion = $m[$m.Count-1].Groups[1].Value.Trim() }

            $m = [regex]::Matches($logContent, 'Key = ([^<]+)')
            if ($m.Count -gt 0) { $licKey = $m[$m.Count-1].Groups[1].Value.Trim() }

            $m = [regex]::Matches($logContent, 'Type = ([^<]+)')
            if ($m.Count -gt 0) { $licTipo = $m[$m.Count-1].Groups[1].Value.Trim() }

            $m = [regex]::Matches($logContent, 'Activation date = ([^<]+)')
            if ($m.Count -gt 0) { $licActivacion = $m[$m.Count-1].Groups[1].Value.Trim() }

            $m = [regex]::Matches($logContent, 'Maintenance Expiration Date = ([^<]+)')
            if ($m.Count -gt 0) { $licVencimiento = $m[$m.Count-1].Groups[1].Value.Trim() }

            $m = [regex]::Matches($logContent, 'Activation ID = ([^<]+)')
            if ($m.Count -gt 0) { $licActivationID = $m[$m.Count-1].Groups[1].Value.Trim() }
        }
    }

    $data = [PSCustomObject]@{
        Fecha                    = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        NombrePC                 = $env:COMPUTERNAME
        Usuario                  = $env:USERNAME
        Fabricante               = $cs.Manufacturer
        Modelo                   = $cs.Model
        Serial                   = $bios.SerialNumber
        IP                       = $ip
        MAC                      = $mac
        CPU                      = $cpu.Name
        UsoCPU_Porcentaje        = $cpu.LoadPercentage
        MemoriaTotal_GB          = $totalMemGB
        MemoriaLibre_GB          = $freeMemGB
        MemoriaUsada_GB          = $usedMemGB
        UsoMemoria_Porcentaje    = $memUsePct
        AssureID_Engine_Version  = $assureIDVer
        AssureID_DocLib_Version  = $docLibVer
        AssureID_Edicion         = $licEdicion
        AssureID_LicenseKey      = $licKey
        AssureID_Tipo            = $licTipo
        AssureID_Activacion      = $licActivacion
        AssureID_Vencimiento     = $licVencimiento
        AssureID_ActivationID    = $licActivationID
    }

    # --- CSV ---
    $data | Export-Csv -Path $ARCHIVO -NoTypeInformation -Encoding UTF8 -Delimiter ";"
    Write-Host "  CSV generado: $ARCHIVO" -ForegroundColor Green

} catch {
    "ERROR recolectando datos: $_" | Out-File -FilePath $LOG -Encoding UTF8
    Write-Host "Error al recolectar datos. Ver: $LOG" -ForegroundColor Red
    exit
}

# --- Excel (si disponible) ---
$excelOK = $false
try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    $wb = $excel.Workbooks.Open($ARCHIVO)
    $ws = $wb.Worksheets.Item(1)
    $ws.UsedRange.EntireColumn.AutoFit() | Out-Null
    $listObj = $ws.ListObjects.Add(1, $ws.UsedRange, $null, 1)
    $listObj.Name = "Inventario"
    $listObj.TableStyle = "TableStyleMedium2"
    $wb.SaveAs($XLSX, 51)
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
    Write-Host "  Excel generado: $XLSX" -ForegroundColor Green
    $excelOK = $true
} catch {
    Write-Host "  Excel no disponible (se omite)." -ForegroundColor Gray
}

# --- TXT ---
$linea = "-" * 50
$contenido = "$linea`n  INVENTARIO PC - $env:COMPUTERNAME`n$linea`n"
$data.PSObject.Properties | ForEach-Object {
    $contenido += "  {0,-25}: {1}`n" -f $_.Name, $_.Value
}
$contenido += "$linea`n"
[System.IO.File]::WriteAllText($TXT, $contenido, [System.Text.Encoding]::UTF8)
Write-Host "  TXT generado: $TXT" -ForegroundColor Green

# ============================================================
# --- QR para ScanCheck ---
# ============================================================
Write-Host ""
Write-Host "Generando QR para ScanCheck..." -ForegroundColor Yellow

$jsonObj = [ordered]@{
    NombrePC               = $data.NombrePC
    Serial                 = $data.Serial
    Fabricante             = $data.Fabricante
    Modelo                 = $data.Modelo
    IP                     = $data.IP
    MAC                    = $data.MAC
    CPU                    = $data.CPU
    MemoriaTotal_GB        = $data.MemoriaTotal_GB
    MemoriaUsada_GB        = $data.MemoriaUsada_GB
    UsoMemoria_Porcentaje  = $data.UsoMemoria_Porcentaje
    UsoCPU_Porcentaje      = $data.UsoCPU_Porcentaje
    AssureID_Engine        = $data.AssureID_Engine_Version
    AssureID_DocLib        = $data.AssureID_DocLib_Version
    AssureID_Edicion       = $data.AssureID_Edicion
    AssureID_LicenseKey    = $data.AssureID_LicenseKey
    AssureID_Tipo          = $data.AssureID_Tipo
    AssureID_Activacion    = $data.AssureID_Activacion
    AssureID_Vencimiento   = $data.AssureID_Vencimiento
    AssureID_ActivationID  = $data.AssureID_ActivationID
    Fecha                  = $data.Fecha
    Usuario                = $data.Usuario
}

$jsonStr = $jsonObj | ConvertTo-Json -Compress
$qrData  = [System.Uri]::EscapeDataString($jsonStr)
$qrUrl   = "https://api.qrserver.com/v1/create-qr-code/?size=380x380&ecc=M&data=$qrData"

# Filas de la tabla HTML (sin emojis)
$tablaFilas = ""
$jsonObj.GetEnumerator() | ForEach-Object {
    $color = "#e8f4f8"
    if ($_.Key -like "AssureID*") { $color = "#a8d8ff" }
    if ($_.Key -eq "NombrePC" -or $_.Key -eq "Serial") { $color = "#00d4aa" }
    $tablaFilas += "<tr><td style='color:#4a6a7d;padding:5px 10px;font-size:12px'>" + $_.Key + "</td><td style='color:" + $color + ";padding:5px 10px;font-size:12px;font-family:monospace'>" + $_.Value + "</td></tr>`n"
}

# Estado AssureID sin emojis
$assureStatus = if ($data.AssureID_Engine_Version -ne 'No instalado') { "Instalado v" + $data.AssureID_Engine_Version } else { "No instalado" }
$licStatus    = if ($data.AssureID_LicenseKey -ne 'N/A') { "Activa - " + $data.AssureID_Tipo } else { "Sin licencia detectada" }
$licVenc      = if ($data.AssureID_Vencimiento -ne 'N/A') { $data.AssureID_Vencimiento } else { "N/A" }

$pc    = $data.NombrePC
$fecha = $data.Fecha
$user  = $data.Usuario
$fab   = $data.Fabricante
$mod   = $data.Modelo
$ser   = $data.Serial
$ipv   = $data.IP
$macv  = $data.MAC
$memU  = $data.MemoriaUsada_GB
$memT  = $data.MemoriaTotal_GB
$memP  = $data.UsoMemoria_Porcentaje
$cpuP  = $data.UsoCPU_Porcentaje

$htmlContent = @"
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ScanCheck QR - $pc</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Segoe UI',Arial,sans-serif; background:#0f2027; color:#e8f4f8; padding:20px; }
  .container { max-width:560px; margin:0 auto; }
  .header { background:#162436; border:1px solid rgba(0,212,170,.3); border-radius:16px; padding:20px; margin-bottom:16px; }
  .header h1 { font-size:18px; color:#00d4aa; margin-bottom:6px; }
  .header .pc { font-size:20px; color:#e8f4f8; font-weight:700; }
  .header .meta { font-size:12px; color:#8bafc4; margin-top:4px; }
  .steps { background:rgba(0,212,170,.08); border:1px solid rgba(0,212,170,.2); border-radius:12px; padding:14px 16px; margin-bottom:16px; }
  .steps h3 { font-size:13px; color:#00d4aa; margin-bottom:8px; }
  .steps ol { padding-left:18px; font-size:12px; color:#8bafc4; line-height:2.2; }
  .steps li b { color:#e8f4f8; }
  .qr-box { background:white; border-radius:16px; padding:16px; text-align:center; margin-bottom:16px; }
  .qr-box img { width:320px; height:320px; display:block; margin:0 auto; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
  .card { background:#162436; border:1px solid rgba(0,212,170,.15); border-radius:10px; padding:12px; }
  .card .lbl { font-size:10px; color:#4a6a7d; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; }
  .card .val { font-size:13px; color:#e8f4f8; font-weight:600; }
  .assure { background:#162436; border:1px solid rgba(0,174,255,.2); border-radius:12px; padding:14px; margin-bottom:16px; }
  .assure h3 { font-size:13px; color:#00aeff; margin-bottom:10px; }
  .arow { display:flex; justify-content:space-between; font-size:12px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,.05); }
  .arow:last-child { border-bottom:none; }
  .arow .k { color:#4a6a7d; }
  .arow .v { color:#e8f4f8; font-family:monospace; text-align:right; max-width:220px; word-break:break-all; }
  table { width:100%; border-collapse:collapse; background:#162436; border-radius:12px; overflow:hidden; margin-bottom:16px; }
  th { background:#1e3347; color:#4a6a7d; font-size:10px; text-transform:uppercase; letter-spacing:1px; padding:8px 10px; text-align:left; }
  tr:nth-child(even) { background:rgba(255,255,255,.02); }
  .footer { font-size:10px; color:#4a6a7d; text-align:center; padding-top:8px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>ScanCheck -- Inventario PC</h1>
    <div class="pc">$pc</div>
    <div class="meta">$fecha | Usuario: $user</div>
  </div>
  <div class="steps">
    <h3>Como importar a ScanCheck</h3>
    <ol>
      <li>Abri <b>ScanCheck</b> en tu celular</li>
      <li>Toca <b>Nuevo Registro</b></li>
      <li>Toca <b>Escanear QR del Script PS</b></li>
      <li>Apunta la camara al codigo QR</li>
      <li>Los campos se llenan <b>automaticamente</b></li>
    </ol>
  </div>
  <div class="qr-box">
    <img src="$qrUrl" alt="QR ScanCheck" onerror="this.outerHTML='<p style=color:#ff5555;padding:20px>Sin internet para generar QR. Conectate y recarga.</p>'">
  </div>
  <div class="grid">
    <div class="card"><div class="lbl">Equipo</div><div class="val">$fab $mod</div></div>
    <div class="card"><div class="lbl">N Serie</div><div class="val" style="color:#00d4aa">$ser</div></div>
    <div class="card"><div class="lbl">IP</div><div class="val">$ipv</div></div>
    <div class="card"><div class="lbl">RAM Usada</div><div class="val">${memU}/${memT} GB ($memP%)</div></div>
    <div class="card"><div class="lbl">CPU Uso</div><div class="val">$cpuP%</div></div>
    <div class="card"><div class="lbl">MAC</div><div class="val" style="font-size:11px">$macv</div></div>
  </div>
  <div class="assure">
    <h3>AssureID</h3>
    <div class="arow"><span class="k">Engine</span><span class="v">$assureStatus</span></div>
    <div class="arow"><span class="k">Doc Library</span><span class="v">$($data.AssureID_DocLib_Version)</span></div>
    <div class="arow"><span class="k">Edicion</span><span class="v">$($data.AssureID_Edicion)</span></div>
    <div class="arow"><span class="k">Licencia</span><span class="v">$licStatus</span></div>
    <div class="arow"><span class="k">License Key</span><span class="v">$($data.AssureID_LicenseKey)</span></div>
    <div class="arow"><span class="k">Activacion</span><span class="v">$($data.AssureID_Activacion)</span></div>
    <div class="arow"><span class="k">Vencimiento</span><span class="v" style="color:#ffa040">$licVenc</span></div>
    <div class="arow"><span class="k">Activation ID</span><span class="v">$($data.AssureID_ActivationID)</span></div>
  </div>
  <table>
    <tr><th>Campo</th><th>Valor</th></tr>
    $tablaFilas
  </table>
  <div class="footer">Generado por ScanCheck -- Danaide Enterprise | $fecha</div>
</div>
</body>
</html>
"@

[System.IO.File]::WriteAllText($QR_HTML, $htmlContent, [System.Text.Encoding]::UTF8)
Write-Host "  QR generado correctamente" -ForegroundColor Green

# --- Abrir resultados ---
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Todo listo!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Start-Process $QR_HTML
Write-Host "  Se abrio la pagina QR en el navegador." -ForegroundColor Cyan
if (-not $excelOK) { Start-Process notepad.exe $TXT }
Write-Host ""
Write-Host "  Archivos generados:" -ForegroundColor White
Write-Host "    CSV : $ARCHIVO" -ForegroundColor Gray
Write-Host "    TXT : $TXT" -ForegroundColor Gray
if ($excelOK) { Write-Host "    XLSX: $XLSX" -ForegroundColor Gray }
Write-Host "    QR  : $QR_HTML" -ForegroundColor Gray
Write-Host ""
Write-Host "  Presiona cualquier tecla para cerrar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

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

    # --- Uptime ---
    $uptimeSpan    = (Get-Date) - $os.LastBootUpTime
    $uptimeStr     = "$($uptimeSpan.Days)d $($uptimeSpan.Hours)h $($uptimeSpan.Minutes)m"
    $ultimoReinicio = $os.LastBootUpTime.ToString('yyyy-MM-dd HH:mm')

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

    # --- DESKO PentaScanner ---
    $deskoScanner = 'No detectado'
    $deskoSerial  = 'N/A'
    $deskoStatus  = 'N/A'
    $desko = Get-PnpDevice | Where-Object { $_.InstanceId -like "*VID_1AC2&PID_0205*" }
    if ($desko) {
        $deskoScanner = $desko.FriendlyName
        $deskoStatus  = $desko.Status
        $m = [regex]::Match($desko.InstanceId, '\\(\d+_\d+)$')
        if ($m.Success) { $deskoSerial = $m.Groups[1].Value -replace '_', ' ' }
    }

    # --- Disco rigido (SMART + espacio) ---
    $discoEstado   = 'N/A'
    $discoModelo   = 'N/A'
    $discoSerial   = 'N/A'
    $discoTipo     = 'N/A'
    $discoTotalGB  = 'N/A'
    $discoLibreGB  = 'N/A'
    $discoUsoPct   = 'N/A'
    $discoTempC    = 'N/A'

    try {
        $disco = Get-PhysicalDisk | Select-Object -First 1
        if ($disco) {
            $discoModelo  = $disco.FriendlyName
            $discoSerial  = $disco.SerialNumber.Trim()
            $discoTipo    = $disco.MediaType  # HDD / SSD / Unspecified
            $discoEstado  = $disco.HealthStatus  # Healthy / Warning / Unhealthy
        }
        # Espacio en disco C:
        $driveC = Get-PSDrive -Name C -ErrorAction SilentlyContinue
        if ($driveC) {
            $usedC      = [math]::Round($driveC.Used / 1GB, 1)
            $freeC      = [math]::Round($driveC.Free / 1GB, 1)
            $totalC     = [math]::Round(($driveC.Used + $driveC.Free) / 1GB, 1)
            $discoTotalGB = $totalC
            $discoLibreGB = $freeC
            $discoUsoPct  = [math]::Round(($usedC / $totalC) * 100, 1)
        }
        # Temperatura del disco via MSFT_StorageReliabilityCounter (Win8+)
        try {
            $tempObj = Get-StorageReliabilityCounter -PhysicalDisk $disco -ErrorAction Stop
            if ($tempObj.Temperature -gt 0) { $discoTempC = $tempObj.Temperature }
        } catch { $discoTempC = 'N/D' }
    } catch { $discoEstado = 'Error al leer disco' }

    # --- Puertos USB (estado general + scanner DESKO) ---
    $usbControladores = 'N/A'
    $usbErrores       = 'Ninguno'
    $usbDesconocidos  = 0

    try {
        $usbCtrl = Get-PnpDevice | Where-Object { $_.Class -eq 'USB' -and $_.Status -ne 'OK' }
        $usbDesconocidos = ($usbCtrl | Measure-Object).Count
        if ($usbDesconocidos -gt 0) {
            $usbErrores = ($usbCtrl | Select-Object -ExpandProperty FriendlyName) -join '; '
        }
        $usbControladores = (Get-PnpDevice | Where-Object { $_.Class -eq 'USB' } | Measure-Object).Count
    } catch { $usbControladores = 'Error al leer USB' }

    # --- Windows Update: reinicios pendientes ---
    $reinicioPendiente = 'No'
    try {
        $wuReg1 = Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired'
        $wuReg2 = Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending'
        $wuReg3 = Test-Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\PendingFileRenameOperations'
        if ($wuReg1 -or $wuReg2 -or $wuReg3) { $reinicioPendiente = 'SI - Reinicio requerido' }
    } catch {}

    # --- Actualizaciones pendientes (conteo rapido sin descargar) ---
    $updatesPendientes = 'N/D'
    try {
        $session = New-Object -ComObject Microsoft.Update.Session
        $searcher = $session.CreateUpdateSearcher()
        $result = $searcher.Search("IsInstalled=0 and Type='Software'")
        $updatesPendientes = $result.Updates.Count
    } catch { $updatesPendientes = 'N/D' }

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
        Uptime                   = $uptimeStr
        UltimoReinicio           = $ultimoReinicio
        ReinicioPendiente        = $reinicioPendiente
        UpdatesPendientes        = $updatesPendientes
        Disco_Modelo             = $discoModelo
        Disco_Serial             = $discoSerial
        Disco_Tipo               = $discoTipo
        Disco_Estado_SMART       = $discoEstado
        Disco_Total_GB           = $discoTotalGB
        Disco_Libre_GB           = $discoLibreGB
        Disco_Uso_Porcentaje     = $discoUsoPct
        Disco_Temperatura_C      = $discoTempC
        USB_Dispositivos_Total   = $usbControladores
        USB_Dispositivos_Error   = $usbDesconocidos
        USB_Errores_Detalle      = $usbErrores
        AssureID_Engine_Version  = $assureIDVer
        AssureID_DocLib_Version  = $docLibVer
        AssureID_Edicion         = $licEdicion
        AssureID_LicenseKey      = $licKey
        AssureID_Tipo            = $licTipo
        AssureID_Activacion      = $licActivacion
        AssureID_Vencimiento     = $licVencimiento
        AssureID_ActivationID    = $licActivationID
        DESKO_Scanner_Modelo     = $deskoScanner
        DESKO_Scanner_Serial     = $deskoSerial
        DESKO_Scanner_Status     = $deskoStatus
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
    $contenido += "  {0,-30}: {1}`n" -f $_.Name, $_.Value
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
    PC   = $data.NombrePC
    USR  = $data.Usuario
    SN   = $data.Serial
    FAB  = $data.Fabricante
    MOD  = $data.Modelo
    IP   = $data.IP
    MAC  = $data.MAC
    CPU  = $data.CPU
    CPUP = [string]$data.UsoCPU_Porcentaje
    RAMT = [string]$data.MemoriaTotal_GB
    RAMU = [string]$data.MemoriaUsada_GB
    RAMP = [string]$data.UsoMemoria_Porcentaje
    UPT  = $data.Uptime
    LBT  = $data.UltimoReinicio
    RPD  = $data.ReinicioPendiente
    UPD  = [string]$data.UpdatesPendientes
    DSM  = $data.Disco_Modelo
    DSS  = $data.Disco_Serial
    DST  = $data.Disco_Tipo
    DSH  = $data.Disco_Estado_SMART
    DSTG = [string]$data.Disco_Total_GB
    DSLG = [string]$data.Disco_Libre_GB
    DSUP = [string]$data.Disco_Uso_Porcentaje
    DSTC = [string]$data.Disco_Temperatura_C
    USBT = [string]$data.USB_Dispositivos_Total
    USBE = [string]$data.USB_Dispositivos_Error
    AEV  = $data.AssureID_Engine_Version
    ADL  = $data.AssureID_DocLib_Version
    AED  = $data.AssureID_Edicion
    ALK  = $data.AssureID_LicenseKey
    ATI  = $data.AssureID_Tipo
    AAC  = $data.AssureID_Activacion
    AVN  = $data.AssureID_Vencimiento
    AAI  = $data.AssureID_ActivationID
    TS   = $data.Fecha
    DSKS = $data.DESKO_Scanner_Serial
    DSKM = $data.DESKO_Scanner_Modelo
    DSKO = $data.DESKO_Scanner_Status
}

$jsonStr = $jsonObj | ConvertTo-Json -Compress
$qrData  = [System.Uri]::EscapeDataString($jsonStr)
$qrUrl   = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&ecc=M&data=$qrData"

# Helper para color segun estado
$discoColor = if ($data.Disco_Estado_SMART -eq 'Healthy') { '#00d4aa' } elseif ($data.Disco_Estado_SMART -like '*Warning*') { '#ffa040' } else { '#ff5555' }
$usbColor   = if ($data.USB_Dispositivos_Error -eq 0) { '#00d4aa' } else { '#ff5555' }
$reinicioColor = if ($data.ReinicioPendiente -eq 'No') { '#00d4aa' } else { '#ffa040' }
$updColor   = if ($data.UpdatesPendientes -eq 0) { '#00d4aa' } elseif ($data.UpdatesPendientes -eq 'N/D') { '#8bafc4' } else { '#ffa040' }

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
$assureStatus = if ($data.AssureID_Engine_Version -ne 'No instalado') { "Instalado v" + $data.AssureID_Engine_Version } else { "No instalado" }
$licStatus    = if ($data.AssureID_LicenseKey -ne 'N/A') { "Activa - " + $data.AssureID_Tipo } else { "Sin licencia detectada" }
$licVenc      = if ($data.AssureID_Vencimiento -ne 'N/A') { $data.AssureID_Vencimiento } else { "N/A" }

$htmlContent = @"
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ScanCheck QR - $pc</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Segoe UI',Arial,sans-serif; background:#0f2027; color:#e8f4f8; padding:20px; }
  .container { max-width:580px; margin:0 auto; }
  .header { background:#162436; border:1px solid rgba(0,212,170,.3); border-radius:16px; padding:20px; margin-bottom:16px; }
  .header h1 { font-size:18px; color:#00d4aa; margin-bottom:6px; }
  .header .pc { font-size:20px; color:#e8f4f8; font-weight:700; }
  .header .meta { font-size:12px; color:#8bafc4; margin-top:4px; }
  .steps { background:rgba(0,212,170,.08); border:1px solid rgba(0,212,170,.2); border-radius:12px; padding:14px 16px; margin-bottom:16px; }
  .steps h3 { font-size:13px; color:#00d4aa; margin-bottom:8px; }
  .steps ol { padding-left:18px; font-size:12px; color:#8bafc4; line-height:2.2; }
  .steps li b { color:#e8f4f8; }
  .qr-box { background:white; border-radius:16px; padding:16px; text-align:center; margin-bottom:16px; }
  .qr-box img { width:340px; height:340px; display:block; margin:0 auto; }
  .section { background:#162436; border:1px solid rgba(0,212,170,.15); border-radius:12px; padding:14px; margin-bottom:14px; }
  .section h3 { font-size:12px; color:#4a6a7d; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .card { background:#0f2027; border-radius:8px; padding:10px 12px; }
  .card .lbl { font-size:10px; color:#4a6a7d; text-transform:uppercase; letter-spacing:1px; margin-bottom:3px; }
  .card .val { font-size:13px; color:#e8f4f8; font-weight:600; }
  .arow { display:flex; justify-content:space-between; font-size:12px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,.05); }
  .arow:last-child { border-bottom:none; }
  .arow .k { color:#4a6a7d; }
  .arow .v { color:#e8f4f8; font-family:monospace; text-align:right; max-width:260px; word-break:break-all; }
  .badge { display:inline-block; padding:2px 10px; border-radius:20px; font-size:11px; font-weight:700; }
  .footer { font-size:10px; color:#4a6a7d; text-align:center; padding-top:8px; }
</style>
<script>window.addEventListener('pageshow',function(e){if(e.persisted)location.reload();});</script>
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
    <img src="$qrUrl" alt="QR ScanCheck" onerror="this.outerHTML='<p style=color:#ff5555;padding:20px>Sin internet. Conectate y recarga.</p>'">
  </div>

  <div class="section">
    <h3>Sistema</h3>
    <div class="grid2">
      <div class="card"><div class="lbl">Equipo</div><div class="val">$fab $mod</div></div>
      <div class="card"><div class="lbl">N Serie</div><div class="val" style="color:#00d4aa">$ser</div></div>
      <div class="card"><div class="lbl">IP</div><div class="val">$ipv</div></div>
      <div class="card"><div class="lbl">MAC</div><div class="val" style="font-size:10px">$macv</div></div>
      <div class="card"><div class="lbl">CPU Uso</div><div class="val">$cpuP%</div></div>
      <div class="card"><div class="lbl">RAM</div><div class="val">${memU}/${memT} GB ($memP%)</div></div>
    </div>
  </div>

  <div class="section">
    <h3>Estado del sistema</h3>
    <div class="arow"><span class="k">Uptime</span><span class="v">$($data.Uptime)</span></div>
    <div class="arow"><span class="k">Ultimo reinicio</span><span class="v">$($data.UltimoReinicio)</span></div>
    <div class="arow"><span class="k">Reinicio pendiente</span><span class="v"><span class="badge" style="background:${reinicioColor}22;color:${reinicioColor}">$($data.ReinicioPendiente)</span></span></div>
    <div class="arow"><span class="k">Actualizaciones pendientes</span><span class="v"><span class="badge" style="background:${updColor}22;color:${updColor}">$($data.UpdatesPendientes)</span></span></div>
  </div>

  <div class="section">
    <h3>Disco rigido</h3>
    <div class="arow"><span class="k">Modelo</span><span class="v">$($data.Disco_Modelo)</span></div>
    <div class="arow"><span class="k">Tipo</span><span class="v">$($data.Disco_Tipo)</span></div>
    <div class="arow"><span class="k">Estado SMART</span><span class="v"><span class="badge" style="background:${discoColor}22;color:${discoColor}">$($data.Disco_Estado_SMART)</span></span></div>
    <div class="arow"><span class="k">Espacio total / libre</span><span class="v">$($data.Disco_Total_GB) GB / $($data.Disco_Libre_GB) GB ($($data.Disco_Uso_Porcentaje)% usado)</span></div>
    <div class="arow"><span class="k">Temperatura</span><span class="v">$($data.Disco_Temperatura_C) C</span></div>
    <div class="arow"><span class="k">Serial</span><span class="v">$($data.Disco_Serial)</span></div>
  </div>

  <div class="section">
    <h3>USB</h3>
    <div class="arow"><span class="k">Dispositivos USB detectados</span><span class="v">$($data.USB_Dispositivos_Total)</span></div>
    <div class="arow"><span class="k">Dispositivos con error</span><span class="v"><span class="badge" style="background:${usbColor}22;color:${usbColor}">$($data.USB_Dispositivos_Error)</span></span></div>
    <div class="arow"><span class="k">Detalle errores</span><span class="v">$($data.USB_Errores_Detalle)</span></div>
    <div class="arow"><span class="k">Scanner DESKO</span><span class="v">$($data.DESKO_Scanner_Modelo) ($($data.DESKO_Scanner_Status))</span></div>
    <div class="arow"><span class="k">Serie DESKO</span><span class="v" style="color:#00d4aa">$($data.DESKO_Scanner_Serial)</span></div>
  </div>

  <div class="section" style="border-color:rgba(0,174,255,.2)">
    <h3 style="color:#00aeff">AssureID</h3>
    <div class="arow"><span class="k">Engine</span><span class="v">$assureStatus</span></div>
    <div class="arow"><span class="k">Doc Library</span><span class="v">$($data.AssureID_DocLib_Version)</span></div>
    <div class="arow"><span class="k">Edicion</span><span class="v">$($data.AssureID_Edicion)</span></div>
    <div class="arow"><span class="k">Licencia</span><span class="v">$licStatus</span></div>
    <div class="arow"><span class="k">License Key</span><span class="v">$($data.AssureID_LicenseKey)</span></div>
    <div class="arow"><span class="k">Activacion</span><span class="v">$($data.AssureID_Activacion)</span></div>
    <div class="arow"><span class="k">Vencimiento</span><span class="v" style="color:#ffa040">$licVenc</span></div>
    <div class="arow"><span class="k">Activation ID</span><span class="v">$($data.AssureID_ActivationID)</span></div>
  </div>

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

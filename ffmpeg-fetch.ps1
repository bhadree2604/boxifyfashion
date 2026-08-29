$zip = Join-Path $env:TEMP 'ffmpeg.zip'
Invoke-WebRequest -Uri 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip' -OutFile $zip
Expand-Archive -Path $zip -DestinationPath $env:TEMP -Force
$ffmpeg = Get-ChildItem -Path $env:TEMP -Recurse -Filter ffmpeg.exe | Select-Object -First 1
Write-Output $ffmpeg.FullName

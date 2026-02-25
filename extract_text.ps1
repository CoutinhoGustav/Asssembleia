
$path = "f:\ibrc-assembleia\reference.docx"
$temp = "f:\ibrc-assembleia\temp_docx"
if (Test-Path $temp) { Remove-Item -Recurse -Force $temp }
Expand-Archive -Path $path -DestinationPath $temp -Force
$xmlPath = Join-Path $temp "word\document.xml"
if (Test-Path $xmlPath) {
    [xml]$xml = Get-Content $xmlPath
    $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
    $texts = $xml.SelectNodes("//w:t", $ns)
    foreach ($t in $texts) {
        Write-Host $t.InnerText
    }
} else {
    Write-Host "document.xml not found"
}

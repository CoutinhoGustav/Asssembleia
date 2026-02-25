
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $path = "f:\ibrc-assembleia\reference.docx"
    $pdfPath = "f:\ibrc-assembleia\reference.pdf"
    if (-not (Test-Path $path)) {
        Write-Error "File not found at $path"
        return
    }
    $doc = $word.Documents.Open($path)
    $doc.SaveAs([ref]$pdfPath, [ref]17)
    $doc.Close($false)
    $word.Quit()
    Write-Host "PDF created successfully at $pdfPath"
}
catch {
    Write-Error $_.Exception.Message
}

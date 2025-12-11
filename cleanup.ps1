$user = "test@hospital.es"
$pass = "Test12345"
$pair = "$($user):$($pass)"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)
$headers = @{Authorization = "Basic $base64"}

try {
    Write-Host "Logging in..."
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/hospital/login" -Method Post -Headers $headers -SessionVariable sess -UseBasicParsing
    Write-Host "Login Status: $($response.StatusCode)"

    Write-Host "Triggering cleanup..."
    $cleanup = Invoke-WebRequest -Uri "http://localhost:8080/api/campaign/cleanup" -Method Get -WebSession $sess -UseBasicParsing
    Write-Host "Cleanup Status: $($cleanup.StatusCode)"
    Write-Host "Result: $($cleanup.Content)"
} catch {
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
    }
}

# Attempt to find Python
$PYTHON_EXE = "python"
if (!(Get-Command $PYTHON_EXE -ErrorAction SilentlyContinue)) {
    $PYTHON_EXE = "python3"
    if (!(Get-Command $PYTHON_EXE -ErrorAction SilentlyContinue)) {
        # Try finding in typical AppData location
        $paths = Get-ChildItem -Path ($env:USERPROFILE + "\AppData\Local\Programs\Python") -Recurse -Filter python.exe -Depth 2 -ErrorAction SilentlyContinue
        if ($paths) {
            $PYTHON_EXE = $paths[0].FullName
            Write-Host "Found Python at: $PYTHON_EXE"
        } else {
            Write-Host "CRITICAL ERROR: No Python interpreter found on your system."
            Write-Host "Please install Python 3.10+ from https://www.python.org/downloads/"
            return
        }
    }
}

Write-Host "Using Python: $PYTHON_EXE"

# Create virtual environment if it doesn't exist
if (!(Test-Path venv)) {
    Write-Host "Creating Virtual Environment (venv)..."
    & $PYTHON_EXE -m venv venv
}

# Activate virtual environment and install dependencies
Write-Host "Installing/Updating Real ML Dependencies (this may take a few minutes)..."
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\pip.exe install -r requirements.txt

# Run the FastAPI server
Write-Host "Starting REAL ML ANALYTICS SERVICE v1.0..."
.\venv\Scripts\uvicorn.exe main:app --reload --host 0.0.0.0 --port 8000

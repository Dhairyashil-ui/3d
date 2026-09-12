@echo off
setlocal enabledelayedexpansion

echo =====================================================================
echo Hinjawadi Phase 1 to PCCRC Building & Interior UE5 Scene Builder
echo =====================================================================

set PROJECT_PATH=%~dp0HinjawadiTwin.uproject
set SCRIPT_PATH=%~dp0Scripts\setup_walkthrough_scene.py

REM Search for Unreal Engine installations
set UE_CMD=""
if exist "C:\Program Files\Epic Games\UE_5.4\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" (
    set UE_CMD="C:\Program Files\Epic Games\UE_5.4\Engine\Binaries\Win64\UnrealEditor-Cmd.exe"
) else if exist "D:\Epic Games\UE_5.4\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" (
    set UE_CMD="D:\Epic Games\UE_5.4\Engine\Binaries\Win64\UnrealEditor-Cmd.exe"
) else if exist "C:\Program Files\Epic Games\UE_5.3\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" (
    set UE_CMD="C:\Program Files\Epic Games\UE_5.3\Engine\Binaries\Win64\UnrealEditor-Cmd.exe"
)

if %UE_CMD%=="" (
    echo [NOTE] UnrealEditor-Cmd.exe not found at default paths.
    echo Opening HinjawadiTwin.uproject directly in Unreal Engine Launcher / Editor...
    start "" "%PROJECT_PATH%"
    echo.
    echo Once the Unreal Editor opens:
    echo 1. Open the Python Console ^(Output Log -^> Python^)
    echo 2. Execute:
    echo    py "%SCRIPT_PATH:\=/%"
    echo.
    pause
    exit /b 0
)

echo Executing automated scene setup in Unreal Engine:
echo %UE_CMD% "%PROJECT_PATH%" -ExecutePythonScript="%SCRIPT_PATH%" -stdout -unattended
%UE_CMD% "%PROJECT_PATH%" -ExecutePythonScript="%SCRIPT_PATH%" -stdout -unattended

echo.
echo Launching HinjawadiTwin in Unreal Editor...
start "" "%PROJECT_PATH%"

pause

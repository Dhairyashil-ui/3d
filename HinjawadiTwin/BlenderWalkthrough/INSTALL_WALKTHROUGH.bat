@echo off
setlocal enabledelayedexpansion

echo =====================================================================
echo Hinjawadi ^& PCCRC One-Click First-Person Walkthrough Launcher
echo Blender 5.2 LTS
echo =====================================================================

set SCRIPT_DIR=%~dp0
set SCRIPT_FILE=%SCRIPT_DIR%walkthrough_controller.py
set BLEND_FILE=%SCRIPT_DIR%..\..\hinjawadi_output\hinjawadi_offices_refined.blend
if not exist "%BLEND_FILE%" set BLEND_FILE=%SCRIPT_DIR%hinjawadi_offices_refined.blend
if not exist "%BLEND_FILE%" set BLEND_FILE=C:\Users\Dhairyashil\website\hinjawadi_output\hinjawadi_offices_refined.blend
set STARTUP_DIR=%APPDATA%\Blender Foundation\Blender\5.2\scripts\startup

REM Ensure startup folder exists and copy script so it auto-loads in ALL Blender sessions
if not exist "%STARTUP_DIR%" (
    mkdir "%STARTUP_DIR%"
)
copy /Y "%SCRIPT_FILE%" "%STARTUP_DIR%\hinjawadi_walkthrough.py" >nul 2>&1
echo [OK] Walkthrough controller auto-installed to Blender startup folder.

REM Check for Blender 5.2 executable
set BLENDER_EXE=""
if exist "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" (
    set BLENDER_EXE="C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
) else (
    for %%X in (blender.exe) do (set BLENDER_EXE="%%~$PATH:X")
)

if %BLENDER_EXE%=="" (
    echo [ERROR] Blender 5.2 executable not found in default Program Files path or PATH.
    echo Please ensure Blender 5.2 LTS is installed at:
    echo "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
    pause
    exit /b 1
)

if not exist "%BLEND_FILE%" (
    echo [ERROR] Target blend file not found:
    echo %BLEND_FILE%
    pause
    exit /b 1
)

echo.
echo =====================================================================
echo HOW TO ACCESS THE WALKTHROUGH IN BLENDER:
echo.
echo OPTION 1 - SHORTCUT (FASTEST):
echo    Press ALT + W anywhere in the 3D Viewport to START WALKING!
echo.
echo OPTION 2 - TOP BAR BUTTON:
echo    Look at the top-left header of the 3D Viewport (next to Object Mode):
echo    Click the button: [ WALKTHROUGH (Alt+W) ]
echo.
echo OPTION 3 - RIGHT SIDEBAR (N-PANEL):
echo    1. In 3D Viewport, press 'N' on your keyboard to open the sidebar.
echo    2. Click the tab "Hinjawadi Walkthrough" (or the "View" tab).
echo    3. Click [ START WALKTHROUGH (Alt+W) ].
echo.
echo CONTROLS WHILE WALKING:
echo    - ARROW KEYS / W,A,S,D : Move and Strafe
echo      * UP ARROW / W    : Move Forward
echo      * DOWN ARROW / S  : Move Backward
echo      * LEFT ARROW / A  : Strafe Left
echo      * RIGHT ARROW / D : Strafe Right
echo    - MOUSE or Q, E        : Look Around / Rotate View
echo    - Shift                : Sprint (2.5x speed boost)
echo    - Keys 1-4             : Speed Presets (Walk, Normal, Fast, Turbo)
echo    - Mouse Wheel Up/Down  : Fine-tune speed (+/- 2 m/s)
echo    - Space                : Jump
echo    - R                    : Reset Camera in Front of PCCRC Building
echo    - ESC                  : Exit Walkthrough
echo =====================================================================
echo.

%BLENDER_EXE% "%BLEND_FILE%" --python "%SCRIPT_FILE%"

pause

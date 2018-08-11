@echo off
REM This batch file script does the following:
REM    + A full backup
REM    + Get latest application files from GitHub 
REM    + Refresh the application reference data in the application database
REM    + Uninstall and reinstall the application as a Windows service 
REM
REM Usage (in Admin mode):
REM    + No addtional command parameters - default to D: drive, use PROD mode for Git operations
REM    fullRedeploy-HLS-MA.bat
REM    + Use command parameters - 1st arg to specify drive, 2rd arg for Git mode (dev for DEV mode)
REM    fullRedeploy-HLS-MA.bat c dev
REM    + Use command parameters - 3rd arg to tell script to prompt to continue
REM    fullRedeploy-HLS-MA.bat c dev dopause
REM    + Use command parameters - use 2rd arg to tell script to skip the Git operations
REM    fullRedeploy-HLS-MA.bat c skipgit


set DRIVE=%1
if "%1" == "" set DRIVE=D

set ForDev=%2
if "%2" == "dev" set ForDev=dev

if "%3" == "dopause" set DoPause=dopause

set sourceFolder=%DRIVE%:\GESchedulingApp\GESchedulingApp\GEApp\GESchedApiApp
set backupRootFolder=%DRIVE%:\GESchedulingApp\Backups
set backupFolder=%DRIVE%:\GESchedulingApp\Backups\GESchedApiApp

set CurDate=%date:~10,4%-%date:~4,2%-%date:~7,2%
set timestamp=%CurDate%-%time:~0,2%%time:~3,2%%time:~6,2%

set backupFolder=%backupFolder%-%timestamp%

echo Using source folder: %sourceFolder%
echo Using backup folder: %backupFolder%

echo Check exist for: %sourceFolder%

if "%ForDev%" == "dev" (
    echo Will do Git Add, Commit and Pull
)
if "%ForDev%" == "prod" (
    echo Will do Git Fetch and hard Reset
)

if "%DoPause%" == "dopause" pause

if not exist %sourceFolder% (

    echo ==== This directory does not exist: %sourceFolder%
    echo ==== FAILED - Unable to find a source directory to do the backup! 
    echo ==== FAILED - Exiting script
    if "%DoPause%" == "dopause" pause
    exit

) else (

    echo Make sure backup root folder exist: %backupRootFolder%
    if not exist %backupRootFolder% (
        mkdir %backupRootFolder%
        echo Created backup root folder exist: %backupRootFolder%
    )
    
    mkdir %backupFolder%
    echo Created backup folder: %backupFolder%
)

if "%DoPause%" == "dopause" pause

echo Running script in the background. Activities are logged to: %backupFolder%-Log.txt 

call :Begin >%backupFolder%-Log.txt 
exit /b

:Begin

    echo ====================================================================
    echo ====================================================================
    echo ==== Timestamp: %timestamp%
    echo ==== Using source folder: %sourceFolder%
    echo ==== Using backup folder: %backupFolder%
    echo ====================================================================
    echo ====================================================================

    echo ==== Begin backing up file from %sourceFolder%
    echo ====================================================================
    echo ====================================================================

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )

    echo ====================================================================
    echo Created backup directory: %backupFolder%
    echo ====================================================================

    xcopy /S /Y /I %sourceFolder%\*.* %backupFolder%
    
    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )

    echo ====================================================================
    echo ==== Stop the application Windows service.
    echo ====================================================================

    net stop gemeetingrequestapp.exe

    REM Clear out error just in case the service is not running
    set ERRORLEVEL=0

    echo ====================================================================
    echo ==== Copied source file to backup folder.
    echo ====================================================================

    REM echo About to deleted all source files.
    REM del /Q /F /S %sourceFolder%\*.*
    REM if ERRORLEVEL 1 GOTO ERROR
    REM echo Deleted all source files.

    echo ====================================================================
    echo About to get the latest source files from GitHub
    echo ====================================================================

    CD %sourceFolder%

    if "%ForDev%" == "dev" (
        echo ==== In DEV mode - About to do Git Add, Commit and Pull
        git add -A
        git commit -m "SERVER OPERATOR MODIFICATION"
        git pull
    ) else if NOT "%ForDev%" == "prod" (
        echo ==== Skipping Git operations
    ) else (
         echo ==== In PROD mode - About to do Git Fetch and hard Reset
        REM git status
        REM git fetch --all
        REM git reset --hard origin/master       
    )

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )

    echo ====================================================================
    echo ==== Completed getting the latest source files from GitHub
    echo ====================================================================
    echo ==== About to re-import all application reference data.
    echo ====================================================================

    call runDataImports-HLS-MA.bat

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )

    echo ====================================================================
    echo ==== Done re-import all application reference data. 
    echo ====================================================================
    echo ==== About to uninstall the application's Windows service.
    echo ====================================================================

    node %sourceFolder%\runAsWinService.js -u

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )

    echo ====================================================================
    echo ==== About to re-install the application's Windows service.
    echo ====================================================================

    node %sourceFolder%\runAsWinService.js 

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
    ) else (
        echo ====================================================================
        echo ==== SUCCESS - complete all operations!
        echo ====================================================================
        set CurDate=%date:~10,4%-%date:~4,2%-%date:~7,2%
        set timestamp=%CurDate%-%time:~0,2%%time:~3,2%%time:~6,2%
        echo ==== Timestamp: %timestamp% 
        echo ====================================================================
    )

    :END

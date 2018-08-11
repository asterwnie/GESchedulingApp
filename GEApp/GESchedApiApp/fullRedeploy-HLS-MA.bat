@echo off
REM This batch file script does the following:
REM    + A full backup
REM    + Get latest application files from GitHub 
REM    + Refresh the application reference data in the application database
REM    + Uninstall and reinstall the application as a Windows service 

set DRIVE=%1
if "%1" == "" set DRIVE=D

set sourceFolder=%DRIVE%:\GESchedulingApp\GESchedulingApp\GEApp\GESchedApiApp
set backupRootFolder=%DRIVE%:\GESchedulingApp\Backups
set backupFolder=%DRIVE%:\GESchedulingApp\Backups\GESchedApiApp

set CurDate=%date:~10,4%-%date:~4,2%-%date:~7,2%
set timestamp=%CurDate%-%time:~0,2%%time:~3,2%%time:~6,2%

set backupFolder=%backupFolder%-%timestamp%

echo Using source folder: %sourceFolder%
echo Using backup folder: %backupFolder%


call :Begin >fullRedeploy-HLS-MA-Log.txt 
exit /b

:Begin

echo Timestamp: %timestamp%
echo Using source folder: %sourceFolder%
echo Using backup folder: %backupFolder%


echo Check exist for: %sourceFolder%

if not exist %sourceFolder% (

    echo This directory does not exist: %sourceFolder%
    echo Unable to find a source directory to do the backup! 
    exit

) else (

    echo Make sure backup root folder exist: %backupRootFolder%
    if not exist %backupRootFolder% (
        mkdir %backupRootFolder%
    )

    echo Creating backup folder: %backupFolder%
    mkdir %backupFolder%

    echo Begin backing up file from %sourceFolder%

    if ERRORLEVEL 1 (
        echo Unable to complete all operations!
        exit
    )

    echo Created backup directory: %backupFolder%

    xcopy /S /Y /I %sourceFolder%\*.* %backupFolder%
    
    if ERRORLEVEL 1 (
        echo Unable to complete all operations!
        exit
    )

    echo Stop the application Windows service.

    net stop gemeetingrequestapp.exe

    REM Clear out error just in case the service is not running
    set ERRORLEVEL=0

    echo Copied source file to backup folder.

    REM echo About to deleted all source files.
    REM del /Q /F /S %sourceFolder%\*.*
    REM if ERRORLEVEL 1 GOTO ERROR
    REM echo Deleted all source files.

    echo About to get the latest source files from GitHub

    CD %sourceFolder%
    git add -A
    git commit -m "SERVER OPERATOR MODIFICATION"
    git pull

    if ERRORLEVEL 1 (
        echo Unable to complete all operations!
        exit
    )

    echo Completed getting the latest source files from GitHub

    echo About to re-import all application reference data.

    call runDataImports-HLS-MA.bat

    if ERRORLEVEL 1 (
        echo Unable to complete all operations!
        exit
    )

    echo Done re-import all application reference data.

    echo About to uninstall the application's Windows service.

    node %sourceFolder%\runAsWinService.js -u

    if ERRORLEVEL 1 (
        echo Unable to complete all operations!
        exit
    )

    echo About to re-install the application's Windows service.

    node %sourceFolder%\runAsWinService.js 

    if ERRORLEVEL 1 (
        echo Unable to complete all operations!
    ) else (
        echo Complete all operations!
    )
)

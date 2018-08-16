@echo off
REM This batch file script does the following:
REM    + A full backup
REM    + Stop the application Windows service
REM    + Get latest application files from GitHub 
REM    + Refresh the application reference data in the application database
REM    + Uninstall and reinstall the application as a Windows service 
REM
REM Usage (Must run in Administrator mode):
REM    + No addtional command parameters - default to D: drive
REM    appUpdate-RestoreThisFolder.bat
REM    + Use command parameters - 1st arg to specify drive
REM    appUpdate-RestoreThisFolder.bat c


set ERRORLEVEL=0
set DoPause=none

set DRIVE=%1
if "%1" == "" set DRIVE=D


set DoPause=none
if "%2" == "dopause" set DoPause=dopause
if "%3" == "dopause" set DoPause=dopause
if "%4" == "dopause" set DoPause=dopause
if "%5" == "dopause" set DoPause=dopause

set DoReStartServiceOnly=reinstallservice
if "%2" == "restartserviceonly" set DoReStartServiceOnly=restartserviceonly
if "%3" == "restartserviceonly" set DoReStartServiceOnly=restartserviceonly
if "%4" == "restartserviceonly" set DoReStartServiceOnly=restartserviceonly
if "%5" == "restartserviceonly" set DoReStartServiceOnly=restartserviceonly


set sourceFolder=%DRIVE%:\GESchedulingApp\GESchedulingApp\GEApp\GESchedApiApp
set backupRootFolder=%DRIVE%:\GESchedulingApp\Backups
set backupFolder=%DRIVE%:\GESchedulingApp\Backups\GESchedApiApp


set CurDate=%date:~10,4%-%date:~4,2%-%date:~7,2%
set timePart=%time:~0,2%%time:~3,2%%time:~6,2% 
set timePart=%timePart: =%

set timestamp=%CurDate%-%timePart%
set backupFolder=%backupFolder%-%timestamp%

echo Using source folder: 
echo %sourceFolder%
echo Using backup folder: 
echo %backupFolder%

set restoreFromFolder=%CD%
echo Restore from folder: 
echo %restoreFromFolder%

if %restoreFromFolder% == %sourceFolder% (
    echo ====================================================================
    echo ==== Error - the restoring from folder can't be the same folder as the target of the retore.
    echo ==== Run terminated.
    echo ====================================================================
    if "%DoPause%" == "dopause" pause
    GOTO END
)


echo Do Pause Prompt: %DoPause%
echo App Service Update: %DoReStartServiceOnly%


echo About to check exist for: 
echo %sourceFolder%

if "%DoPause%" == "dopause" (
    pause
)


if not exist %sourceFolder% (

    echo ==== This directory does not exist: 
    echo ==== %sourceFolder%
    echo ==== FAILED - Unable to find a source directory to do the backup! 
    echo ==== FAILED - Exiting script
    if "%DoPause%" == "dopause" pause
    GOTO END
) 

echo Make sure backup root folder exist: 
echo %backupRootFolder%
if not exist %backupRootFolder% (
    mkdir %backupRootFolder%
    echo ====================================================================
    echo ==== Created backup root folder exist: 
    echo ==== %backupRootFolder%
    echo ====================================================================
)

echo ====================================================================
mkdir %backupFolder%
echo ==== Created backup folder: 
echo ==== %backupFolder%
echo ====================================================================

if "%DoPause%" == "dopause" (
    pause
)


echo Running script in the background. Activities are logged to: 
echo %backupFolder%-Log.txt 

call :Begin >%backupFolder%-Log.txt 
exit /b
echo done!
GOTO END

:Begin

    echo ====================================================================
    echo ====================================================================
    echo ==== Timestamp: %timestamp%
    echo ==== Using App folder: 
    echo ==== %sourceFolder%
    echo ==== Using backup folder: 
    echo ==== %backupFolder%
    echo ==== Restore from folder: 
    echo ==== %restoreFromFolder%
    echo ====================================================================
    echo ==== Do Pause Prompt: %DoPause%
    echo ==== App Service update: %DoReStartServiceOnly%
    echo ====================================================================

 
    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )

    echo ==== Begin backing up file from: 
    echo ==== %sourceFolder%
    echo ====================================================================
    echo ====================================================================

    echo ====================================================================
    echo ==== Created backup directory: 
    echo ==== %backupFolder%
    echo ====================================================================

    xcopy /S /Y /I %sourceFolder%\*.* %backupFolder%
    
    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )

    echo ====================================================================
    echo ==== Copied source file to backup folder.
    echo ====================================================================


    echo ====================================================================
    echo ==== Stopping the application Windows service.
    echo ====================================================================

    net stop gemeetingrequestapp.exe

    if ERRORLEVEL 1 (
        echo ==== WARNING - Not able to stop the application service. It might not be running.
    )
    REM Clear out error just in case the service is not running
    set ERRORLEVEL=0


    CD %sourceFolder%

    echo ====================================================================
    echo ==== About to delete files in the app folder:
    echo ==== %sourceFolder%
    echo ====================================================================

    del /Q /F /S %sourceFolder%\*

    if ERRORLEVEL 1 (
        echo ====================================================================
        echo ==== FAILED - Unable to delete the application files: %ERRORLEVEL%
        echo Run terminated!
        echo ====================================================================
        GOTO END
    )

    echo ====================================================================
    echo ==== About to copy files to the app folder from:
    echo ==== %restoreFromFolder%
    echo ====================================================================

    xcopy /S /Y /I %restoreFromFolder%\*.* %sourceFolder%

    if ERRORLEVEL 1 (
        echo ====================================================================
        echo ==== FAILED - to copy files to the app folder from:
        echo ==== %restoreFromFolder%
        echo ====================================================================
        GOTO END
    )

    echo ====================================================================
    echo ==== Restoring files to the app folder completed.
    echo ====================================================================

    echo ====================================================================
    echo ==== About to re-import all application reference data.
    echo ====================================================================

    call runDataImports-HLS-MA.bat

    if ERRORLEVEL 1 (
        echo ====================================================================
        echo ==== FAILED - Unable to complete running the runDataImports-HLS-MA.bat!
        echo ====================================================================
        GOTO END
    )
    echo ====================================================================
    echo ==== Done re-importing all application reference data. 
    echo ====================================================================

    if "%RestartServiceOnly%" == "restartserviceonly" (
        echo ====================================================================
        echo ==== Skipping installing the application's Windows service.
        echo ==== About to retart the application's Windows service.
        echo ====================================================================
        net start gemeetingrequestapp.exe

        if ERRORLEVEL 1 (
            echo ====================================================================
            echo ==== FAILED - Not able to start the application service!
            echo ==== Run ended
            echo ====================================================================
        )

    ) else (
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
    )

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
    ) else (
        echo ====================================================================
        echo ==== SUCCESS - completed all operations!
        echo ====================================================================
        set CurDate=%date:~10,4%-%date:~4,2%-%date:~7,2%
        set timestamp=%CurDate%-%time:~0,2%%time:~3,2%%time:~6,2%
        echo ==== Timestamp: %timestamp% 
        echo ====================================================================
    )

    :END

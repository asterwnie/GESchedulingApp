@echo off
REM This batch file script does the following:
REM    + A full backup
REM    + Stop the application Windows service
REM    + Get latest application files from GitHub 
REM    + Refresh the application reference data in the application database
REM    + Uninstall and reinstall the application as a Windows service 
REM
REM Usage (Must run in Administrator mode):
REM    + No addtional command parameters - default to D: drive, use PROD mode for Git operations
REM    fullRedeploy-HLS-MA.bat
REM    + Use command parameters - 1st arg to specify drive, 2rd arg for Git mode (dev for DEV mode)
REM    fullRedeploy-HLS-MA.bat c dev
REM    + Use command parameters - 3rd arg to tell script to prompt to continue
REM    fullRedeploy-HLS-MA.bat c dev dopause
REM    + Use command parameters - use 2rd arg to tell script to skip the Git source file operations
REM    fullRedeploy-HLS-MA.bat d skipgit
REM    + skip reinstalling the application service and just restart it
REM    fullRedeploy-HLS-MA.bat d prod restartserviceonly
REM    + force get files from GitHub without version checking
REM    fullRedeploy-HLS-MA.bat d prod alwaysgetsource

set DoPause=none

set DRIVE=%1
if "%1" == "" set DRIVE=C

set GitMode=%2
if "%2" == "" set GitMode=prod
if "%2" == "dopause" set GitMode=prod

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

set AlwaysGetSource=getonlywhennewerversion
if "%2" == "alwaysgetsource" set AlwayGetSource=alwaysgetsource
if "%3" == "alwaysgetsource" set AlwaysGetSource=alwaysgetsource
if "%4" == "alwaysgetsource" set AlwaysGetSource=alwaysgetsource
if "%5" == "alwaysgetsource" set AlwaysGetSource=alwaysgetsource

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

echo Do Pause Prompt: %DoPause%
echo Always Get Source: %AlwaysGetSource%
echo Skip Install Service: %DoSkipInstallService%
echo Git Mode: %GitMode%

if "%GitMode%" == "dev" (
    echo Will do Git Add, Commit and Pull
)
if "%GitMode%" == "prod" (
    echo Will do Git Fetch and hard Reset
)

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

) else (

    echo Make sure backup root folder exist: 
    echo %backupRootFolder%
    if not exist %backupRootFolder% (
        mkdir %backupRootFolder%
        echo Created backup root folder exist: 
        echo %backupRootFolder%
    )
    
    mkdir %backupFolder%
    echo Created backup folder: 
    echo %backupFolder%
)

if "%DoPause%" == "dopause" (
    pause
)

set /a appVersionExpected=0
set /a appVersionCurrent=0

set appVersionExpectedFilepath=%sourceFolder%\appVersionExpected.txt
set appVersionCurrentFilepath=%sourceFolder%\appVersionCurrent.txt
echo appVersionExpected file path: %appVersionExpectedFilepath%
echo appVersionCurrent file path: %appVersionCurrentFilepath%

if "%AlwaysGetSource%" == "getonlywhennewerversion" (

    CD %sourceFolder%
    git fetch
    git add -A
    git checkout -m origin/master -- %appVersionExpectedFilepath%
    git add %appVersionExpectedFilepath%
    git commit -m "FULL REDEPLOYMENT AUTOMATION RUN - %timestamp%"

    if ERRORLEVEL 1 (
        echo ====================================================================
        echo ==== ERROR  - unable to get versioning file.
        echo ==== FAILED - Unable to complete all operations!
        echo ====================================================================
        GOTO END
    )
)

if "%AlwaysGetSource%" == "getonlywhennewerversion" (

    for /f "TOKENS=*" %%a in (%appVersionExpectedFilepath%) do (
        set /a appVersionExpected=%%a * 1
    )

    for /f "TOKENS=*" %%a in (%appVersionCurrentFilepath%) do (
        set /a appVersionCurrent=%%a * 1
    )
)

if "%AlwaysGetSource%" == "getonlywhennewerversion" (

    if ERRORLEVEL 1 (
        echo ====================================================================
        echo ==== ERROR  - unable to check versioning
        echo ==== FAILED - Unable to complete all operations!
        echo ====================================================================
        GOTO END
    )

        if %appVersionExpected% == 0 (
        echo ====================================================================
        echo ==== ERROR  - unable to check versioning!
        echo ==== FAILED - Unable to complete all operations!
        echo ====================================================================
        GOTO END
    )

    echo appVersionExpected: %appVersionExpected%
    echo appVersionCurrent:  %appVersionCurrent%

    if %appVersionExpected% gtr %appVersionCurrent%  (
        echo ====================================================================
        echo ==== appVersionExpected greater than appVersionCurrent
        echo ==== Apply current GitMode: %GitMode%
        echo ====================================================================
    ) else (
        echo ====================================================================
        echo ==== appVersionExpected NOT greater than appVersionCurrent
        echo ==== Skip Git souce files
        echo ====================================================================
        set GitMode=skipgit
    )
)
 

pause
exit


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
    echo ==== Using source folder: 
    echo ==== %sourceFolder%
    echo ==== Using backup folder: 
    echo ==== %backupFolder%
    echo ====================================================================
    echo ====================================================================

    echo ==== Begin backing up file from: 
    echo ==== %sourceFolder%
    echo ====================================================================
    echo ====================================================================

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )

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

    if "%GitMode%" == "dev" (
        echo ====================================================================
        echo ==== About to get the latest source files from GitHub  
        echo ==== In DEV mode - About to do Git Add, Commit and Pull
        echo ====================================================================
        git add -A
        git commit -m "FULL REDEPLOYMENT AUTOMATION RUN (DEV MODE) - %timestamp%"
        git pull
        echo ""
        echo ====================================================================
        echo ==== Completed getting the latest source files from GitHub
        echo ==================================================================== 
    ) else if NOT "%GitMode%" == "prod" (
        echo ====================================================================
        echo ==== Skipping Git operations
        echo ====================================================================
    ) else (
        echo ====================================================================
        echo ==== About to get the latest source files from GitHub  
        echo ==== In PROD mode - About to do Git Fetch and hard Reset
        echo ====================================================================
        git status
        git fetch --all
        git reset --hard origin/master   
        echo ====================================================================
        echo ==== Completed getting the latest source files from GitHub
        echo ====================================================================    
    )

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
        GOTO END
    )


    echo ==== About to re-import all application reference data.
    echo ====================================================================

    call runDataImports-HLS-MA.bat

    if ERRORLEVEL 1 (
        echo ==== FAILED - Unable to complete all operations!
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
            echo ==== FAILED - Not able to start the application service!
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

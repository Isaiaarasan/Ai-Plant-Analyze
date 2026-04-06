@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM M2_HOME - location of maven2's installed home (default is your user installation directory).
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible post scripts, we use another setlocal
@setlocal

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

for %%i in (java.exe) do set "JAVA_EXE=%%~$PATH:i"
if not "%JAVA_EXE%" == "" goto init

echo.
echo ERROR: JAVA_HOME not found and no Java executable in PATH.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
echo.
goto error

:OkJHome
if exist "%JAVA_HOME%\bin\java.exe" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
echo.
goto error

@REM ==== END VALIDATION ====

:init
@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

set "MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%"
IF NOT "%MAVEN_PROJECTBASEDIR%"=="" goto endDetectBaseDir

set "EXEC_DIR=%CD%"
set "WDIR=%EXEC_DIR%"
:findBaseDir
IF EXIST "%WDIR%"\.mvn goto baseDirFound
cd ..
IF "%WDIR%"=="%CD%" goto baseDirNotFound
set "WDIR=%CD%"
goto findBaseDir

:baseDirFound
set "MAVEN_PROJECTBASEDIR=%WDIR%"
cd "%EXEC_DIR%"
goto endDetectBaseDir

:baseDirNotFound
set "MAVEN_PROJECTBASEDIR=%EXEC_DIR%"
cd "%EXEC_DIR%"

:endDetectBaseDir
IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\jvm.config" goto endReadAdditionalConfig

@setlocal EnableExtensions EnableDelayedExpansion
for /F "usebackq delims=" %%a in ("%MAVEN_PROJECTBASEDIR%\.mvn\jvm.config") do set "JVM_CONFIG_MAVEN_PROPS=!JVM_CONFIG_MAVEN_PROPS! %%a"
@endlocal & set "JVM_CONFIG_MAVEN_PROPS=%JVM_CONFIG_MAVEN_PROPS%"

:endReadAdditionalConfig

if not "%JAVA_EXE%" == "" (
    SET "MAVEN_JAVA_EXE=%JAVA_EXE%"
) else (
    SET "MAVEN_JAVA_EXE=%JAVA_HOME%\bin\java.exe"
)
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
set WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.1.1/maven-wrapper-3.1.1.jar"
set WRAPPER_DOWNLOAD_DIR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper

powershell -Command "(New-Object Net.ServicePointManager).SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference = 'SilentlyContinue'; if (!(Test-Path '%WRAPPER_JAR%')) { New-Item -ItemType Directory '%WRAPPER_DOWNLOAD_DIR%' -Force | Out-Null; Write-Host 'Downloading maven-wrapper.jar ...'; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri %WRAPPER_URL% -OutFile '%WRAPPER_JAR%' }"
if "%ERRORLEVEL%" equ "0" (
    echo Proceed to execute Maven. Downloading if required...
) else (
    echo Couldn't download %WRAPPER_URL%, retrying with PowerShell...
    powershell -Command "try { if (!(Test-Path '%WRAPPER_JAR%')) { New-Item -ItemType Directory '%WRAPPER_DOWNLOAD_DIR%' -Force | Out-Null; Write-Host 'Downloading maven-wrapper.jar ...'; Invoke-WebRequest -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%' -ErrorAction Stop } } catch { Write-Host 'Download failed, exit code:' $_; exit 1 }"
    if "%ERRORLEVEL%" neq "0" goto error
)

@REM Provide a "standardized" way to retrieve the CLI args that will
@REM work with both Windows and non-Windows executions.
set MAVEN_CMD_LINE_ARGS=%*

"%MAVEN_JAVA_EXE%" %JVM_CONFIG_MAVEN_PROPS% -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%
if %ERRORLEVEL% neq 0 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

if not "%MAVEN_SKIP_RC%"=="" goto skipRCs
@REM check for post script, e.g. after.cmd on windows
if exist "%MAVEN_PROJECTBASEDIR%\mvnw\post.cmd" call "%MAVEN_PROJECTBASEDIR%\mvnw\post.cmd"
:skipRCs

@endlocal /b %ERROR_CODE%

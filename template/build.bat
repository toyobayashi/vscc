@echo off

set mode=
set arch=
set dll=false
set staticcrt=false
set test=false

:next-arg
if "%1"=="" goto args-done
if /i "%1"=="Debug"         set mode=Debug&goto arg-ok
if /i "%1"=="Release"       set mode=Release&goto arg-ok
if /i "%1"=="Win32"         set arch=Win32&goto arg-ok
if /i "%1"=="x64"           set arch=x64&goto arg-ok
if /i "%1"=="dll"           set dll=true&goto arg-ok
if /i "%1"=="static"        set staticcrt=true&goto arg-ok
if /i "%1"=="test"           set test=true&goto arg-ok
REM if /i "%1"=="arm"           set arch=ARM&goto arg-ok
REM if /i "%1"=="arm64"         set arch=ARM64&goto arg-ok

:arg-ok
shift
goto next-arg

:args-done
if "%mode%" == "" set mode=Release
if "%arch%" == "" set arch=x64

echo Mode: %arch% %mode% dll=%dll% static=%staticcrt%

set cmakebuilddir=.\build\win\%arch%

if not exist %cmakebuilddir% mkdir %cmakebuilddir%
cd %cmakebuilddir%

set staticcrtoverride=
if "%staticcrt%"=="true" (
  set staticcrtoverride=-DCMAKE_USER_MAKE_RULES_OVERRIDE=cmake\vcruntime.cmake
) else (
  set staticcrtoverride=-DCMAKE_USER_MAKE_RULES_OVERRIDE=
)

echo ========================================
echo %cd%$ cmake -A %arch% -DCCPM_BUILD_DLL=%dll% -DCCPM_BUILD_TEST=%test% %staticcrtoverride% ..\..\..
echo ========================================

cmake -A %arch% -DCCPM_BUILD_DLL=%dll% -DCCPM_BUILD_TEST=%test% %staticcrtoverride% ..\..\..

echo ========================================
echo %cd%$ cmake --build . --config %mode%
echo ========================================

cmake --build . --config %mode%

cd ..\..\..

set libout=dist\win\%arch%\lib
set binout=dist\win\%arch%\bin
set headerout=dist\include
set libsource=%cmakebuilddir%\%mode%\*.lib
set dllsource=%cmakebuilddir%\%mode%\*.dll
set exesource=%cmakebuilddir%\%mode%\*.exe

if /i "%mode%"=="Release" (
  if not exist %libout% mkdir %libout%
  if exist %libsource% copy %libsource% %libout%\*>nul

  if not exist %binout% mkdir %binout%
  if exist %exesource% copy %exesource% %binout%\*>nul
  if exist %dllsource% copy %dllsource% %binout%\*>nul

  if not exist %headerout% mkdir %headerout%
  if exist include xcopy /E /Q /Y include %headerout%>nul
)

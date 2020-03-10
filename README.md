# vscc

CMake project scaffold.

VSCode + CMake = Delicious

## Prerequest

* Git

* Node.js

* CMake

* C/C++ environment (windows: VS / linux: gcc / mac: clang)

* VSCode Extension: C/C++ for Visual Studio Code

## Generate vscode configuration

``` bash
$ npm install -g toyobayashi/vscc
$ mkdir ./hello
$ cd ./hello
$ npm init -y
$ npm install @ccpm/dep-paths
$ vscc gen [-f] [-s]
```

## Directory structure

```
.vscode (ignored, generated)
  ├── c_cpp_properties.json (VSCode C/C++ extension config)
  ├── launch.json (debug config)
  ├── settings.json (variables)
  └── tasks.json (build task)
build (ignored)
cmake (generated)
  ├── exe.cmake
  ├── lib.cmake
  ├── npm.cmake
  ├── test.cmake
  └── vcruntime.cmake
dist (ignored)
include (export headers)
  ├── **/*.h
  └── **/*.hpp
node_modules (ignored)
src
  ├── bin (executable sources)
  |    ├── **/*.h
  |    ├── **/*.hpp
  |    ├── **/*.c
  |    └── **/*.cpp
  └── lib (library sources)
       ├── **/*.h
       ├── **/*.hpp
       ├── **/*.c
       └── **/*.cpp
test (test sources)
  ├── **/*.h
  ├── **/*.hpp
  ├── **/*.c
  └── **/*.cpp
build.bat (windows build script, generated)
build.sh (linux / mac build script, generated)
CMakeLists.txt
index.js (find cmake sub directories)
package-lock.json (ignored)
package.json (must has "name" and "version" and "main" fields)
```

## CMakeLists

`/CMakeLists.txt` for writing a library

``` cmake
cmake_minimum_required(VERSION 3.6)

project(<project_name>)

set(LIB_NAME <project_name>)
set(EXE_NAME <project_name>main)
set(TEST_EXE_NAME <project_name>test)

# set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
# set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include(cmake/lib.cmake)
include(cmake/exe.cmake)

if(CCPM_BUILD_TEST)
  include(cmake/test.cmake)
endif()

include(cmake/npm.cmake)

# target_link_libraries(<TARGET> ...)
```

`/CMakeLists.txt` for writing an executable application

``` cmake
cmake_minimum_required(VERSION 3.6)

project(foo)

set(LIB_NAME "") # important, overwrite parent scope LIB_NAME
set(EXE_NAME foo)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include(cmake/exe.cmake)

include(cmake/npm.cmake)

# target_link_libraries(foo ...)
```

## Script option

### build.bat

* `Debug` / `Release`

* `Win32` / `x64`

* `dll` - Define CCPM_BUILD_DLL_\<unscoped_package_name\>

* `static` - Use `/MT & /MTd` instead of `/MD & /MDd`

* `test` - Define CCPM_BUILD_TEST=true

Example: `build.bat Win32 Debug static test`

### build.sh

* `Debug` / `Release`

* `dll` - Define CCPM_BUILD_DLL_\<unscoped_package_name\>

* `test` - Define CCPM_BUILD_TEST=true

Example: `./build.sh Debug test`

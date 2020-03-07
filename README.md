# vscodecpp

VSCode + CMake = 香

## Prerequest

* Git

* Node.js

* CMake

* C/C++ environment (windows: VS / linux: gcc / mac: clang)

## Generate vscode configuration

``` bash
$ npm install -D toyobayashi/vscodecpp
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

# set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include(cmake/lib.cmake)
include(cmake/exe.cmake)
include(cmake/test.cmake)

execute_process(COMMAND node index.js
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE DEPS_LIST
)
execute_process(COMMAND node index.js lib
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE LIB_LIST
)

if(DEPS_LIST)
  string(REPLACE "\n" ";" DEPS_LIST ${DEPS_LIST})
  foreach(pkg ${DEPS_LIST})
    message("add_subdirectory: ${pkg}")
    add_subdirectory(${pkg})
  endforeach()
endif()

if(LIB_LIST)
  string(REPLACE "\n" ";" LIB_LIST ${LIB_LIST})
  target_link_libraries(<project_name> ${LIB_LIST})
endif()
```

`/CMakeLists.txt` for writing an executable application

``` cmake
cmake_minimum_required(VERSION 3.6)

project(foo)
set(EXE_NAME foo)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include(cmake/exe.cmake)

execute_process(COMMAND node index.js
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE DEPS_LIST
)
execute_process(COMMAND node index.js lib
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE LIB_LIST
)

if(DEPS_LIST)
  string(REPLACE "\n" ";" DEPS_LIST ${DEPS_LIST})
  foreach(pkg ${DEPS_LIST})
    message("add_subdirectory: ${pkg}")
    add_subdirectory(${pkg})
  endforeach()
endif()

if(LIB_LIST)
  string(REPLACE "\n" ";" LIB_LIST ${LIB_LIST})
  target_link_libraries(foo ${LIB_LIST})
endif()
```

## Script option

### build.bat

* `Debug` / `Release`

* `Win32` / `x64`

* `dll` - Define BUILD_DLL_\<unscoped_package_name\>

* `static` - Use `/MT & /MTd` instead of `/MD & /MDd`

Example: `build.bat Win32 Debug static`

### build.sh

* `Debug` / `Release`

* `dll` - Define BUILD_DLL_\<unscoped_package_name\>

Example: `./build.sh Debug`

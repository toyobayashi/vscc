# vscodecpp

VSCode + CMake = 香

``` bash
$ npm install -D toyobayashi/vscodecpp
```

`/CMakeLists.txt`

```
cmake_minimum_required(VERSION 3.6)

project(<project_name>)

set(LIB_NAME <project_name>)
set(EXE_NAME "${LIB_NAME}main")

include(cmake/lib.cmake)
include(cmake/exe.cmake)
include(cmake/test.cmake)
```

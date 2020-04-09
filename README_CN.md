# vscc

基于 Node.js 的 CMake 项目脚手架。

VSCode + Node.js + CMake = 香

## 快速开始

``` bash
$ mkdir ./hello
$ cd ./hello
$ npm init -y
$ npx toyobayashi/vscc gen -s
$ chmod +x ./build.sh
$ code .
```

## 预先需要准备的环境

* Git

* Node.js 

* CMake

* C/C++ 编译环境

    * Windows：MSVC v141 或 v142 工具集

        **选择一**

        一步搞定，在管理员模式的 CMD 或 Powershell 中跑
        
        `npm install --global --production windows-build-tools`

        它会默认安装 VS 2017 的 C++ 构建环境。

        **选择二**

        手动安装 Visual Studio 2019 和 C++ 桌面开发工作负载。
    
    * Linux：gcc, g++, gdb
    
    * macOS：clang, clang++, lldb

* VSCode 扩展：C/C++ for Visual Studio Code

## 目录结构

```
.vscode (自动生成的 VSCode 配置文件)
  ├── c_cpp_properties.json (VSCode C/C++ extension config)
  ├── launch.json (debug config)
  ├── settings.json (variables)
  └── tasks.json (build task)
build (CMake 构建生成，请无视掉)
cmake (自动生成的 CMake 配置文件)
  ├── exe.cmake
  ├── lib.cmake
  ├── npm.cmake
  ├── test.cmake
  └── vcruntime.cmake
dist (Release 模式生成，请无视掉)
include (库导出的头文件)
  ├── **/*.h
  └── **/*.hpp
node_modules (请无视掉)
src
  ├── bin (可执行程序的源码)
  |    ├── **/*.h
  |    ├── **/*.hpp
  |    ├── **/*.c
  |    └── **/*.cpp
  └── lib (库的源码)
       ├── **/*.h
       ├── **/*.hpp
       ├── **/*.c
       └── **/*.cpp
test (测试源码)
  ├── **/*.h
  ├── **/*.hpp
  ├── **/*.c
  └── **/*.cpp
build.bat (自动生成的 Windows 构建脚本)
build.sh (自动生成的 Linux / mac 构建脚本)
CMakeLists.txt
index.js (用于使 Node.js 模块化机制正常工作)
package-lock.json (Node.js 项目依赖描述，请无视掉)
package.json (必须有 "name"、"version"、"main" 字段，name 不能是中文)
```

## CMakeLists

如果你想写一个库，你的 `CMakeLists.txt` 可以像这样写，顺带根据实际情况改一下 `cmake/lib.cmake`。

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

# include(cmake/npm.cmake) 如果需要使用 npm 作为包管理器
# dp_require("node_module" ...)

# target_link_libraries(<TARGET> "node_module" ...)
```

如果你想写一个可执行程序，你的 `CMakeLists.txt` 可以像这样写，顺带根据实际情况改一下 `cmake/exe.cmake`。

``` cmake
cmake_minimum_required(VERSION 3.6)

project(foo)

set(LIB_NAME "") # 多写这一行可以覆盖掉父作用域的 LIB_NAME
set(EXE_NAME foo)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

# include(cmake/npm.cmake)

# dp_require("node_module" ...)
# target_link_libraries(foo "node_module" ...)

include(cmake/exe.cmake)
```

如果想使用 npm 作为包管理器，可以用 `@ccpm/dep-paths` 这个包，npm install 完了以后在 CMake 中 `include(cmake/npm.cmake)`，就可以调用 `dp_require` 函数添加 node_modules 中的包，只要包的根目录有 `CMakeLists.txt` 就会被 `add_subdirectory()`，多次依赖只会被加载一次。

## 构建脚本传参

### build.bat

* `Debug` / `Release`

* `Win32` / `x64`

* `dll` - 预定义 CCPM_BUILD_DLL_\<unscoped_package_name\>

* `static` - 静态链接 CRT 库，启用 `/MT & /MTd` 而不是 `/MD & /MDd`

* `test` - 预定义 CCPM_BUILD_TEST=true

使用示例：`build.bat Win32 Debug static test`

### build.sh

* `Debug` / `Release`

* `dll` - 预定义 CCPM_BUILD_DLL_\<unscoped_package_name\>

* `test` - 预定义 CCPM_BUILD_TEST=true

使用示例：`./build.sh Debug test`

## 常见问题

* Windows 下 `printf` 或 `std::cout` 输出中文乱码

    VSCode 默认把源文件保存成了 UTF8 编码，本脚手架的 CMake 中也默认启用了 `/utf-8` 编译选项，只要输出终端的字符集不是 UTF8 就会出现乱码。具体请参考[微软文档](https://docs.microsoft.com/zh-cn/cpp/build/reference/utf-8-set-source-and-executable-character-sets-to-utf-8?view=vs-2019)。解决办法：

    第一种，把 `/utf-8` 改成 `/source-charset:utf-8`。

    第二种，把终端代码页改成 `65001`。

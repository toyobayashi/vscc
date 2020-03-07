cmake_minimum_required(VERSION 3.6)

project(<project_name>)

set(LIB_NAME <project_name>)
set(EXE_NAME <project_name>main)
set(TEST_EXE_NAME <project_name>test)

# set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
# set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include(cmake/lib.cmake)
include(cmake/exe.cmake)
include(cmake/test.cmake)

execute_process(COMMAND node index.js
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  OUTPUT_VARIABLE DEPS_LIST_<project_name>
)
execute_process(COMMAND node index.js lib
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  OUTPUT_VARIABLE LIB_LIST_<project_name>
)

if(DEPS_LIST_<project_name>)
  string(REPLACE "\n" ";" DEPS_LIST_<project_name> ${DEPS_LIST_<project_name>})
  foreach(pkg ${DEPS_LIST_<project_name>})
    message("add_subdirectory: ${pkg} ${pkg}")
    add_subdirectory(${pkg} ${pkg})
  endforeach()
endif()

if(LIB_LIST_<project_name>)
  string(REPLACE "\n" ";" LIB_LIST_<project_name> ${LIB_LIST_<project_name>})
  target_link_libraries(<project_name> ${LIB_LIST_<project_name>})
endif()

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

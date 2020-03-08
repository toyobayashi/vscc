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

execute_process(COMMAND node index.js
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  OUTPUT_VARIABLE DEPS_LIST_<project_name>
)

if(DEPS_LIST_<project_name>)
  string(REPLACE "\n" ";" DEPS_LIST_<project_name> ${DEPS_LIST_<project_name>})
  foreach(pkg ${DEPS_LIST_<project_name>})
    string(REPLACE "," ";" DEP_PATHS ${pkg})
    list(GET DEP_PATHS 0 ABSOLUTE_PATH)
    list(GET DEP_PATHS 1 RELATIVE_PATH)
    get_property(CCPM_SOURCE_LIST GLOBAL PROPERTY "CCPM_SOURCE_LIST")
    if(NOT CCPM_SOURCE_LIST)
      set_property(GLOBAL PROPERTY "CCPM_SOURCE_LIST" "${ABSOLUTE_PATH}")
      message("add_subdirectory: ${ABSOLUTE_PATH} ${RELATIVE_PATH}")
      add_subdirectory(${ABSOLUTE_PATH} ${RELATIVE_PATH})
    else()
      list(FIND CCPM_SOURCE_LIST ${ABSOLUTE_PATH} FIND_INDEX)
      if(${FIND_INDEX} MATCHES "-1")
        set_property(GLOBAL PROPERTY "CCPM_SOURCE_LIST" "${CCPM_SOURCE_LIST};${ABSOLUTE_PATH}")
        message("add_subdirectory: ${ABSOLUTE_PATH} ${RELATIVE_PATH}")
        add_subdirectory(${ABSOLUTE_PATH} ${RELATIVE_PATH})
      else()
        message("found ${ABSOLUTE_PATH}")
      endif()
    endif()
  endforeach()
endif()

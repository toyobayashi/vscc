execute_process(COMMAND node -e "try { require('@ccpm/dep-paths').getIncludes().forEach(p => console.log(p)) } catch (_) {}"
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  OUTPUT_VARIABLE INCLUDES_CMAKE_PATHS
)

if(INCLUDES_CMAKE_PATHS)
  string(REPLACE "\n" ";" INCLUDES_CMAKE_PATHS ${INCLUDES_CMAKE_PATHS})
  foreach(cmk ${INCLUDES_CMAKE_PATHS})
    message("${CMAKE_CURRENT_SOURCE_DIR} > include(\"${cmk}\")")
    include(${cmk})
  endforeach()
endif()

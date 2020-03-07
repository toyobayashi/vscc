file(GLOB_RECURSE LIB_SOURCE_FILES "src/lib/*.cpp" "src/lib/*.c")

if(BUILD_DLL)
  add_library(${CMAKE_PROJECT_NAME} SHARED
    ${LIB_SOURCE_FILES}
  )

  target_compile_definitions(${CMAKE_PROJECT_NAME} PRIVATE BUILD_DLL)

  if(NOT MSVC)
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,-rpath=$ORIGIN")
  endif()
else()
  add_library(${CMAKE_PROJECT_NAME} STATIC
    ${LIB_SOURCE_FILES}
  )
endif()

# set_target_properties(${CMAKE_PROJECT_NAME} PROPERTIES CXX_STANDARD 11)

# set_target_properties(${CMAKE_PROJECT_NAME} PROPERTIES PREFIX "lib")

if(WIN32 AND MSVC)
  # set_target_properties(${CMAKE_PROJECT_NAME} PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
  target_compile_options(${CMAKE_PROJECT_NAME} PRIVATE /utf-8)
  target_compile_definitions(${CMAKE_PROJECT_NAME} PRIVATE
    _CRT_SECURE_NO_WARNINGS
    UNICODE
    _UNICODE
  )
else()
  if(BUILD_DLL)
    target_compile_options(${CMAKE_PROJECT_NAME} PRIVATE -fPIC)
  endif()
endif()

target_include_directories(${CMAKE_PROJECT_NAME}
  PUBLIC
    ${PROJECT_SOURCE_DIR}/include
)

file(GLOB_RECURSE LIB_SOURCE_FILES "src/lib/*.cpp" "src/lib/*.c")

if(CCPM_BUILD_DLL)
  add_library(${LIB_NAME} SHARED
    ${LIB_SOURCE_FILES}
  )

  target_compile_definitions(${LIB_NAME} PRIVATE "CCPM_BUILD_DLL_${LIB_NAME}")

  if(NOT MSVC)
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,-rpath=$ORIGIN")
  endif()
else()
  add_library(${LIB_NAME} STATIC
    ${LIB_SOURCE_FILES}
  )
endif()

# set_target_properties(${LIB_NAME} PROPERTIES CXX_STANDARD 11)

# set_target_properties(${LIB_NAME} PROPERTIES PREFIX "lib")

if(WIN32 AND MSVC)
  # set_target_properties(${LIB_NAME} PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
  target_compile_options(${LIB_NAME} PRIVATE /utf-8)
  target_compile_definitions(${LIB_NAME} PRIVATE
    _CRT_SECURE_NO_WARNINGS
    UNICODE
    _UNICODE
  )
else()
  if(CCPM_BUILD_DLL)
    target_compile_options(${LIB_NAME} PRIVATE -fPIC)
  endif()
endif()

target_include_directories(${LIB_NAME}
  PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

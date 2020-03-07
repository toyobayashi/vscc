file(GLOB_RECURSE EXE_SOURCE_FILES "src/bin/*.cpp" "src/bin/*.c")

set(EXE_NAME "${CMAKE_PROJECT_NAME}main")

add_executable(${EXE_NAME} ${EXE_SOURCE_FILES})

target_link_libraries(${EXE_NAME} ${CMAKE_PROJECT_NAME})

if(WIN32 AND MSVC)
  # set_target_properties(${EXE_NAME} PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
  target_compile_options(${EXE_NAME} PRIVATE /utf-8)
  target_compile_definitions(${EXE_NAME} PRIVATE
    _CRT_SECURE_NO_WARNINGS
    UNICODE
    _UNICODE
  )
  if(BUILD_DLL)
    target_link_options(${EXE_NAME} PRIVATE /ignore:4199 /DELAYLOAD:${CMAKE_PROJECT_NAME}.dll)
  endif()
endif()

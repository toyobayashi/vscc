#ifndef __VSCC_H__
#define __VSCC_H__

#ifdef __cplusplus
  #define EXTERN_C_START extern "C" {
  #define EXTERN_C_END }
#else
  #define EXTERN_C_START
  #define EXTERN_C_END
#endif

#ifdef _WIN32
  #ifdef CCPM_BUILD_DLL_vscc
  #define VSCC_API __declspec(dllexport)
  #else
  // #define VSCC_API __declspec(dllimport)
  #define VSCC_API
  #endif
#else
  #ifdef CCPM_BUILD_DLL_vscc
  #define VSCC_API __attribute__((visibility("default")))
  #else
  #define VSCC_API
  #endif
#endif

EXTERN_C_START
VSCC_API int add(int, int);
EXTERN_C_END

#endif

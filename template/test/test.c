#include <stdio.h>
#include "vscc/vscc.h"

static int main_ret = 0;
static int test_count = 0;
static int test_pass = 0;

#define EXPECT_EQ_BASE(equality, expect, actual, expect_format, actual_format) \
  do {\
    test_count++;\
    if ((equality))\
      test_pass++;\
    else {\
      fprintf(stderr, "%s:%d: expect: " expect_format " actual: " actual_format "\n", __FILE__, __LINE__, expect, actual);\
      main_ret = 1;\
    }\
  } while(0)

static void test_lib() {
  int expect, actual;
  expect = 3;
  actual = add(1, 2);

  EXPECT_EQ_BASE(expect == actual, expect, actual, "%d", "%d");
  EXPECT_EQ_BASE(4 == actual, 4, actual, "%d", "%d");
}

int main() {
  test_lib();
  printf("%d/%d (%3.2f%%) passed\n", test_pass, test_count, test_pass * 100.0 / test_count);
  return main_ret;
}

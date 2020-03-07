type="Release"
dll="false"

until [ $# -eq 0 ]
do
if [ "$1" == "Release" ]; then type="$1"; fi
if [ "$1" == "Debug" ]; then type="$1"; fi
if [ "$1" == "dll" ]; then dll="true"; fi
shift
done

unamestr=`uname`
os=`echo $unamestr | tr "A-Z" "a-z"`

mkdir -p "./build/$os/$type"
cd "./build/$os/$type"
echo "cmake -DBUILD_DLL=$dll -DCMAKE_BUILD_TYPE=$type ../../.."
cmake -DBUILD_DLL="$dll" -DCMAKE_BUILD_TYPE=$type ../../..
cmake --build .
cd ../../..

if [ "$type" == "Release" ]; then
  headerout="dist/include/<project_name>"
  src_dir="./build/$os/Release"
  dest_dir="dist/$os/bin"
  mkdir -p "$headerout"
  mkdir -p "dist/$os/lib"
  mkdir -p $dest_dir
  cp ./include/* "$headerout"
  cp "$src_dir"/*.a "dist/$os/lib"
  cp "$src_dir"/{*.so,*.dylib} $dest_dir

  for f in `find $src_dir -maxdepth 1 -type f`;
  do
    if test -x $f; then cp $f $dest_dir; fi
  done
fi

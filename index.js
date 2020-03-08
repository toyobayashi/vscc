const getDepPaths = require('@ccpm/dep-paths').getDepPaths
const paths = getDepPaths(__dirname)
paths.forEach(p => console.log(p))

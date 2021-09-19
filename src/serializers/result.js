const resultSerializers = ({ count, results, next, previous }) => {
  return {
    isPrev: !!previous,
    isNext: !!next,
    count: count,
    results: results,
  }
}

export default resultSerializers;
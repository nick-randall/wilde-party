const addProp = (key: any, obj: {[proparray: string ]: any[],  }, curr: {[a: string]: any}) => obj.hasOwnProperty(key) ? obj[key].push(curr[key]) : obj[key] = [curr[key]];

export const compareProps = (array: object[]) => {
  let proparray = {};  
  array.forEach(obj => Object.keys(obj).forEach(key => addProp(key, proparray, obj )))
  console.log(proparray)
}

// origArray[key]
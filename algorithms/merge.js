function mergeArr(first, newArr) {
  const result = [];
  let left = 0;
  let right = 0;
  const second = newArr.sort((a, b) => a - b);

  for (let i = 0; i < first.length; i++) {
    if (first[left] < second[right]) {
      result.push(first[left]);
      left++;
    } else {
      result.push(second[right]);
      if (second[right + 1]) {
        right++;
      }
    }
  }

  if (right < second.length - 1) {
    const tail = second.slice(right, second.length - 1);
    result.push(...tail);
  }

  return result;
}

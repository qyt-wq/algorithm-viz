/**
 * 冒泡排序引擎
 * 重复遍历数组，依次比较相邻元素，逆序则交换
 * 每轮将当前最大元素"冒泡"至末尾
 */
export function bubbleSortEngine(inputData) {
  const arr = [...inputData];
  const n = arr.length;
  const steps = [];

  steps.push({
    type: 'init',
    data: [...arr],
    description: `初始数组: [${arr.join(', ')}]`,
    comparing: [],
    swapping: [],
    sorted: new Set(),
    pass: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - 1 - i; j++) {
      // 比较相邻元素
      steps.push({
        type: 'compare',
        data: [...arr],
        description: `第${i + 1}轮: 比较 arr[${j}]=${arr[j]} 和 arr[${j + 1}]=${arr[j + 1]}`,
        comparing: [j, j + 1],
        swapping: [],
        sorted: new Set(),
        pass: i + 1,
      });

      if (arr[j] > arr[j + 1]) {
        // 交换
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedInPass = true;

        steps.push({
          type: 'swap',
          data: [...arr],
          description: `${arr[j + 1]} > ${arr[j]}，交换 arr[${j}]↔arr[${j + 1}]`,
          comparing: [],
          swapping: [j, j + 1],
          sorted: new Set(),
          pass: i + 1,
        });
      } else {
        steps.push({
          type: 'no-swap',
          data: [...arr],
          description: `arr[${j}] ≤ arr[${j + 1}]，无需交换`,
          comparing: [j, j + 1],
          swapping: [],
          sorted: new Set(),
          pass: i + 1,
        });
      }
    }

    // 本轮完成，标记末尾已排序
    const sortedSet = new Set();
    for (let k = n - 1; k >= n - 1 - i; k--) {
      sortedSet.add(k);
    }

    steps.push({
      type: 'pass-complete',
      data: [...arr],
      description: swappedInPass
        ? `第${i + 1}轮完成，arr[${n - 1 - i}]=${arr[n - 1 - i]} 已归位`
        : `第${i + 1}轮完成，本轮无交换——数组已有序！`,
      comparing: [],
      swapping: [],
      sorted: sortedSet,
      pass: i + 1,
    });

    if (!swappedInPass) break;
  }

  // 最终状态
  const allSorted = new Set();
  for (let k = 0; k < n; k++) allSorted.add(k);

  steps.push({
    type: 'complete',
    data: [...arr],
    description: `冒泡排序完成！最终结果: [${arr.join(', ')}]`,
    comparing: [],
    swapping: [],
    sorted: allSorted,
    pass: null,
  });

  return steps;
}

/**
 * 快速排序算法引擎
 * 返回完整的步骤序列，每步包含数组状态、高亮索引、描述等
 */

/**
 * @param {number[]} inputData - 初始数组
 * @returns {Step[]} steps - 算法执行步骤序列
 */
export function quickSortEngine(inputData) {
  const steps = [];
  // 深拷贝避免修改原始数据
  const arr = [...inputData];

  // 记录初始状态
  steps.push({
    type: 'init',
    data: [...arr],
    highlights: [],
    description: `初始数组: [${arr.join(', ')}]`,
    phase: 'initial',
    sorted: new Set(),
    pivot: -1,
    left: -1,
    right: -1,
    comparing: [],
    swapping: [],
  });

  function partition(low, high) {
    const pivotValue = arr[low];
    let i = low;

    // 记录选择基准值
    steps.push({
      type: 'pivot-select',
      data: [...arr],
      highlights: [low],
      description: `选择基准值 pivot = ${pivotValue}（位置 ${low}）`,
      phase: 'partition',
      sorted: new Set(),
      pivot: low,
      left: low,
      right: high,
      comparing: [],
      swapping: [],
    });

    for (let j = low + 1; j <= high; j++) {
      // 比较步骤
      steps.push({
        type: 'compare',
        data: [...arr],
        highlights: [low, j],
        description: `比较 arr[${j}]=${arr[j]} 与 pivot=${pivotValue}，${arr[j] <= pivotValue ? '≤ pivot，准备交换' : '> pivot，保持位置'}`,
        phase: 'partition',
        sorted: new Set(),
        pivot: low,
        left: low,
        right: high,
        comparing: [low, j],
        swapping: [],
      });

      if (arr[j] <= pivotValue) {
        i++;
        if (i !== j) {
          // 交换步骤
          const oldI = arr[i];
          const oldJ = arr[j];
          [arr[i], arr[j]] = [arr[j], arr[i]];

          steps.push({
            type: 'swap',
            data: [...arr],
            highlights: [i, j],
            description: `交换 arr[${i}]=${oldI} ↔ arr[${j}]=${oldJ}`,
            phase: 'partition',
            sorted: new Set(),
            pivot: low,
            left: low,
            right: high,
            comparing: [],
            swapping: [i, j],
          });
        } else {
          // 不需要交换但 i 前进
          steps.push({
            type: 'move-pointer',
            data: [...arr],
            highlights: [i],
            description: `i 推进到位置 ${i}，无需交换`,
            phase: 'partition',
            sorted: new Set(),
            pivot: low,
            left: low,
            right: high,
            comparing: [],
            swapping: [],
          });
        }
      }
    }

    // 将 pivot 放到正确位置
    if (i !== low) {
      const oldLow = arr[low];
      const oldI = arr[i];
      [arr[low], arr[i]] = [arr[i], arr[low]];

      steps.push({
        type: 'pivot-place',
        data: [...arr],
        highlights: [i],
        description: `将 pivot=${pivotValue} 放到正确位置 ${i}`,
        phase: 'partition',
        sorted: new Set(),
        pivot: i,
        left: low,
        right: high,
        comparing: [],
        swapping: [low, i],
      });
    }

    // 标记 pivot 位置已排序
    steps.push({
      type: 'pivot-sorted',
      data: [...arr],
      highlights: [i],
      description: `位置 ${i}（值=${arr[i]}）已归位，不再参与后续排序`,
      phase: 'partition',
      sorted: new Set([i]),
      pivot: -1,
      left: low,
      right: high,
      comparing: [],
      swapping: [],
    });

    return i;
  }

  function quickSort(low, high, sortedSet) {
    if (low < high) {
      const pi = partition(low, high);

      // 记录分区完成
      steps.push({
        type: 'partition-done',
        data: [...arr],
        highlights: [pi],
        description: `分区完成：左侧 [${low}..${pi - 1}] 右侧 [${pi + 1}..${high}]`,
        phase: 'recursive',
        sorted: new Set(sortedSet).add(pi),
        pivot: -1,
        left: low,
        right: high,
        comparing: [],
        swapping: [],
      });

      const newSorted = new Set(sortedSet);
      newSorted.add(pi);

      quickSort(low, pi - 1, newSorted);
      quickSort(pi + 1, high, newSorted);
    } else if (low === high) {
      // 单个元素自动归位
      const newSorted = new Set(sortedSet);
      newSorted.add(low);
      steps.push({
        type: 'auto-sorted',
        data: [...arr],
        highlights: [low],
        description: `单个元素 arr[${low}]=${arr[low]} 自动归位`,
        phase: 'recursive',
        sorted: newSorted,
        pivot: -1,
        left: low,
        right: high,
        comparing: [],
        swapping: [],
      });
    }
  }

  quickSort(0, arr.length - 1, new Set());

  // 最终完成状态
  const allSorted = new Set();
  for (let k = 0; k < arr.length; k++) allSorted.add(k);

  steps.push({
    type: 'complete',
    data: [...arr],
    highlights: [],
    description: `排序完成！最终结果: [${arr.join(', ')}]`,
    phase: 'complete',
    sorted: allSorted,
    pivot: -1,
    left: -1,
    right: -1,
    comparing: [],
    swapping: [],
  });

  return steps;
}

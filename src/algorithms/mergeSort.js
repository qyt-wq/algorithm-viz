/**
 * 归并排序引擎
 * 分治策略：递归分割数组为两半，分别排序后合并
 * 每步追踪分割边界、合并比较和放置过程
 */
export function mergeSortEngine(inputData) {
  const arr = [...inputData];
  const n = arr.length;
  const auxiliary = [...arr];
  const steps = [];

  steps.push({
    type: 'init',
    data: [...arr],
    description: `初始数组: [${arr.join(', ')}]`,
    left: 0,
    right: n - 1,
    mid: -1,
    comparing: [],
    merging: [],
    sorted: new Set(),
    depth: 0,
  });

  function mergeSort(l, r, depth) {
    if (l >= r) {
      if (l === r) {
        const s = new Set();
        s.add(l);
        steps.push({
          type: 'base-case',
          data: [...arr],
          description: `单个元素 arr[${l}]=${arr[l]} 天然有序`,
          left: l,
          right: r,
          mid: -1,
          comparing: [],
          merging: [],
          sorted: s,
          depth,
        });
      }
      return;
    }

    const mid = Math.floor((l + r) / 2);

    steps.push({
      type: 'divide',
      data: [...arr],
      description: `分割: 左侧 arr[${l}..${mid}] 右侧 arr[${mid + 1}..${r}]`,
      left: l,
      right: r,
      mid,
      comparing: [],
      merging: [],
      sorted: new Set(),
      depth,
    });

    mergeSort(l, mid, depth + 1);
    mergeSort(mid + 1, r, depth + 1);
    merge(l, mid, r, depth);
  }

  function merge(l, mid, r, depth) {
    // 复制到辅助数组
    for (let k = l; k <= r; k++) auxiliary[k] = arr[k];

    let i = l;
    let j = mid + 1;
    let k = l;
    const mergedIndices = [];

    while (i <= mid && j <= r) {
      steps.push({
        type: 'merge-compare',
        data: [...arr],
        description: `合并比较: aux[${i}]=${auxiliary[i]} vs aux[${j}]=${auxiliary[j]}`,
        left: l,
        right: r,
        mid,
        comparing: [i, j],
        merging: [...mergedIndices],
        sorted: new Set(),
        depth,
      });

      if (auxiliary[i] <= auxiliary[j]) {
        arr[k] = auxiliary[i];
        mergedIndices.push(k);
        steps.push({
          type: 'merge-place',
          data: [...arr],
          description: `放置 aux[${i}]=${auxiliary[i]} → arr[${k}]`,
          left: l,
          right: r,
          mid,
          comparing: [],
          merging: [...mergedIndices],
          sorted: new Set(),
          depth,
          placedIndex: k,
        });
        i++;
      } else {
        arr[k] = auxiliary[j];
        mergedIndices.push(k);
        steps.push({
          type: 'merge-place',
          data: [...arr],
          description: `放置 aux[${j}]=${auxiliary[j]} → arr[${k}]`,
          left: l,
          right: r,
          mid,
          comparing: [],
          merging: [...mergedIndices],
          sorted: new Set(),
          depth,
          placedIndex: k,
        });
        j++;
      }
      k++;
    }

    // 复制剩余左半
    while (i <= mid) {
      arr[k] = auxiliary[i];
      mergedIndices.push(k);
      steps.push({
        type: 'merge-place',
        data: [...arr],
        description: `放置剩余: aux[${i}]=${auxiliary[i]} → arr[${k}]`,
        left: l,
        right: r,
        mid,
        comparing: [],
        merging: [...mergedIndices],
        sorted: new Set(),
        depth,
        placedIndex: k,
      });
      i++;
      k++;
    }

    // 复制剩余右半
    while (j <= r) {
      arr[k] = auxiliary[j];
      mergedIndices.push(k);
      steps.push({
        type: 'merge-place',
        data: [...arr],
        description: `放置剩余: aux[${j}]=${auxiliary[j]} → arr[${k}]`,
        left: l,
        right: r,
        mid,
        comparing: [],
        merging: [...mergedIndices],
        sorted: new Set(),
        depth,
        placedIndex: k,
      });
      j++;
      k++;
    }

    // 合并完成标记
    const allSorted = new Set(mergedIndices);
    steps.push({
      type: 'merge-complete',
      data: [...arr],
      description: `合并完成: arr[${l}..${r}] 已有序`,
      left: l,
      right: r,
      mid,
      comparing: [],
      merging: [],
      sorted: allSorted,
      depth,
    });
  }

  mergeSort(0, n - 1, 0);

  const allSorted = new Set();
  for (let k = 0; k < n; k++) allSorted.add(k);

  steps.push({
    type: 'complete',
    data: [...arr],
    description: `归并排序完成！最终结果: [${arr.join(', ')}]`,
    left: 0,
    right: n - 1,
    mid: -1,
    comparing: [],
    merging: [],
    sorted: allSorted,
    depth: 0,
  });

  return steps;
}

/**
 * 算法注册中心 — 统一管理所有算法模块
 * 新增算法只需在此注册即可自动接入系统
 */
import { quickSortEngine } from './quickSort';
import { dijkstraEngine } from './dijkstra';
import { hanoiEngine } from './hanoi';

export const algorithmRegistry = [
  {
    id: 'quicksort',
    name: '快速排序',
    category: '排序算法',
    difficulty: '低-中',
    engine: quickSortEngine,
    inputType: 'array',
    inputHint: '请输入用逗号分隔的整数，例如: 64, 34, 25, 12, 22, 11, 90',
    defaultInput: [64, 34, 25, 12, 22, 11, 90],
    randomCount: { min: 5, max: 15 },
    randomRange: { min: 1, max: 100 },
    timeComplexity: '平均 O(n log n)，最坏 O(n²)',
    spaceComplexity: 'O(log n) — 递归调用栈深度',
    description:
      '快速排序采用分治策略，选取基准值(pivot)将数组分为两部分：左侧小于等于基准，右侧大于基准，再递归排序子数组。',
    keySteps: [
      '选择基准值（pivot），通常选第一个元素',
      '分区操作：将小于 pivot 的元素移到左侧，大于 pivot 的移到右侧',
      '递归对左右子数组重复上述过程',
      '递归终止条件：子数组长度 ≤ 1',
    ],
    /** 伪代码 — 每行对应 step.type 用于高亮 */
    pseudoCode: [
      { id: 'init', lines: ['function quickSort(arr, low, high):'], indent: 0 },
      { id: 'compare', lines: ['  if low < high:'], indent: 1 },
      { id: 'pivot-select', lines: ['    pivot = arr[low]       // 选取基准值'], indent: 2 },
      { id: 'pivot-select', lines: ['    i = low                // 分区指针'], indent: 2 },
      { id: 'compare', lines: ['    for j = low+1 to high:'], indent: 2 },
      { id: 'compare', lines: ['      if arr[j] <= pivot:     // 比较'], indent: 3 },
      { id: 'swap', lines: ['        i = i + 1'], indent: 4 },
      { id: 'swap', lines: ['        swap(arr[i], arr[j])    // 交换'], indent: 4 },
      { id: 'pivot-place', lines: ['    swap(arr[low], arr[i])  // 基准归位'], indent: 2 },
      { id: 'partition-done', lines: ['    quickSort(arr, low, i-1)  // 递归左'], indent: 2 },
      { id: 'partition-done', lines: ['    quickSort(arr, i+1, high) // 递归右'], indent: 2 },
      { id: 'complete', lines: ['  return arr                // 排序完成'], indent: 1 },
    ],
    codeImplementations: {
      c: [
        { id: 'init', lines: ['#include <stdio.h>', '', 'void swap(int* a, int* b) {', '    int t = *a; *a = *b; *b = t;', '}'] },
        { id: 'pivot-select', lines: ['', 'int partition(int arr[], int low, int high) {', '    int pivot = arr[low];', '    int i = low;'] },
        { id: 'compare', lines: ['    for (int j = low + 1; j <= high; j++) {', '        if (arr[j] <= pivot) {'] },
        { id: 'swap', lines: ['            i++;', '            swap(&arr[i], &arr[j]);'] },
        { id: 'compare', lines: ['        }', '    }'] },
        { id: 'pivot-place', lines: ['    swap(&arr[low], &arr[i]);', '    return i;', '}'] },
        { id: 'compare', lines: ['', 'void quickSort(int arr[], int low, int high) {', '    if (low < high) {'] },
        { id: 'pivot-select', lines: ['        int pi = partition(arr, low, high);'] },
        { id: 'partition-done', lines: ['        quickSort(arr, low, pi - 1);', '        quickSort(arr, pi + 1, high);'] },
        { id: 'compare', lines: ['    }', '}'] },
      ],
      java: [
        { id: 'init', lines: ['public class QuickSort {', '    public static void quickSort(int[] arr,', '                                int low, int high) {'] },
        { id: 'compare', lines: ['        if (low < high) {'] },
        { id: 'pivot-select', lines: ['            int pi = partition(arr, low, high);'] },
        { id: 'partition-done', lines: ['            quickSort(arr, low, pi - 1);', '            quickSort(arr, pi + 1, high);'] },
        { id: 'compare', lines: ['        }', '    }'] },
        { id: 'pivot-select', lines: ['', '    private static int partition(int[] arr,', '                                 int low, int high) {', '        int pivot = arr[low];', '        int i = low;'] },
        { id: 'compare', lines: ['        for (int j = low + 1; j <= high; j++) {', '            if (arr[j] <= pivot) {'] },
        { id: 'swap', lines: ['                i++;', '                int temp = arr[i];', '                arr[i] = arr[j];', '                arr[j] = temp;'] },
        { id: 'compare', lines: ['            }', '        }'] },
        { id: 'pivot-place', lines: ['        int temp = arr[low];', '        arr[low] = arr[i];', '        arr[i] = temp;', '        return i;', '    }', '}'] },
      ],
      python: [
        { id: 'init', lines: ['def quick_sort(arr, low, high):'] },
        { id: 'compare', lines: ['    if low < high:'] },
        { id: 'pivot-select', lines: ['        pi = partition(arr, low, high)'] },
        { id: 'partition-done', lines: ['        quick_sort(arr, low, pi - 1)', '        quick_sort(arr, pi + 1, high)'] },
        { id: 'pivot-select', lines: ['', 'def partition(arr, low, high):', '    pivot = arr[low]', '    i = low'] },
        { id: 'compare', lines: ['    for j in range(low + 1, high + 1):', '        if arr[j] <= pivot:'] },
        { id: 'swap', lines: ['            i += 1', '            arr[i], arr[j] = arr[j], arr[i]'] },
        { id: 'pivot-place', lines: ['    arr[low], arr[i] = arr[i], arr[low]', '    return i'] },
      ],
    },
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra 最短路径',
    category: '图算法',
    difficulty: '中',
    engine: dijkstraEngine,
    inputType: 'graph',
    inputHint: '系统使用内置图结构，您可以选择起始节点',
    defaultInput: 'A',
    randomCount: null,
    randomRange: null,
    timeComplexity: 'O(V²) 或 O((V+E) log V)（使用优先队列）',
    spaceComplexity: 'O(V) — 存储距离和前驱节点',
    description:
      'Dijkstra 算法用于计算图中某一节点到其他所有节点的最短路径。采用贪心策略，每次选择当前未访问节点中距离最小的进行松弛操作。',
    keySteps: [
      '初始化：起点距离为 0，其余节点距离为 ∞',
      '选择未访问节点中距离最小的节点',
      '对该节点的所有邻居执行松弛操作',
      '标记当前节点为已访问，重复直至所有节点访问完毕',
    ],
    pseudoCode: [
      { id: 'init', lines: ['function dijkstra(G, start):'], indent: 0 },
      { id: 'init', lines: ['  for v in G.vertices:'], indent: 1 },
      { id: 'init', lines: ['    dist[v] = ∞, visited[v] = false'], indent: 2 },
      { id: 'init', lines: ['  dist[start] = 0'], indent: 1 },
      { id: 'select-node', lines: ['  while 还有未访问节点:'], indent: 1 },
      { id: 'select-node', lines: ['    u = 未访问中距离最小的节点'], indent: 2 },
      { id: 'select-node', lines: ['    visited[u] = true         // 标记已访问'], indent: 2 },
      { id: 'relax-check', lines: ['    for v in u.neighbors:'], indent: 2 },
      { id: 'relax-check', lines: ['      if not visited[v]:'], indent: 3 },
      { id: 'relax-check', lines: ['        newDist = dist[u] + w(u,v)  // 计算新距离'], indent: 3 },
      { id: 'relax-update', lines: ['        if newDist < dist[v]:       // 松弛操作'], indent: 3 },
      { id: 'relax-update', lines: ['          dist[v] = newDist         // 更新距离'], indent: 4 },
      { id: 'relax-update', lines: ['          prev[v] = u               // 记录前驱'], indent: 4 },
      { id: 'complete', lines: ['  return dist, prev        // 算法完成'], indent: 1 },
    ],
    codeImplementations: {
      c: [
        { id: 'init', lines: ['#include <stdio.h>', '#include <limits.h>', '#include <stdbool.h>', '#define V 7', '', 'int minDistance(int dist[], bool visited[]) {', '    int min = INT_MAX, min_idx = -1;', '    for (int v = 0; v < V; v++)', '        if (!visited[v] && dist[v] <= min)', '            min = dist[v], min_idx = v;', '    return min_idx;', '}'] },
        { id: 'init', lines: ['', 'void dijkstra(int graph[V][V], int start) {', '    int dist[V];', '    bool visited[V] = {false};', '    for (int i = 0; i < V; i++)', '        dist[i] = INT_MAX;', '    dist[start] = 0;'] },
        { id: 'select-node', lines: ['', '    for (int count = 0; count < V - 1; count++) {', '        int u = minDistance(dist, visited);', '        visited[u] = true;'] },
        { id: 'relax-check', lines: ['        for (int v = 0; v < V; v++)', '            if (!visited[v] && graph[u][v]', '                && dist[u] != INT_MAX'] },
        { id: 'relax-update', lines: ['                && dist[u] + graph[u][v] < dist[v])', '                dist[v] = dist[u] + graph[u][v];', '    }', '}'] },
      ],
      java: [
        { id: 'init', lines: ['import java.util.Arrays;', '', 'public class Dijkstra {', '    public static int[] dijkstra(int[][] graph,', '                                  int start) {', '        int V = graph.length;', '        int[] dist = new int[V];', '        boolean[] visited = new boolean[V];', '        Arrays.fill(dist, Integer.MAX_VALUE);', '        dist[start] = 0;'] },
        { id: 'select-node', lines: ['', '        for (int c = 0; c < V - 1; c++) {', '            int u = minDistance(dist, visited);', '            visited[u] = true;'] },
        { id: 'relax-check', lines: ['            for (int v = 0; v < V; v++)', '                if (!visited[v] && graph[u][v] != 0', '                    && dist[u] != Integer.MAX_VALUE'] },
        { id: 'relax-update', lines: ['                    && dist[u] + graph[u][v] < dist[v])', '                    dist[v] = dist[u] + graph[u][v];', '        }', '        return dist;', '    }'] },
        { id: 'select-node', lines: ['', '    private static int minDistance(int[] dist,', '                                    boolean[] visited) {', '        int min = Integer.MAX_VALUE, minIdx = -1;', '        for (int v = 0; v < dist.length; v++)', '            if (!visited[v] && dist[v] <= min) {', '                min = dist[v]; minIdx = v;', '            }', '        return minIdx;', '    }', '}'] },
      ],
      python: [
        { id: 'init', lines: ['def dijkstra(graph, start):', '    V = len(graph)', '    dist = [float("inf")] * V', '    visited = [False] * V', '    dist[start] = 0'] },
        { id: 'select-node', lines: ['', '    for _ in range(V - 1):', '        # 选择未访问中距离最小的节点', '        min_dist = float("inf")', '        u = -1', '        for v in range(V):', '            if not visited[v] and dist[v] < min_dist:', '                min_dist = dist[v]', '                u = v', '        visited[u] = True'] },
        { id: 'relax-check', lines: ['', '        # 松弛操作', '        for v in range(V):', '            if (not visited[v] and graph[u][v] != 0'] },
        { id: 'relax-update', lines: ['                and dist[u] + graph[u][v] < dist[v]):', '                dist[v] = dist[u] + graph[u][v]', '    return dist'] },
      ],
    },
  },
  {
    id: 'hanoi',
    name: '汉诺塔',
    category: '递归算法',
    difficulty: '中-高',
    engine: hanoiEngine,
    inputType: 'number',
    inputHint: '请输入盘子数量（2-8），例如: 4',
    defaultInput: 4,
    randomCount: null,
    randomRange: { min: 3, max: 6 },
    timeComplexity: 'O(2ⁿ) — 每增加一个盘子，移动次数翻倍',
    spaceComplexity: 'O(n) — 递归调用栈深度',
    description:
      '汉诺塔问题：有三根柱子，初始所有盘子按大小顺序堆叠在A柱。目标是将所有盘子移动到C柱，每次只能移动一个盘子，且大盘不能放在小盘上面。',
    keySteps: [
      '将 n-1 个盘子从源柱借助目标柱移到辅助柱（递归）',
      '将第 n 个（最大）盘子直接从源柱移到目标柱',
      '将 n-1 个盘子从辅助柱借助源柱移到目标柱（递归）',
      '递归终止条件：n = 1 时直接移动',
    ],
    pseudoCode: [
      { id: 'init', lines: ['function hanoi(n, src, dst, aux):'], indent: 0 },
      { id: 'base-case', lines: ['  if n == 1:             // 递归基'], indent: 1 },
      { id: 'move', lines: ['    move(src, dst)         // 直接移动'], indent: 2 },
      { id: 'base-case', lines: ['    return'], indent: 2 },
      { id: 'recurse-info', lines: ['  hanoi(n-1, src, aux, dst)   // 移 n-1 到辅助'], indent: 1 },
      { id: 'move-largest', lines: ['  move(src, dst)              // 移最大盘'], indent: 1 },
      { id: 'recurse-info', lines: ['  hanoi(n-1, aux, dst, src)   // 移 n-1 到目标'], indent: 1 },
      { id: 'complete', lines: ['  // 完成！共 2ⁿ-1 步'], indent: 0 },
    ],
    codeImplementations: {
      c: [
        { id: 'init', lines: ['#include <stdio.h>', '', 'void hanoi(int n, char src, char dst, char aux) {'] },
        { id: 'base-case', lines: ['    if (n == 1) {', '        printf("Move disk 1 from %c to %c\\n",', '               src, dst);', '        return;', '    }'] },
        { id: 'recurse-info', lines: ['    hanoi(n - 1, src, aux, dst);'] },
        { id: 'move-largest', lines: ['    printf("Move disk %d from %c to %c\\n",', '           n, src, dst);'] },
        { id: 'recurse-info', lines: ['    hanoi(n - 1, aux, dst, src);', '}'] },
      ],
      java: [
        { id: 'init', lines: ['public class Hanoi {', '    public static void hanoi(int n, char src,', '                             char dst, char aux) {'] },
        { id: 'base-case', lines: ['        if (n == 1) {', '            System.out.println(', '                "Move disk 1 from " + src +', '                " to " + dst);', '            return;', '        }'] },
        { id: 'recurse-info', lines: ['        hanoi(n - 1, src, aux, dst);'] },
        { id: 'move-largest', lines: ['        System.out.println(', '            "Move disk " + n + " from " + src +', '            " to " + dst);'] },
        { id: 'recurse-info', lines: ['        hanoi(n - 1, aux, dst, src);', '    }', '}'] },
      ],
      python: [
        { id: 'init', lines: ['def hanoi(n, src, dst, aux):'] },
        { id: 'base-case', lines: ['    if n == 1:', '        print(f"Move disk 1 from {src} to {dst}")', '        return'] },
        { id: 'recurse-info', lines: ['    hanoi(n - 1, src, aux, dst)'] },
        { id: 'move-largest', lines: ['    print(f"Move disk {n} from {src} to {dst}")'] },
        { id: 'recurse-info', lines: ['    hanoi(n - 1, aux, dst, src)'] },
      ],
    },
  },
];

/** 根据算法ID获取算法配置 */
export function getAlgorithm(id) {
  return algorithmRegistry.find((a) => a.id === id);
}

/** 可用的代码语言 */
export const CODE_LANGUAGES = [
  { key: 'pseudocode', label: '伪代码' },
  { key: 'c', label: 'C/C++' },
  { key: 'java', label: 'Java' },
  { key: 'python', label: 'Python' },
];

/**
 * 根据语言获取代码行数组（拉平）
 * @param {object} algorithm
 * @param {string} lang - 'pseudocode' | 'c' | 'java' | 'python'
 * @returns {string[]}
 */
export function getCodeLines(algorithm, lang) {
  const source = lang === 'pseudocode'
    ? algorithm.pseudoCode
    : algorithm.codeImplementations?.[lang];
  if (!source) return [];
  const lines = [];
  for (const block of source) {
    for (const line of block.lines) {
      lines.push(line);
    }
  }
  return lines;
}

/**
 * 根据步骤类型和语言，返回代码行和高亮行号
 * @param {object} algorithm
 * @param {string} stepType - 当前步骤类型
 * @param {string} lang - 'pseudocode' | 'c' | 'java' | 'python'
 * @returns {{ codeLines: string[], highlightIndex: number }}
 */
export function getCodeState(algorithm, stepType, lang = 'pseudocode') {
  const source = lang === 'pseudocode'
    ? algorithm.pseudoCode
    : algorithm.codeImplementations?.[lang];
  if (!source) return { codeLines: [], highlightIndex: -1 };

  const flatLines = [];
  const idMap = [];

  for (const block of source) {
    for (const line of block.lines) {
      flatLines.push(line);
      idMap.push(block.id);
    }
  }

  // 找到匹配当前步骤类型的行
  let highlightIndex = -1;
  for (let i = idMap.length - 1; i >= 0; i--) {
    if (idMap[i] === stepType) {
      highlightIndex = i;
      break;
    }
  }
  // 前缀匹配
  if (highlightIndex === -1) {
    for (let i = idMap.length - 1; i >= 0; i--) {
      if (stepType?.startsWith(idMap[i]) || idMap[i]?.startsWith(stepType)) {
        highlightIndex = i;
        break;
      }
    }
  }

  return { codeLines: flatLines, highlightIndex };
}

/**
 * 根据当前步骤类型，获取伪代码高亮行号（保留兼容）
 * @returns {{ codeLines: string[], highlightIndex: number }}
 */
export function getPseudoCodeState(algorithm, stepType) {
  return getCodeState(algorithm, stepType, 'pseudocode');
}

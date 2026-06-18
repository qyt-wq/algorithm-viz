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
        { id: 'init', lines: ['#include <stdio.h>', '', '// 交换两个整数的值', 'void swap(int* a, int* b) {', '    int t = *a; *a = *b; *b = t;', '}'] },
        { id: 'pivot-select', lines: ['', '// 分区函数：选取基准值，将小于基准的元素移到左侧', 'int partition(int arr[], int low, int high) {', '    int pivot = arr[low];  // 选择第一个元素作为基准值', '    int i = low;           // i 指向小于基准值的最后一个元素'] },
        { id: 'compare', lines: ['    // 遍历子数组，比较每个元素与基准值的大小', '    for (int j = low + 1; j <= high; j++) {', '        if (arr[j] <= pivot) {  // 当前元素 ≤ 基准值'] },
        { id: 'swap', lines: ['            i++;                      // 扩展左侧区域', '            swap(&arr[i], &arr[j]);    // 交换到左侧'] },
        { id: 'compare', lines: ['        }', '    }'] },
        { id: 'pivot-place', lines: ['    // 将基准值放到正确位置（左侧区域末尾）', '    swap(&arr[low], &arr[i]);', '    return i;  // 返回基准值的最终位置', '}'] },
        { id: 'compare', lines: ['', '// 快速排序递归函数', 'void quickSort(int arr[], int low, int high) {', '    if (low < high) {  // 递归终止条件：子数组长度 > 1'] },
        { id: 'pivot-select', lines: ['        int pi = partition(arr, low, high);  // 分区'] },
        { id: 'partition-done', lines: ['        quickSort(arr, low, pi - 1);   // 递归排序左半部分', '        quickSort(arr, pi + 1, high);  // 递归排序右半部分'] },
        { id: 'compare', lines: ['    }', '}'] },
      ],
      java: [
        { id: 'init', lines: ['public class QuickSort {', '    // 快速排序递归函数', '    public static void quickSort(int[] arr,', '                                int low, int high) {'] },
        { id: 'compare', lines: ['        if (low < high) {  // 递归终止条件'] },
        { id: 'pivot-select', lines: ['            // 分区并获取基准值位置', '            int pi = partition(arr, low, high);'] },
        { id: 'partition-done', lines: ['            quickSort(arr, low, pi - 1);   // 递归排序左半部分', '            quickSort(arr, pi + 1, high);  // 递归排序右半部分'] },
        { id: 'compare', lines: ['        }', '    }'] },
        { id: 'pivot-select', lines: ['', '    // 分区函数：选取基准值，划分左右区域', '    private static int partition(int[] arr,', '                                 int low, int high) {', '        int pivot = arr[low];  // 选择第一个元素作为基准值', '        int i = low;           // i 指向小于基准值的最后一个元素'] },
        { id: 'compare', lines: ['        // 遍历子数组，比较每个元素与基准值的大小', '        for (int j = low + 1; j <= high; j++) {', '            if (arr[j] <= pivot) {  // 当前元素 ≤ 基准值'] },
        { id: 'swap', lines: ['                i++;                       // 扩展左侧区域', '                // 交换 arr[i] 和 arr[j]', '                int temp = arr[i];', '                arr[i] = arr[j];', '                arr[j] = temp;'] },
        { id: 'compare', lines: ['            }', '        }'] },
        { id: 'pivot-place', lines: ['        // 将基准值放到正确位置', '        int temp = arr[low];', '        arr[low] = arr[i];', '        arr[i] = temp;', '        return i;  // 返回基准值的最终位置', '    }', '}'] },
      ],
      python: [
        { id: 'init', lines: ['# 快速排序递归函数', 'def quick_sort(arr, low, high):'] },
        { id: 'compare', lines: ['    if low < high:  # 递归终止条件：子数组长度 > 1'] },
        { id: 'pivot-select', lines: ['        pi = partition(arr, low, high)  # 分区并获取基准位置'] },
        { id: 'partition-done', lines: ['        quick_sort(arr, low, pi - 1)   # 递归排序左半部分', '        quick_sort(arr, pi + 1, high)  # 递归排序右半部分'] },
        { id: 'pivot-select', lines: ['', '# 分区函数：选取基准值，将小于基准的元素移到左侧', 'def partition(arr, low, high):', '    pivot = arr[low]  # 选择第一个元素作为基准值', '    i = low           # i 指向小于基准值的最后一个元素'] },
        { id: 'compare', lines: ['    # 遍历子数组，比较每个元素与基准值的大小', '    for j in range(low + 1, high + 1):', '        if arr[j] <= pivot:  # 当前元素 ≤ 基准值'] },
        { id: 'swap', lines: ['            i += 1                     # 扩展左侧区域', '            arr[i], arr[j] = arr[j], arr[i]  # 交换元素'] },
        { id: 'pivot-place', lines: ['    # 将基准值放到正确位置', '    arr[low], arr[i] = arr[i], arr[low]', '    return i  # 返回基准值的最终位置'] },
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
    inputHint: '选择起始节点（A-G），或切换到"自定义图"模式定义自己的图',
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
        { id: 'init', lines: ['#include <stdio.h>', '#include <limits.h>', '#include <stdbool.h>', '#define V 7  // 图中顶点数量', '', '// 从未访问节点中找距离最小的节点', 'int minDistance(int dist[], bool visited[]) {', '    int min = INT_MAX, min_idx = -1;', '    for (int v = 0; v < V; v++)', '        if (!visited[v] && dist[v] <= min)', '            min = dist[v], min_idx = v;', '    return min_idx;  // 返回距离最小的节点索引', '}'] },
        { id: 'init', lines: ['', '// Dijkstra 最短路径算法主函数', 'void dijkstra(int graph[V][V], int start) {', '    int dist[V];               // 存储起点到各顶点的最短距离', '    bool visited[V] = {false};  // 标记顶点是否已访问', '    for (int i = 0; i < V; i++)', '        dist[i] = INT_MAX;      // 初始化距离为无穷大', '    dist[start] = 0;            // 起点到自身的距离为 0'] },
        { id: 'select-node', lines: ['', '    // 主循环：每次确定一个顶点的最短路径', '    for (int count = 0; count < V - 1; count++) {', '        int u = minDistance(dist, visited);  // 选出距离最小的节点', '        visited[u] = true;                    // 标记为已访问'] },
        { id: 'relax-check', lines: ['        // 遍历所有邻接顶点，尝试松弛操作', '        for (int v = 0; v < V; v++)', '            if (!visited[v] && graph[u][v]  // v 未访问且有边', '                && dist[u] != INT_MAX)       // u 已可达'] },
        { id: 'relax-update', lines: ['                // 如果通过 u 到 v 的距离更短，则更新 dist[v]', '                && dist[u] + graph[u][v] < dist[v])', '                dist[v] = dist[u] + graph[u][v];', '    }', '}'] },
      ],
      java: [
        { id: 'init', lines: ['import java.util.Arrays;', '', 'public class Dijkstra {', '    // Dijkstra 最短路径算法主函数', '    public static int[] dijkstra(int[][] graph,', '                                  int start) {', '        int V = graph.length;         // 图的顶点数量', '        int[] dist = new int[V];       // 存储最短距离', '        boolean[] visited = new boolean[V];  // 标记已访问顶点', '        Arrays.fill(dist, Integer.MAX_VALUE);  // 初始距离为无穷大', '        dist[start] = 0;               // 起点到自身距离为 0'] },
        { id: 'select-node', lines: ['', '        // 主循环：每次确定一个顶点的最短路径', '        for (int c = 0; c < V - 1; c++) {', '            int u = minDistance(dist, visited);  // 选出距离最小的节点', '            visited[u] = true;                    // 标记为已访问'] },
        { id: 'relax-check', lines: ['            // 遍历所有邻接顶点，尝试松弛操作', '            for (int v = 0; v < V; v++)', '                if (!visited[v] && graph[u][v] != 0  // v 未访问且有边', '                    && dist[u] != Integer.MAX_VALUE)   // u 已可达'] },
        { id: 'relax-update', lines: ['                    // 如果通过 u 到 v 的距离更短，则更新 dist[v]', '                    && dist[u] + graph[u][v] < dist[v])', '                    dist[v] = dist[u] + graph[u][v];', '        }', '        return dist;  // 返回最终的最短距离数组', '    }'] },
        { id: 'select-node', lines: ['', '    // 从未访问节点中找距离最小的节点', '    private static int minDistance(int[] dist,', '                                    boolean[] visited) {', '        int min = Integer.MAX_VALUE, minIdx = -1;', '        for (int v = 0; v < dist.length; v++)', '            if (!visited[v] && dist[v] <= min) {', '                min = dist[v]; minIdx = v;', '            }', '        return minIdx;  // 返回距离最小的节点索引', '    }', '}'] },
      ],
      python: [
        { id: 'init', lines: ['# Dijkstra 最短路径算法', 'def dijkstra(graph, start):', '    V = len(graph)                    # 图的顶点数量', '    dist = [float("inf")] * V          # 存储最短距离，初始为无穷大', '    visited = [False] * V              # 标记顶点是否已访问', '    dist[start] = 0                    # 起点到自身距离为 0'] },
        { id: 'select-node', lines: ['', '    # 主循环：每次确定一个顶点的最短路径', '    for _ in range(V - 1):', '        # 从未访问节点中选距离最小的', '        min_dist = float("inf")', '        u = -1', '        for v in range(V):', '            if not visited[v] and dist[v] < min_dist:', '                min_dist = dist[v]', '                u = v', '        visited[u] = True  # 标记为已访问'] },
        { id: 'relax-check', lines: ['', '        # 对选中节点的所有邻接顶点进行松弛操作', '        for v in range(V):', '            if (not visited[v] and graph[u][v] != 0  # v 未访问且有边'] },
        { id: 'relax-update', lines: ['                # 如果通过 u 到 v 的距离更短，则更新 dist[v]', '                and dist[u] + graph[u][v] < dist[v]):', '                dist[v] = dist[u] + graph[u][v]', '    return dist  # 返回最终的最短距离列表'] },
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
        { id: 'init', lines: ['#include <stdio.h>', '', '// 汉诺塔递归函数', '// n: 盘子数量, src: 源柱, dst: 目标柱, aux: 辅助柱', 'void hanoi(int n, char src, char dst, char aux) {'] },
        { id: 'base-case', lines: ['    // 递归基：仅一个盘子时直接移动', '    if (n == 1) {', '        printf("Move disk 1 from %c to %c\\n",', '               src, dst);', '        return;', '    }'] },
        { id: 'recurse-info', lines: ['    // 第一步：将 n−1 个盘子从 src 移到 aux（借助 dst）', '    hanoi(n - 1, src, aux, dst);'] },
        { id: 'move-largest', lines: ['    // 第二步：将第 n 号（最大）盘子从 src 移到 dst', '    printf("Move disk %d from %c to %c\\n",', '           n, src, dst);'] },
        { id: 'recurse-info', lines: ['    // 第三步：将 n−1 个盘子从 aux 移到 dst（借助 src）', '    hanoi(n - 1, aux, dst, src);', '}'] },
      ],
      java: [
        { id: 'init', lines: ['public class Hanoi {', '    // 汉诺塔递归函数', '    // n: 盘子数量, src: 源柱, dst: 目标柱, aux: 辅助柱', '    public static void hanoi(int n, char src,', '                             char dst, char aux) {'] },
        { id: 'base-case', lines: ['        // 递归基：仅一个盘子时直接移动', '        if (n == 1) {', '            System.out.println(', '                "Move disk 1 from " + src +', '                " to " + dst);', '            return;', '        }'] },
        { id: 'recurse-info', lines: ['        // 第一步：将 n−1 个盘子从 src 移到 aux（借助 dst）', '        hanoi(n - 1, src, aux, dst);'] },
        { id: 'move-largest', lines: ['        // 第二步：将第 n 号（最大）盘子从 src 移到 dst', '        System.out.println(', '            "Move disk " + n + " from " + src +', '            " to " + dst);'] },
        { id: 'recurse-info', lines: ['        // 第三步：将 n−1 个盘子从 aux 移到 dst（借助 src）', '        hanoi(n - 1, aux, dst, src);', '    }', '}'] },
      ],
      python: [
        { id: 'init', lines: ['# 汉诺塔递归函数', '# n: 盘子数量, src: 源柱, dst: 目标柱, aux: 辅助柱', 'def hanoi(n, src, dst, aux):'] },
        { id: 'base-case', lines: ['    # 递归基：仅一个盘子时直接移动', '    if n == 1:', '        print(f"Move disk 1 from {src} to {dst}")', '        return'] },
        { id: 'recurse-info', lines: ['    # 第一步：将 n−1 个盘子从 src 移到 aux（借助 dst）', '    hanoi(n - 1, src, aux, dst)'] },
        { id: 'move-largest', lines: ['    # 第二步：将第 n 号（最大）盘子从 src 移到 dst', '    print(f"Move disk {n} from {src} to {dst}")'] },
        { id: 'recurse-info', lines: ['    # 第三步：将 n−1 个盘子从 aux 移到 dst（借助 src）', '    hanoi(n - 1, aux, dst, src)'] },
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

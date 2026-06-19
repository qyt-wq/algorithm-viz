/**
 * 算法注册中心 — 统一管理所有算法模块
 * 新增算法只需在此注册即可自动接入系统
 */
import { quickSortEngine } from './quickSort';
import { bubbleSortEngine } from './bubbleSort';
import { mergeSortEngine } from './mergeSort';
import { dijkstraEngine } from './dijkstra';
import { hanoiEngine } from './hanoi';
import { huffmanEngine } from './huffman';

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
    id: 'bubblesort',
    name: '冒泡排序',
    category: '排序算法',
    difficulty: '低',
    engine: bubbleSortEngine,
    inputType: 'array',
    inputHint: '请输入用逗号分隔的整数，例如: 64, 34, 25, 12, 22, 11, 90',
    defaultInput: [64, 34, 25, 12, 22, 11, 90],
    randomCount: { min: 5, max: 15 },
    randomRange: { min: 1, max: 100 },
    timeComplexity: '平均 O(n²)，最好 O(n)（已有序时）',
    spaceComplexity: 'O(1) — 原地排序',
    description:
      '冒泡排序重复遍历数组，依次比较相邻元素，如果顺序错误则交换它们。每一轮"冒泡"将当前未排序部分的最大值移至正确位置。若某一轮没有发生交换，则数组已有序，可提前结束。',
    keySteps: [
      '从数组第一个元素开始，依次比较相邻的两个元素',
      '如果前一个元素大于后一个元素，则交换两者',
      '每一轮遍历将当前最大元素"冒泡"到数组末尾',
      '若某一轮无交换发生，说明数组已有序，提前终止',
    ],
    pseudoCode: [
      { id: 'init', lines: ['function bubbleSort(arr):'], indent: 0 },
      { id: 'init', lines: ['  n = len(arr)'], indent: 1 },
      { id: 'compare', lines: ['  for i = 0 to n-2:'], indent: 1 },
      { id: 'compare', lines: ['    swapped = false'], indent: 2 },
      { id: 'compare', lines: ['    for j = 0 to n-2-i:'], indent: 2 },
      { id: 'compare', lines: ['      if arr[j] > arr[j+1]:      // 比较相邻'], indent: 3 },
      { id: 'swap', lines: ['        swap(arr[j], arr[j+1])    // 交换'], indent: 4 },
      { id: 'swap', lines: ['        swapped = true'], indent: 4 },
      { id: 'pass-complete', lines: ['    if not swapped: break        // 提前终止'], indent: 2 },
      { id: 'complete', lines: ['  return arr                     // 排序完成'], indent: 1 },
    ],
    codeImplementations: {
      c: [
        { id: 'init', lines: ['#include <stdio.h>', '', '// 冒泡排序', 'void bubbleSort(int arr[], int n) {'] },
        { id: 'compare', lines: ['    // 外层循环：每轮确定一个最大元素', '    for (int i = 0; i < n - 1; i++) {', '        int swapped = 0;  // 标记本轮是否发生交换'] },
        { id: 'compare', lines: ['        // 内层循环：相邻比较', '        for (int j = 0; j < n - 1 - i; j++) {', '            if (arr[j] > arr[j + 1]) {  // 比较相邻'] },
        { id: 'swap', lines: ['                // 交换 arr[j] 和 arr[j+1]', '                int temp = arr[j];', '                arr[j] = arr[j + 1];', '                arr[j + 1] = temp;', '                swapped = 1;'] },
        { id: 'compare', lines: ['            }', '        }'] },
        { id: 'pass-complete', lines: ['        if (!swapped) break;  // 无交换，提前终止'] },
        { id: 'compare', lines: ['    }', '}'] },
      ],
      java: [
        { id: 'init', lines: ['public class BubbleSort {', '    // 冒泡排序', '    public static void bubbleSort(int[] arr) {', '        int n = arr.length;'] },
        { id: 'compare', lines: ['        // 外层循环：每轮确定一个最大元素', '        for (int i = 0; i < n - 1; i++) {', '            boolean swapped = false;'] },
        { id: 'compare', lines: ['            // 内层循环：相邻比较', '            for (int j = 0; j < n - 1 - i; j++) {', '                if (arr[j] > arr[j + 1]) {  // 比较相邻'] },
        { id: 'swap', lines: ['                    // 交换 arr[j] 和 arr[j+1]', '                    int temp = arr[j];', '                    arr[j] = arr[j + 1];', '                    arr[j + 1] = temp;', '                    swapped = true;'] },
        { id: 'compare', lines: ['                }', '            }'] },
        { id: 'pass-complete', lines: ['            if (!swapped) break;  // 无交换，提前终止'] },
        { id: 'compare', lines: ['        }', '    }', '}'] },
      ],
      python: [
        { id: 'init', lines: ['# 冒泡排序', 'def bubble_sort(arr):', '    n = len(arr)'] },
        { id: 'compare', lines: ['    # 外层循环：每轮确定一个最大元素', '    for i in range(n - 1):', '        swapped = False'] },
        { id: 'compare', lines: ['        # 内层循环：相邻比较', '        for j in range(n - 1 - i):', '            if arr[j] > arr[j + 1]:  # 比较相邻'] },
        { id: 'swap', lines: ['                # 交换 arr[j] 和 arr[j+1]', '                arr[j], arr[j + 1] = arr[j + 1], arr[j]', '                swapped = True'] },
        { id: 'pass-complete', lines: ['        if not swapped:  # 无交换，提前终止', '            break'] },
        { id: 'complete', lines: ['    return arr  # 排序完成'] },
      ],
    },
  },
  {
    id: 'mergesort',
    name: '归并排序',
    category: '排序算法',
    difficulty: '中',
    engine: mergeSortEngine,
    inputType: 'array',
    inputHint: '请输入用逗号分隔的整数，例如: 38, 27, 43, 3, 9, 82, 10',
    defaultInput: [38, 27, 43, 3, 9, 82, 10],
    randomCount: { min: 5, max: 15 },
    randomRange: { min: 1, max: 100 },
    timeComplexity: 'O(n log n) — 所有情况一致',
    spaceComplexity: 'O(n) — 需要辅助数组',
    description:
      '归并排序采用分治策略：递归地将数组分成两半，分别排序，然后将两个有序子数组合并为一个有序数组。合并时比较两个子数组的队首元素，取较小者放入结果。',
    keySteps: [
      '递归地将数组从中间分成左右两个子数组',
      '分别对左右子数组进行归并排序（递归）',
      '合并两个有序子数组：比较队首元素，取较小者',
      '递归终止：子数组长度为1时天然有序',
    ],
    pseudoCode: [
      { id: 'init', lines: ['function mergeSort(arr, l, r):'], indent: 0 },
      { id: 'base-case', lines: ['  if l >= r: return             // 递归基'], indent: 1 },
      { id: 'divide', lines: ['  mid = (l + r) // 2              // 分割点'], indent: 1 },
      { id: 'divide', lines: ['  mergeSort(arr, l, mid)          // 排序左半'], indent: 1 },
      { id: 'divide', lines: ['  mergeSort(arr, mid+1, r)        // 排序右半'], indent: 1 },
      { id: 'merge-compare', lines: ['  merge(arr, l, mid, r)     // 合并'], indent: 1 },
      { id: 'merge-compare', lines: ['function merge(arr, l, mid, r):'], indent: 0 },
      { id: 'merge-compare', lines: ['  i = l, j = mid+1, k = l'], indent: 1 },
      { id: 'merge-compare', lines: ['  while i <= mid and j <= r:'], indent: 1 },
      { id: 'merge-compare', lines: ['    if aux[i] <= aux[j]:       // 比较'], indent: 2 },
      { id: 'merge-place', lines: ['      arr[k++] = aux[i++]        // 放置'], indent: 3 },
      { id: 'merge-place', lines: ['    else:'], indent: 2 },
      { id: 'merge-place', lines: ['      arr[k++] = aux[j++]        // 放置'], indent: 3 },
      { id: 'merge-complete', lines: ['  // 复制剩余元素'], indent: 1 },
      { id: 'complete', lines: ['  return arr                     // 排序完成'], indent: 0 },
    ],
    codeImplementations: {
      c: [
        { id: 'init', lines: ['#include <stdio.h>', '#include <stdlib.h>', '', '// 合并两个有序子数组', 'void merge(int arr[], int l, int mid, int r) {', '    int n1 = mid - l + 1, n2 = r - mid;', '    int* L = (int*)malloc(n1 * sizeof(int));', '    int* R = (int*)malloc(n2 * sizeof(int));'] },
        { id: 'merge-compare', lines: ['    for (int i = 0; i < n1; i++) L[i] = arr[l + i];', '    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];', '', '    int i = 0, j = 0, k = l;'] },
        { id: 'merge-compare', lines: ['    while (i < n1 && j < n2) {', '        if (L[i] <= R[j])  // 比较'] },
        { id: 'merge-place', lines: ['            arr[k++] = L[i++];  // 放置'] },
        { id: 'merge-place', lines: ['        else', '            arr[k++] = R[j++];  // 放置'] },
        { id: 'merge-compare', lines: ['    }'] },
        { id: 'merge-place', lines: ['    while (i < n1) arr[k++] = L[i++];  // 复制剩余', '    while (j < n2) arr[k++] = R[j++];'] },
        { id: 'merge-complete', lines: ['    free(L); free(R);', '}'] },
        { id: 'init', lines: ['', '// 归并排序递归函数', 'void mergeSort(int arr[], int l, int r) {'] },
        { id: 'base-case', lines: ['    if (l >= r) return;  // 递归基'] },
        { id: 'divide', lines: ['    int mid = (l + r) / 2;  // 分割'] },
        { id: 'divide', lines: ['    mergeSort(arr, l, mid);     // 排序左半', '    mergeSort(arr, mid + 1, r); // 排序右半'] },
        { id: 'merge-compare', lines: ['    merge(arr, l, mid, r);    // 合并', '}'] },
      ],
      java: [
        { id: 'init', lines: ['public class MergeSort {', '    // 合并两个有序子数组', '    private static void merge(int[] arr, int[] aux,', '                               int l, int mid, int r) {'] },
        { id: 'merge-compare', lines: ['        for (int k = l; k <= r; k++) aux[k] = arr[k];', '        int i = l, j = mid + 1, k = l;'] },
        { id: 'merge-compare', lines: ['        while (i <= mid && j <= r) {', '            if (aux[i] <= aux[j])  // 比较'] },
        { id: 'merge-place', lines: ['                arr[k++] = aux[i++];  // 放置'] },
        { id: 'merge-place', lines: ['            else', '                arr[k++] = aux[j++];  // 放置'] },
        { id: 'merge-compare', lines: ['        }'] },
        { id: 'merge-place', lines: ['        while (i <= mid) arr[k++] = aux[i++];  // 复制剩余', '        while (j <= r) arr[k++] = aux[j++];'] },
        { id: 'merge-complete', lines: ['    }'] },
        { id: 'init', lines: ['', '    // 归并排序递归函数', '    public static void mergeSort(int[] arr,', '                                  int[] aux, int l, int r) {'] },
        { id: 'base-case', lines: ['        if (l >= r) return;  // 递归基'] },
        { id: 'divide', lines: ['        int mid = (l + r) / 2;  // 分割'] },
        { id: 'divide', lines: ['        mergeSort(arr, aux, l, mid);     // 排序左半', '        mergeSort(arr, aux, mid + 1, r); // 排序右半'] },
        { id: 'merge-compare', lines: ['        merge(arr, aux, l, mid, r);      // 合并', '    }', '}'] },
      ],
      python: [
        { id: 'init', lines: ['# 归并排序递归函数', 'def merge_sort(arr, l, r):'] },
        { id: 'base-case', lines: ['    if l >= r:  # 递归基', '        return'] },
        { id: 'divide', lines: ['    mid = (l + r) // 2  # 分割'] },
        { id: 'divide', lines: ['    merge_sort(arr, l, mid)      # 排序左半', '    merge_sort(arr, mid + 1, r)  # 排序右半'] },
        { id: 'merge-compare', lines: ['    merge(arr, l, mid, r)       # 合并'] },
        { id: 'merge-compare', lines: ['', '# 合并两个有序子数组', 'def merge(arr, l, mid, r):', '    aux = arr[l:r+1][:]        # 复制到辅助数组'] },
        { id: 'merge-compare', lines: ['    i, j, k = l, mid + 1, l', '    while i <= mid and j <= r:', '        if aux[i - l] <= aux[j - l]:  # 比较'] },
        { id: 'merge-place', lines: ['            arr[k] = aux[i - l]; i += 1  # 放置'] },
        { id: 'merge-place', lines: ['        else:', '            arr[k] = aux[j - l]; j += 1  # 放置'] },
        { id: 'merge-place', lines: ['        k += 1', '    while i <= mid:  # 复制剩余', '        arr[k] = aux[i - l]; i += 1; k += 1'] },
        { id: 'complete', lines: ['    return arr  # 排序完成'] },
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
    id: 'huffman',
    name: '哈夫曼编码树',
    category: '树结构算法',
    difficulty: '中',
    engine: huffmanEngine,
    inputType: 'frequencies',
    inputHint: '请输入字符和频率，如 "a:5 b:9 c:12 d:13 e:16 f:45"',
    defaultInput: { a: 5, b: 9, c: 12, d: 13, e: 16, f: 45 },
    randomCount: { min: 4, max: 8 },
    randomRange: { min: 1, max: 50 },
    timeComplexity: 'O(n log n) — 使用优先队列',
    spaceComplexity: 'O(n) — 存储哈夫曼树节点',
    description:
      '哈夫曼编码是一种贪心算法，通过构建最优二叉树实现数据压缩。每次从森林中选择频率最小的两个节点合并为新节点，重复直到所有节点合并为一棵树。从根到叶子的路径即为编码（左0右1）。',
    keySteps: [
      '将所有字符及其频率初始化为独立的树节点（森林）',
      '从森林中选出两个频率最小的树根节点',
      '将两个节点合并为一个新内部节点，频率为两者之和',
      '将新节点放回森林，重复直到只剩一棵树',
      '从根遍历树，左分支编码0，右分支编码1，得到哈夫曼编码',
    ],
    pseudoCode: [
      { id: 'init', lines: ['function huffman(freqMap):'], indent: 0 },
      { id: 'init', lines: ['  for each (char, freq) in freqMap:'], indent: 1 },
      { id: 'init', lines: ['    forest.add( LeafNode(char, freq) )'], indent: 2 },
      { id: 'select-min', lines: ['  while |forest| > 1:'], indent: 1 },
      { id: 'select-min', lines: ['    x = extractMin(forest)        // 选频率最小'], indent: 2 },
      { id: 'select-min', lines: ['    y = extractMin(forest)        // 选频率次小'], indent: 2 },
      { id: 'merge', lines: ['    z = new Node(x, y)             // 合并为新节点'], indent: 2 },
      { id: 'merge', lines: ['    z.freq = x.freq + y.freq'], indent: 2 },
      { id: 'update-forest', lines: ['    forest.add(z)                // 放回森林'], indent: 2 },
      { id: 'complete', lines: ['  return forest[0]                // 返回哈夫曼树根'], indent: 1 },
    ],
    codeImplementations: {
      c: [
        { id: 'init', lines: ['#include <stdio.h>', '#include <stdlib.h>', '', '// 哈夫曼树节点', 'typedef struct Node {', '    char ch;', '    int freq;', '    struct Node *left, *right;', '} Node;'] },
        { id: 'merge', lines: ['', '// 创建新内部节点', 'Node* createNode(char ch, int freq, Node* l, Node* r) {', '    Node* n = (Node*)malloc(sizeof(Node));', '    n->ch = ch; n->freq = freq;', '    n->left = l; n->right = r;', '    return n;', '}'] },
        { id: 'select-min', lines: ['', '// 找森林中频率最小的节点', 'int findMinIndex(Node** forest, int size) {', '    int minIdx = 0;', '    for (int i = 1; i < size; i++)', '        if (forest[i]->freq < forest[minIdx]->freq)', '            minIdx = i;', '    return minIdx;', '}'] },
        { id: 'select-min', lines: ['', '// 构建哈夫曼树', 'Node* buildHuffmanTree(char chars[], int freqs[], int n) {', '    Node** forest = ...  // 初始化森林'] },
        { id: 'merge', lines: ['    while (size > 1) {', '        x = extractMin(forest);  // 取最小', '        y = extractMin(forest);  // 取次小', '        z = createNode(0, x->freq + y->freq, x, y);  // 合并'] },
        { id: 'update-forest', lines: ['        forest[size++] = z;  // 放回', '    }'] },
        { id: 'complete', lines: ['    return forest[0];  // 返回根节点', '}'] },
      ],
      java: [
        { id: 'init', lines: ['import java.util.PriorityQueue;', '', '// 哈夫曼树节点', 'class HuffmanNode implements Comparable<HuffmanNode> {', '    char ch;', '    int freq;', '    HuffmanNode left, right;', '', '    HuffmanNode(char ch, int freq) {', '        this.ch = ch; this.freq = freq;', '    }', ''] },
        { id: 'select-min', lines: ['    public int compareTo(HuffmanNode o) {', '        return this.freq - o.freq;  // 按频率升序', '    }', '}'] },
        { id: 'init', lines: ['', '// 构建哈夫曼树', 'public static HuffmanNode buildTree(int[] freqs, char[] chars) {'] },
        { id: 'select-min', lines: ['    PriorityQueue<HuffmanNode> pq = new PriorityQueue<>();', '    for (int i = 0; i < chars.length; i++)', '        pq.add(new HuffmanNode(chars[i], freqs[i]));'] },
        { id: 'merge', lines: ['    while (pq.size() > 1) {', '        HuffmanNode x = pq.poll();  // 最小', '        HuffmanNode y = pq.poll();  // 次小', '        HuffmanNode z = new HuffmanNode(\'\\0\', x.freq + y.freq);'] },
        { id: 'merge', lines: ['        z.left = x; z.right = y;  // 合并', '        pq.add(z);  // 放回', '    }'] },
        { id: 'complete', lines: ['    return pq.poll();  // 返回根节点', '}'] },
      ],
      python: [
        { id: 'init', lines: ['import heapq', '', '# 哈夫曼树节点', 'class HuffmanNode:', '    def __init__(self, char, freq):', '        self.char = char', '        self.freq = freq', '        self.left = None', '        self.right = None', ''] },
        { id: 'select-min', lines: ['    def __lt__(self, other):  # 用于优先队列比较', '        return self.freq < other.freq'] },
        { id: 'init', lines: ['', '# 构建哈夫曼树', 'def build_huffman_tree(freq_map):', '    heap = []'] },
        { id: 'init', lines: ['    for char, freq in freq_map.items():', '        heapq.heappush(heap, HuffmanNode(char, freq))  # 初始化森林'] },
        { id: 'select-min', lines: ['    while len(heap) > 1:', '        x = heapq.heappop(heap)  # 选频率最小', '        y = heapq.heappop(heap)  # 选频率次小'] },
        { id: 'merge', lines: ['        z = HuffmanNode(None, x.freq + y.freq)  # 合并', '        z.left, z.right = x, y'] },
        { id: 'update-forest', lines: ['        heapq.heappush(heap, z)  # 放回森林'] },
        { id: 'complete', lines: ['    return heap[0]  # 返回哈夫曼树根节点'] },
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

/**
 * 测试用例配置
 * 每个算法至少2条标准测试用例，总计不少于6条
 */

export const testCases = {
  quicksort: [
    {
      id: 'qs-tc1',
      name: '常规无序数组',
      input: [64, 34, 25, 12, 22, 11, 90],
      description: '包含7个无序整数的常规测试用例，覆盖多次分区和递归操作',
      expectedResult: [11, 12, 22, 25, 34, 64, 90],
    },
    {
      id: 'qs-tc2',
      name: '接近有序数组',
      input: [5, 10, 15, 20, 25, 30, 8],
      description: '接近有序的数组，测试基准值选择在最左侧时与接近有序数据的分区效果',
      expectedResult: [5, 8, 10, 15, 20, 25, 30],
    },
    {
      id: 'qs-tc3',
      name: '含重复元素',
      input: [42, 23, 42, 17, 23, 8, 42],
      description: '包含重复元素的数组，验证算法在重复值场景下的正确性',
      expectedResult: [8, 17, 23, 23, 42, 42, 42],
    },
  ],

  dijkstra: [
    {
      id: 'dj-tc1',
      name: '从节点A出发（内置图）',
      input: 'A',
      description: '从中心节点A出发，覆盖多条不同权重的路径',
      expectedResult: 'A→C→B→E→F→D→G（距离依次为 0, 2, 3, 6, 8, 8, 9）',
    },
    {
      id: 'dj-tc2',
      name: '从节点D出发（内置图）',
      input: 'D',
      description: '从底部节点D出发，测试不同起点的路径计算',
      expectedResult: 'D到各节点的最短路径',
    },
    {
      id: 'dj-tc3',
      name: '简单三角图（自定义）',
      input: {
        startNode: 'A',
        graph: {
          nodes: [
            { id: 'A', x: 200, y: 80 },
            { id: 'B', x: 100, y: 250 },
            { id: 'C', x: 300, y: 250 },
          ],
          edges: [
            { from: 'A', to: 'B', weight: 3 },
            { from: 'A', to: 'C', weight: 6 },
            { from: 'B', to: 'C', weight: 2 },
          ],
        },
      },
      description: '3节点三角图，验证简单的路径选择（A→B→C 比 A→C 短）',
      expectedResult: 'A→B=3, A→C=5（经B）',
    },
    {
      id: 'dj-tc4',
      name: '直线链（自定义）',
      input: {
        startNode: 'A',
        graph: {
          nodes: [
            { id: 'A', x: 80, y: 250 },
            { id: 'B', x: 160, y: 250 },
            { id: 'C', x: 240, y: 250 },
            { id: 'D', x: 320, y: 250 },
          ],
          edges: [
            { from: 'A', to: 'B', weight: 2 },
            { from: 'B', to: 'C', weight: 3 },
            { from: 'C', to: 'D', weight: 1 },
            { from: 'A', to: 'D', weight: 10 },
          ],
        },
      },
      description: '4节点链式图+一条直接长边，验证算法不会走捷径长边',
      expectedResult: 'A→B=2, A→C=5, A→D=6（经B,C），而非 A→D=10',
    },
  ],

  hanoi: [
    {
      id: 'hn-tc1',
      name: '3个盘子',
      input: 3,
      description: '标准3层汉诺塔，共需7步完成',
      expectedResult: '最少步数：2³-1 = 7 步',
    },
    {
      id: 'hn-tc2',
      name: '5个盘子',
      input: 5,
      description: '5层汉诺塔，共需31步完成，验证递归深度',
      expectedResult: '最少步数：2⁵-1 = 31 步',
    },
  ],

};

/** 获取指定算法的测试用例 */
export function getTestCases(algorithmId) {
  return testCases[algorithmId] || [];
}

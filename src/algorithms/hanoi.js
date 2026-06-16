/**
 * 汉诺塔算法引擎
 * 返回完整的步骤序列，每步包含三个柱子的盘子状态、描述等
 */

/**
 * @param {number} numDisks - 盘子数量（2-8）
 * @returns {Step[]} steps - 算法执行步骤序列
 */
export function hanoiEngine(numDisks) {
  const steps = [];

  // 初始化三个柱子
  const pegs = {
    A: [],
    B: [],
    C: [],
  };

  // 将所有盘子放到A柱（大盘在下，小盘在上）
  // 用数字表示盘子大小，数字越大盘子越大
  for (let i = numDisks; i >= 1; i--) {
    pegs.A.push(i);
  }

  const pegNames = { A: 'A 柱（源柱）', B: 'B 柱（辅助柱）', C: 'C 柱（目标柱）' };

  // 初始状态
  steps.push({
    type: 'init',
    pegs: JSON.parse(JSON.stringify(pegs)),
    move: null,
    description: `初始状态：${numDisks} 个盘子全部在 A 柱，目标是将所有盘子移到 C 柱`,
    recursionDepth: 0,
  });

  let moveCount = 0;

  function moveDisk(from, to) {
    const disk = pegs[from].pop();
    pegs[to].push(disk);
    moveCount++;

    steps.push({
      type: 'move',
      pegs: JSON.parse(JSON.stringify(pegs)),
      move: { disk, from, to, moveNumber: moveCount },
      description: `步骤 ${moveCount}：将盘子 ${disk} 从 ${pegNames[from]} 移到 ${pegNames[to]}`,
      recursionDepth: 0,
    });
  }

  function hanoi(n, source, target, auxiliary, depth) {
    if (n === 1) {
      // 递归终止：直接移动
      steps.push({
        type: 'base-case',
        pegs: JSON.parse(JSON.stringify(pegs)),
        move: null,
        description: `递归基：只剩 1 个盘子，直接将盘子 1 从 ${pegNames[source]} 移到 ${pegNames[target]}`,
        recursionDepth: depth,
      });
      moveDisk(source, target);
      return;
    }

    // 步骤说明：将 n-1 个盘子从 source 移到 auxiliary
    steps.push({
      type: 'recurse-info',
      pegs: JSON.parse(JSON.stringify(pegs)),
      move: null,
      description: `递归：将上面 ${n - 1} 个盘子从 ${pegNames[source]} 借助 ${pegNames[target]} 移到 ${pegNames[auxiliary]}`,
      recursionDepth: depth,
    });

    hanoi(n - 1, source, auxiliary, target, depth + 1);

    // 移动最大的盘子
    steps.push({
      type: 'move-largest',
      pegs: JSON.parse(JSON.stringify(pegs)),
      move: null,
      description: `将最大的盘子 ${n} 从 ${pegNames[source]} 直接移到 ${pegNames[target]}`,
      recursionDepth: depth,
    });
    moveDisk(source, target);

    // 步骤说明：将 n-1 个盘子从 auxiliary 移到 target
    steps.push({
      type: 'recurse-info',
      pegs: JSON.parse(JSON.stringify(pegs)),
      move: null,
      description: `递归：将 ${n - 1} 个盘子从 ${pegNames[auxiliary]} 借助 ${pegNames[source]} 移到 ${pegNames[target]}`,
      recursionDepth: depth,
    });

    hanoi(n - 1, auxiliary, target, source, depth + 1);
  }

  hanoi(numDisks, 'A', 'C', 'B', 0);

  // 完成状态
  steps.push({
    type: 'complete',
    pegs: JSON.parse(JSON.stringify(pegs)),
    move: null,
    description: `汉诺塔完成！共 ${moveCount} 步移动，理论最少步数为 2^${numDisks} - 1 = ${Math.pow(2, numDisks) - 1}`,
    recursionDepth: 0,
  });

  return steps;
}

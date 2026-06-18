const PEG_COLORS = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

const PEG_LABELS = { A: 'A (源柱)', B: 'B (辅助柱)', C: 'C (目标柱)' };

export default function HanoiViz({ step, numDisks }) {
  if (!step?.pegs) {
    return <div className="empty-viz">无步骤数据</div>;
  }

  const pegs = step.pegs;
  const disks = numDisks;

  const maxDiskWidth = 140;
  const minDiskWidth = 40;
  const diskWidthStep = disks > 1 ? (maxDiskWidth - minDiskWidth) / (disks - 1) : 0;

  const getDiskWidth = (diskNum) => minDiskWidth + diskWidthStep * (diskNum - 1);
  const getDiskColor = (diskNum) => PEG_COLORS[(diskNum - 1) % PEG_COLORS.length];

  const moveInfo = step.move;

  return (
    <div className="hanoi-viz">
      {/* 三根柱子 — 底座在下，柱子从底部向上延伸 */}
      <div className="pegs-container">
        {['A', 'B', 'C'].map((pegId) => {
          const pegDisks = pegs[pegId] || [];
          const pegHeight = disks * 28 + 30;

          return (
            <div key={pegId} className="peg-column">
              {/* 标签 */}
              <div className="peg-label">
                {PEG_LABELS[pegId]}
              </div>

              {/* 柱子和盘子 — 底座在底部 */}
              <div className="peg-stand" style={{ height: `${pegHeight}px` }}>
                {/* 底部底座 */}
                <div className="peg-base-line" />

                {/* 柱子杆 — 从底座向上延伸 */}
                <div className="peg-pole" style={{ height: `${pegHeight - 6}px` }} />

                {/* 盘子从底部向上堆叠（大盘在下） */}
                <div className="disks-layer">
                  {pegDisks.map((diskNum, idx) => (
                    <div
                      key={`disk-${diskNum}`}
                      className={`disk-block ${moveInfo?.disk === diskNum && moveInfo?.to === pegId ? 'disk-moving' : ''}`}
                      style={{
                        bottom: `${idx * 28 + 4}px`,
                        width: `${getDiskWidth(diskNum)}px`,
                        backgroundColor: getDiskColor(diskNum),
                        zIndex: idx + 1,
                      }}
                    >
                      <span className="disk-block-label">
                        {diskNum}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 盘子计数 */}
              <div className="peg-count">
                {pegDisks.length} 个盘子
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

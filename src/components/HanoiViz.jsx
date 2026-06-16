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
      {/* 移动信息横幅 */}
      {moveInfo && (
        <div className="hanoi-move-info" style={{
          display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
          marginBottom: 24, padding: '6px 18px', background: 'rgba(74,144,217,0.12)',
          borderRadius: 20, fontSize: 13, color: '#c0c8d8',
          border: '1px solid rgba(74,144,217,0.2)',
        }}>
          <span style={{ fontWeight: 700, color: '#4a90d9', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
            第 {moveInfo.moveNumber} 步
          </span>
          <span>
            盘子 <strong style={{ color: getDiskColor(moveInfo.disk) }}>{moveInfo.disk}</strong>
            {' '}从 {PEG_LABELS[moveInfo.from]} → {PEG_LABELS[moveInfo.to]}
          </span>
        </div>
      )}

      {/* 三根柱子 — 底座在下，柱子从底部向上延伸 */}
      <div className="pegs-container" style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
        gap: 50, contain: 'layout style',
      }}>
        {['A', 'B', 'C'].map((pegId) => {
          const pegDisks = pegs[pegId] || [];
          const pegHeight = disks * 28 + 30;

          return (
            <div key={pegId} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              {/* 标签 */}
              <div style={{ fontSize: 12, fontWeight: 600, color: '#7880a0' }}>
                {PEG_LABELS[pegId]}
              </div>

              {/* 柱子和盘子 — 底座在底部 */}
              <div style={{ position: 'relative', width: 140, height: `${pegHeight}px` }}>
                {/* 底部底座 */}
                <div style={{
                  position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '136px', height: '6px',
                  background: 'rgba(255,255,255,0.12)', borderRadius: '3px',
                  zIndex: 10,
                }} />

                {/* 柱子杆 — 从底座向上延伸 */}
                <div style={{
                  position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                  width: '5px', height: `${pegHeight - 6}px`,
                  background: 'rgba(255,255,255,0.08)', borderRadius: '3px 3px 0 0',
                  zIndex: 0,
                }} />

                {/* 盘子从底部向上堆叠（大盘在下） */}
                <div style={{ position: 'absolute', bottom: 6, width: '100%' }}>
                  {pegDisks.map((diskNum, idx) => (
                    <div
                      key={`disk-${diskNum}`}
                      className={moveInfo?.disk === diskNum && moveInfo?.to === pegId ? 'disk-moving' : ''}
                      style={{
                        position: 'absolute',
                        bottom: `${idx * 28 + 4}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: `${getDiskWidth(diskNum)}px`,
                        height: '22px',
                        borderRadius: '11px',
                        backgroundColor: getDiskColor(diskNum),
                        zIndex: idx + 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      }}
                    >
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {diskNum}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 盘子计数 */}
              <div style={{ fontSize: 10, color: '#505570' }}>
                {pegDisks.length} 个盘子
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

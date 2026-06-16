import { useEffect, useRef } from 'react';

export default function PlaybackControls({
  isRunning, hasSteps, currentStep, totalSteps,
  speed, onSpeedChange, onPlay, onStepForward,
  onStepBackward, onReset, onTick, tickInterval,
}) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(onTick, tickInterval);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, tickInterval, onTick]);

  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const canPrev = hasSteps && currentStep > 0;
  const canNext = hasSteps && currentStep < totalSteps - 1;

  return (
    <div className="playback-bar">
      <button className="playback-btn" onClick={onReset} disabled={!hasSteps} title="重置">⏮</button>
      <button className="playback-btn" onClick={onStepBackward} disabled={!canPrev} title="上一步">◀</button>
      <button className="playback-btn btn-play-main" onClick={onPlay} disabled={!canNext} title={isRunning ? '暂停' : '播放'}>
        {isRunning ? '⏸' : '▶'}
      </button>
      <button className="playback-btn" onClick={onStepForward} disabled={!canNext} title="下一步">▶</button>
      <button className="playback-btn" onClick={() => { /* 跳末尾会在外部处理 */ }} disabled={!canNext} title="跳到末尾">⏭</button>

      <div className="playback-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-label">{hasSteps ? `${currentStep + 1} / ${totalSteps}` : '-- / --'}</span>
      </div>

      <div className="speed-group">
        {[1, 2, 3].map((s) => (
          <button key={s} className={`speed-btn ${speed === s ? 'active' : ''}`} onClick={() => onSpeedChange(s)}>
            {s === 1 ? '慢' : s === 2 ? '中' : '快'}
          </button>
        ))}
      </div>
    </div>
  );
}

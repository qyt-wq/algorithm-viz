import { useEffect, useRef } from 'react';

export default function PlaybackControls({
  isRunning, hasSteps, currentStep, totalSteps,
  speed, onSpeedChange, onPlay, onStepForward,
  onStepBackward, onReset, onSeek, onTick, tickInterval,
}) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(onTick, tickInterval);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, tickInterval, onTick]);

  const canPrev = hasSteps && currentStep > 0;
  const canNext = hasSteps && currentStep < totalSteps - 1;

  return (
    <div className="playback-bar">
      <button className="playback-btn" onClick={onReset} disabled={!hasSteps} title="重置 (R)">⏮</button>
      <button className="playback-btn" onClick={onStepBackward} disabled={!canPrev} title="上一步 (←)">◀</button>
      <button className="playback-btn btn-play-main" onClick={onPlay} disabled={!canNext && !isRunning} title="播放/暂停 (空格)">
        {isRunning ? '⏸' : '▶'}
      </button>
      <button className="playback-btn" onClick={onStepForward} disabled={!canNext} title="下一步 (→)">▶</button>
      <button
        className="playback-btn"
        onClick={() => {
          if (hasSteps) onSeek?.(totalSteps - 1);
        }}
        disabled={!canNext}
        title="跳到末尾"
      >
        ⏭
      </button>

      <div className="playback-progress">
        <input
          type="range"
          className="progress-slider"
          min={0}
          max={totalSteps > 0 ? totalSteps - 1 : 0}
          value={currentStep}
          onChange={(e) => onSeek?.(Number(e.target.value))}
          disabled={!hasSteps}
          title="拖动跳转到任意步骤"
        />
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


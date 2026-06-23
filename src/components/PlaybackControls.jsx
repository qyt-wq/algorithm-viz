import { useEffect, useRef } from 'react';

export default function PlaybackControls({
  isRunning, hasSteps, currentStep, totalSteps,
  speed, onSpeedChange, onPlay, onStepForward,
  onStepBackward, onReset, onSeek, onTick, tickInterval,
  compact = false,
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
  const atEnd = hasSteps && !canNext && !isRunning;

  const handlePlay = () => {
    if (atEnd) {
      // 最后一帧 → 从头重新播放
      onReset?.();
      // 使用 requestAnimationFrame 等 reset 状态落定后再切播放
      requestAnimationFrame(() => onPlay?.());
    } else {
      onPlay?.();
    }
  };

  return (
    <div className={`playback-bar${compact ? ' playback-compact' : ''}`}>
      <button className="playback-btn" onClick={onReset} disabled={!hasSteps} title="重置 (R)">⏮</button>
      <button className="playback-btn" onClick={onStepBackward} disabled={!canPrev} title="上一步 (←)">◀</button>
      <button className="playback-btn btn-play-main" onClick={handlePlay} disabled={!hasSteps} title={atEnd ? '重新播放 (空格)' : '播放/暂停 (空格)'}>
        {isRunning ? '⏸' : atEnd ? '🔄' : '▶'}
      </button>
      <button className="playback-btn" onClick={onStepForward} disabled={!canNext} title="下一步 (→)">▶</button>
      {!compact && (
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
      )}

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


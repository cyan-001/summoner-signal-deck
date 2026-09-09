'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Hourglass, Trophy } from 'lucide-react';

type SoundKey = 'question' | 'victory' | 'hourglass' | 'heartsteel';

const keys: Array<{
  id: SoundKey;
  shortcut: string;
  label: string;
  hint: string;
  tone: string;
  audioSrc: string;
  imageSrc: string;
}> = [
  { id: 'question', shortcut: '1', label: '问号标记', hint: '敌人消失', tone: '标记', audioSrc: '/audio/1.Enemy_Missing_ping_SFX.ogg', imageSrc: '/icons/1.Enemy_Missing_ping.png' },
  { id: 'victory', shortcut: '2', label: '胜利', hint: '宣告胜利', tone: '胜利', audioSrc: '/audio/2.Announcer_Female1_114.ogg', imageSrc: '/icons/2.LOL_Icon_Rendered_LARGE.png' },
  { id: 'hourglass', shortcut: '3', label: '时间沙漏', hint: '金身开启', tone: '沙漏', audioSrc: "/audio/3.Zhonya's_Hourglass_active_SFX.ogg", imageSrc: "/icons/3.Zhonya's_Hourglass_item_HD.png" },
  { id: 'heartsteel', shortcut: '4', label: '心之钢', hint: '触发叠加', tone: '心钢', audioSrc: '/audio/4.Heartsteel_trigger_SFX.ogg', imageSrc: '/icons/4.Heartsteel_item_HD.png' },
];

function KeyIcon({ id, imageSrc, useGameIcons }: { id: SoundKey; imageSrc: string; useGameIcons: boolean }) {
  if (useGameIcons) return <img className="game-icon" src={imageSrc} alt="" />;
  if (id === 'question') return <span className="question-mark">?</span>;
  if (id === 'victory') return <Trophy strokeWidth={1.45} />;
  if (id === 'hourglass') return <Hourglass strokeWidth={1.45} />;
  return (
    <span className="heartsteel-icon">
      <Heart strokeWidth={1.55} />
      <i aria-hidden="true" />
    </span>
  );
}

export default function Home() {
  const audioElements = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({});
  const [active, setActive] = useState<SoundKey | null>(null);
  const [charged, setCharged] = useState<SoundKey | null>(null);
  const [lastPlayed, setLastPlayed] = useState<SoundKey | null>(null);
  const [showCredits, setShowCredits] = useState(false);
  const [useGameIcons, setUseGameIcons] = useState(false);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chargeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback((id: SoundKey) => {
    const audio = audioElements.current[id];
    if (audio) {
      audio.currentTime = 0;
      void audio.play();
    }
    setActive(id);
    setCharged(id);
    setLastPlayed(id);
    if (releaseTimer.current) clearTimeout(releaseTimer.current);
    if (chargeTimer.current) clearTimeout(chargeTimer.current);
    releaseTimer.current = setTimeout(() => setActive(null), 180);
    chargeTimer.current = setTimeout(() => setCharged(null), 760);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const item = keys.find(({ shortcut }) => shortcut === event.key);
      if (item) trigger(item.id);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      if (chargeTimer.current) clearTimeout(chargeTimer.current);
    };
  }, [trigger]);

  const activeLabel = keys.find(({ id }) => id === lastPlayed)?.label;

  return (
    <main className="soundboard-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="corner-mark corner-mark-left" aria-hidden="true">01—04</div>
      <div className="corner-mark corner-mark-right" aria-hidden="true">HEX // AUDIO</div>

      <section className="soundboard" aria-labelledby="page-title">
        <header className="soundboard-header">
          <p className="eyebrow"><span /> SUMMONER SIGNAL DECK <span /></p>
          <h1 id="page-title">峡谷声纹</h1>
          <p className="instruction">点击键帽或按下数字键 <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd></p>
        </header>

        <div className="keyboard-frame">
          <div className="keyboard-topline" aria-hidden="true">
            <span>CHANNELS ARMED</span>
            <span className="status-dot" />
          </div>
          <div className="key-grid">
            {keys.map((item) => (
              <div key={item.id}>
                <button
                  type="button"
                  className={`sound-key sound-key-${item.id}${active === item.id ? ' is-active' : ''}${charged === item.id ? ' is-charged' : ''}`}
                  aria-label={`${item.label}，快捷键 ${item.shortcut}`}
                  onClick={() => trigger(item.id)}
                >
                  <span className="key-rim" aria-hidden="true" />
                  <span className="key-face">
                    <span className="key-number">0{item.shortcut}</span>
                    <span className="key-icon" aria-hidden="true">
                      <KeyIcon id={item.id} imageSrc={item.imageSrc} useGameIcons={useGameIcons} />
                    </span>
                    <span className="key-copy">
                      <strong>{item.label}</strong>
                      <small>{item.hint}</small>
                    </span>
                    <span className="key-corner" aria-hidden="true">{item.tone}</span>
                  </span>
                </button>
                <audio
                  ref={(element) => {
                    if (element) audioElements.current[item.id] = element;
                  }}
                  src={item.audioSrc}
                  preload="auto"
                />
              </div>
            ))}
          </div>
          <div className="keyboard-status" aria-live="polite">
            <span className={lastPlayed ? 'status-light is-on' : 'status-light'} />
            <span>{activeLabel ? `已触发 // ${activeLabel}` : '待命 // 选择一个声纹'}</span>
            <span className="status-code">SR—04</span>
          </div>
        </div>
      </section>

      <footer className="developer-info">
        <button
          type="button"
          className="developer-toggle"
          aria-expanded={showCredits}
          onClick={() => setShowCredits((value) => !value)}
        >
          <span>DEVELOPER INFO</span>
          <span className="developer-cross" aria-hidden="true">{showCredits ? '−' : '+'}</span>
        </button>
        <div className={`developer-reveal${showCredits ? ' is-open' : ''}`} aria-hidden={!showCredits}>
          <span>DESIGNED &amp; BUILT BY</span>
          <strong>万能神药白开水R</strong>
          <button
            type="button"
            className={`icon-mode-switch${useGameIcons ? ' is-on' : ''}`}
            role="switch"
            aria-checked={useGameIcons}
            onClick={() => setUseGameIcons((value) => !value)}
          >
            <span>原版图标</span>
            <i className="switch-track" aria-hidden="true"><b /></i>
          </button>
        </div>
      </footer>
    </main>
  );
}

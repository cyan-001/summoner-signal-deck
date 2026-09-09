(() => {
  const keys = [...document.querySelectorAll('.sound-key')];
  const statusLight = document.querySelector('.status-light');
  const statusText = document.querySelector('.status-text');
  const developerToggle = document.querySelector('.developer-toggle');
  const developerCross = document.querySelector('.developer-cross');
  const developerReveal = document.querySelector('.developer-reveal');
  const iconModeSwitch = document.querySelector('.icon-mode-switch');
  let releaseTimer;
  let chargeTimer;

  function trigger(button) {
    const audio = button.parentElement.querySelector('audio');
    audio.currentTime = 0;
    audio.play().catch(() => {});

    keys.forEach((key) => key.classList.remove('is-active', 'is-charged'));
    button.classList.add('is-active', 'is-charged');
    statusLight.classList.add('is-on');
    statusText.textContent = `已触发 // ${button.dataset.label}`;

    clearTimeout(releaseTimer);
    clearTimeout(chargeTimer);
    releaseTimer = setTimeout(() => button.classList.remove('is-active'), 180);
    chargeTimer = setTimeout(() => button.classList.remove('is-charged'), 760);
  }

  keys.forEach((button) => button.addEventListener('click', () => trigger(button)));

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const button = keys.find((key) => key.dataset.key === event.key);
    if (button) trigger(button);
  });

  developerToggle.addEventListener('click', () => {
    const open = !developerReveal.classList.contains('is-open');
    developerReveal.classList.toggle('is-open', open);
    developerToggle.setAttribute('aria-expanded', String(open));
    developerReveal.setAttribute('aria-hidden', String(!open));
    developerCross.textContent = open ? '−' : '+';
  });

  iconModeSwitch.addEventListener('click', () => {
    const gameIcons = !iconModeSwitch.classList.contains('is-on');
    iconModeSwitch.classList.toggle('is-on', gameIcons);
    iconModeSwitch.setAttribute('aria-checked', String(gameIcons));
    document.body.classList.toggle('use-game-icons', gameIcons);
  });
})();

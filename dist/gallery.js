(() => {
  const links = [...document.querySelectorAll('[data-portrait]')];
  const viewer = document.querySelector('#portrait-viewer');
  if (!viewer || !links.length || typeof viewer.showModal !== 'function') return;

  const photo = viewer.querySelector('.viewer-image');
  const closeButton = viewer.querySelector('.viewer-close');
  const fullscreenButton = viewer.querySelector('.viewer-fullscreen');
  const stage = viewer.querySelector('.viewer-stage');
  const picture = viewer.querySelector('.viewer-picture');
  const error = viewer.querySelector('.viewer-error');
  let index = 0;
  let opener = null;
  let swipe = null;

  function showPhoto(nextIndex) {
    index = (nextIndex + links.length) % links.length;
    const link = links[index];
    photo.classList.add('loading');
    error.hidden = true;
    photo.alt = link.dataset.name;
    photo.src = link.href;
    viewer.querySelector('.viewer-original').href = link.href;
    viewer.querySelector('#portrait-title').textContent = link.dataset.name;
    viewer.querySelector('#portrait-details').textContent = `De Zwaluw · Ranking ${link.dataset.rank} · ${link.dataset.member}`;
    viewer.querySelector('.viewer-count').textContent = `${String(index + 1).padStart(2, '0')} / ${links.length}`;
    if (photo.complete && photo.naturalWidth) photo.classList.remove('loading');
    // Preload just the adjacent portraits, using the same cache as the gallery.
    for (const offset of [-1, 1]) {
      const adjacent = new Image();
      adjacent.src = links[(index + offset + links.length) % links.length].href;
    }
  }

  photo.addEventListener('load', () => photo.classList.remove('loading'));
  photo.addEventListener('error', () => {
    photo.classList.remove('loading');
    error.hidden = false;
  });

  for (const [photoIndex, link] of links.entries()) {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      showPhoto(photoIndex);
      viewer.showModal();
      document.documentElement.classList.add('portrait-is-open');
      closeButton.focus({ preventScroll: true });
    });
  }

  function closeViewer() {
    if (document.fullscreenElement === viewer && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    viewer.close();
  }
  closeButton.addEventListener('click', closeViewer);
  viewer.addEventListener('cancel', event => {
    event.preventDefault();
    closeViewer();
  });
  viewer.addEventListener('close', () => {
    document.documentElement.classList.remove('portrait-is-open');
    swipe = null;
    opener?.focus({ preventScroll: true });
  });
  viewer.addEventListener('click', event => {
    if (event.target === viewer || event.target === stage) closeViewer();
  });
  viewer.querySelector('.viewer-prev').addEventListener('click', () => showPhoto(index - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => showPhoto(index + 1));
  viewer.addEventListener('keydown', event => {
    const actions = { ArrowLeft: () => showPhoto(index - 1), ArrowRight: () => showPhoto(index + 1), Home: () => showPhoto(0), End: () => showPhoto(links.length - 1) };
    if (actions[event.key]) {
      event.preventDefault();
      actions[event.key]();
    }
  });

  picture.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.pointerType === 'mouse') { swipe = null; return; }
    swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  picture.addEventListener('pointerup', event => {
    if (!swipe || swipe.id !== event.pointerId) return;
    const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(index + (dx < 0 ? 1 : -1));
  });
  picture.addEventListener('pointercancel', () => { swipe = null; });

  // The dialog always fills the viewport, including browsers without the Fullscreen API.
  if (document.fullscreenEnabled && viewer.requestFullscreen) {
    fullscreenButton.hidden = false;
    fullscreenButton.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement === viewer) await document.exitFullscreen();
        else await viewer.requestFullscreen();
      } catch {
        fullscreenButton.hidden = true;
      }
    });
    document.addEventListener('fullscreenchange', () => {
      fullscreenButton.textContent = document.fullscreenElement === viewer ? 'Scherm verkleinen' : 'Volledig scherm';
    });
  }
})();

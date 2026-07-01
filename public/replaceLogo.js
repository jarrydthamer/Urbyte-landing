document.addEventListener('DOMContentLoaded', () => {
  try {
    const selectors = ['a.brand', 'a.nav-logo', '.logo-bar', '.logo', 'nav .nav-logo', 'a.logo'];
    const nodes = document.querySelectorAll(selectors.join(','));
    nodes.forEach(el => {
      const text = el.textContent || '';
      if (text.toLowerCase().includes('urbyte')) {
        // build picture element
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.srcset = '/images/urbyte.webp';
        source.type = 'image/webp';
        const img = document.createElement('img');
        img.src = '/images/urbyte.png';
        img.alt = 'Urbyte';
        img.className = 'site-logo';
        picture.appendChild(source);
        picture.appendChild(img);

        // clear existing children and insert picture
        while (el.firstChild) el.removeChild(el.firstChild);
        el.appendChild(picture);
      }
    });
  } catch (e) {
    // fail silently
    console.error('replaceLogo script error', e);
  }
});

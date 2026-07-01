document.addEventListener('DOMContentLoaded', () => {
  try {
    // Inject lightweight site-logo CSS if not present
    if (!document.getElementById('site-logo-style')) {
      const s = document.createElement('style');
      s.id = 'site-logo-style';
      s.textContent = `
.site-logo { height: 36px; width: auto; display: inline-block; vertical-align: middle; background: transparent !important; }
nav .nav-logo img, .nav-logo img { height:36px !important; width:auto !important; }
.footer-logo img { height:26px !important; width:auto !important; }
      `;
      document.head.appendChild(s);
    }

    // Replace textual branding anchors with a picture element if they contain URBYTE text
    const selectors = ['a.brand', 'a.nav-logo', '.logo-bar', '.logo', 'nav .nav-logo', 'a.logo'];
    const nodes = document.querySelectorAll(selectors.join(','));
    nodes.forEach(el => {
      const text = (el.textContent || '').trim();
      if (text && /urbyte/i.test(text)) {
        // build picture element
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.srcset = '/images/urbyte.svg';
        source.type = 'image/svg+xml';
        const img = document.createElement('img');
        img.src = '/images/urbyte.svg';
        img.alt = 'Urbyte';
        img.className = 'site-logo';
        picture.appendChild(source);
        picture.appendChild(img);

        // clear existing children and insert picture
        while (el.firstChild) el.removeChild(el.firstChild);
        el.appendChild(picture);
      }
    });

    // Replace existing raster logo images (hosted files) with the transparent svg
    document.querySelectorAll('.nav-logo img, .brand img, .footer-logo img').forEach(img => {
      try {
        // Only replace if it's likely the site's old logo (heuristic: filename or small size)
        const src = img.getAttribute('src') || '';
        if (src && (src.includes('base44') || src.toLowerCase().includes('img_') || src.toLowerCase().includes('logo'))) {
          img.src = '/images/urbyte.svg';
          img.srcset = '';
          img.classList.add('site-logo');
          img.style.background = 'transparent';
          img.style.objectFit = 'contain';
        }
      } catch(e){}
    });
  } catch (e) {
    // fail silently
    console.error('replaceLogo script error', e);
  }
});

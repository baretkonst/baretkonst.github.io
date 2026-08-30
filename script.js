// ==========================================
// 1. SPRÅKHANTERING (Mindre stubbar)
// ==========================================
const languageBtnSv = document.getElementById('language-btn-sv');
const languageBtnEn = document.getElementById('language-btn-en');

if (languageBtnSv) {
    languageBtnSv.addEventListener('click', function() {
        console.log('Byt till svenska');
    });
}

if (languageBtnEn) {
    languageBtnEn.addEventListener('click', function() {
        console.log('Byt till engelska');
    });
}

// ==========================================
// 2. SOFT SCROLL FÖR INTERNA LÄNKAR (#)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = link.getAttribute('href').substring(1);
            if (!targetId) return; // Hoppa över om länken bara är "#"

            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                event.preventDefault();
                const rect = targetElement.getBoundingClientRect();
                const targetElementTop = rect.top + window.scrollY;
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const extraScroll = -45;

                window.scrollTo({
                    top: targetElementTop - headerHeight + extraScroll,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 3. LIGHTBOX MED FÄRGVARIANTER
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxSidebar = document.getElementById('lightbox-sidebar');
    const closeBtn = document.querySelector('.lightbox-close');

    // Kör endast om lightbox-elementen faktiskt finns på sidan
    if (!lightbox || !lightboxImg || !lightboxSidebar) return;

    // Klick på galleribilder
    document.querySelectorAll('.lightbox-trigger').forEach(img => {
        img.addEventListener('click', () => {
            const currentSrc = img.getAttribute('src');
            const altText = img.getAttribute('alt');
            
            lightboxImg.src = currentSrc;
            lightboxCaption.textContent = altText;
            lightboxSidebar.innerHTML = ''; // Rensa gamla miniatyrer

            // Kolla om det finns varianter i data-variants
            const variantsData = img.getAttribute('data-variants');
            
            if (variantsData) {
                const variants = variantsData.split(',').map(v => v.trim());

                variants.forEach(variantSrc => {
                    const thumb = document.createElement('img');
                    thumb.src = variantSrc;
                    thumb.classList.add('lightbox-thumb');

                    // Markera aktiv miniatyr
                    if (variantSrc === currentSrc) {
                        thumb.classList.add('active');
                    }

                    // Klick på miniatyr ändrar huvudbilden
                    thumb.addEventListener('click', (e) => {
                        e.stopPropagation(); // Förhindra stängning av lightbox
                        lightboxImg.src = variantSrc;
                        
                        document.querySelectorAll('.lightbox-thumb').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    });

                    lightboxSidebar.appendChild(thumb);
                });
            }

            lightbox.style.display = 'block';
        });
    });

    // Stäng lightbox vid klick på kryss eller utanför bilden
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) {
            lightbox.style.display = 'none';
        }
    });
});
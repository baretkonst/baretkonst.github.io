document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");

  // Avbryt om galleri-elementet saknas eller om artworksData inte laddats in
  if (!gallery || typeof artworksData === "undefined") return;

  // 1. Rensa galleriet före uppbyggnad
  gallery.innerHTML = "";

  // 2. Filtrera ut enbart huvudbilder (main: true) för galleri-gridet
  const mainArtworks = artworksData.filter(art => art.main !== false);

  // 3. Generera bilderna i galleriet
  mainArtworks.forEach((art) => {
    const img = document.createElement("img");
    img.src = art.filename;
    img.alt = art.alt;
    img.loading = "lazy";
    img.classList.add("gallery-item");

    // När man klickar på en bild öppnas lightboxen för hela serien
    img.addEventListener("click", () => {
      openLightboxGroup(art.number, art);
    });

    gallery.appendChild(img);
  });

  // 4. Hantera stängning av lightbox
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.querySelector(".lightbox-close");

  if (closeBtn && lightbox) {
    closeBtn.addEventListener("click", () => {
      lightbox.style.display = "none";
    });
  }

  // Stäng lightbox om man klickar utanför innehållet (på bakgrunden)
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = "none";
      }
    });
  }
});

/**
 * Öppnar lightboxen och uppdaterar innehåll samt sidopanel för varianter.
 * @param {string} groupNumber - Tidsstämpeln/serienumret för verket.
 * @param {Object} activeArt - Det specifika konstverksobjektet som ska visas stort.
 */
function openLightboxGroup(groupNumber, activeArt) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const titleEl = document.getElementById("lightbox-title");
  const colorscaleEl = document.getElementById("lightbox-colorscale");
  const commentEl = document.getElementById("lightbox-comment");
  const lightboxSidebar = document.getElementById("lightbox-sidebar");

  if (!lightbox || !lightboxImg) return;

  // 1. Uppdatera den stora bilden
  lightboxImg.src = activeArt.filename;
  lightboxImg.alt = activeArt.alt;

  // 2. Uppdatera titel och färgskala
  if (titleEl) {
    titleEl.textContent = activeArt.title || "";
  }
  if (colorscaleEl) {
    colorscaleEl.textContent = activeArt.colorscale 
      ? `Colorscale: ${activeArt.colorscale}` 
      : "";
  }

  // 3. Hantera kommentar (visa endast om den innehåller text)
  if (commentEl) {
    if (activeArt.comment && activeArt.comment.trim() !== "") {
      commentEl.textContent = activeArt.comment;
      commentEl.style.display = "block";
    } else {
      commentEl.textContent = "";
      commentEl.style.display = "none";
    }
  }

  // 4. Hämta alla färgvarianter som tillhör samma bildserie/nummer
  const variants = artworksData.filter(art => art.number === groupNumber);

  // 5. Bygg upp sidopanelen med miniatyrer för alla varianter
  if (lightboxSidebar) {
    lightboxSidebar.innerHTML = "";

    // Om det finns fler än 1 variant i serien visar vi sidopanelen
    if (variants.length > 1) {
      lightboxSidebar.style.display = "flex";

      variants.forEach((variant) => {
        const thumb = document.createElement("img");
        thumb.src = variant.filename;
        thumb.alt = variant.alt;
        thumb.title = variant.colorscale ? `Colorscale: ${variant.colorscale}` : "";
        thumb.classList.add("lightbox-thumb");

        // Markera den aktiva bilden i sidopanelen
        if (variant.filename === activeArt.filename) {
          thumb.classList.add("active");
        }

        // Klick på en miniatyr byter den aktiva bilden i lightboxen
        thumb.addEventListener("click", () => {
          openLightboxGroup(groupNumber, variant);
        });

        lightboxSidebar.appendChild(thumb);
      });
    } else {
      // Dölj sidopanelen om det bara finns en bild i serien
      lightboxSidebar.style.display = "none";
    }
  }

  // Visa lightboxen
  lightbox.style.display = "block";
}

let isPrintInfoActive = false;

document.addEventListener("DOMContentLoaded", function () {
  var gallery = document.getElementById("gallery");

  if (gallery && typeof artworksData !== "undefined") {
    gallery.innerHTML = "";
    
    // Hämta endast huvudbilderna för galleriet
    var mainArtworks = artworksData.filter(function (art) {
      return art.main !== false;
    });

    mainArtworks.forEach(function (art) {
      var img = document.createElement("img");
      img.src = art.filename;
      img.alt = art.alt || "";
      img.loading = "lazy";
      img.classList.add("gallery-item");

      img.addEventListener("click", function () {
        isPrintInfoActive = false;
        openLightboxGroup(art.number, art);
      });

      gallery.appendChild(img);
    });
  }

  // Stäng lightbox vid klick på bakgrund eller kryss
  var lightbox = document.getElementById("lightbox");
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("lightbox-close") || e.target === lightbox) {
      if (lightbox) lightbox.style.display = "none";
    }
  });
});

// Hjälpfunktion för att formattera färgskalan ("Rev" -> "(Omvänd)")
function formatColorscale(scaleStr) {
  if (!scaleStr) return "";
  var trimmed = scaleStr.trim();
  // Kollar om strängen slutar på "Rev" (oavsett stora/små bokstäver)
  if (/Rev$/i.test(trimmed)) {
    var cleaned = trimmed.replace(/Rev$/i, "").trim();
    return cleaned + " (Omvänd)";
  }
  return trimmed;
}

function openLightboxGroup(groupNumber, activeArt) {
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var titleEl = document.getElementById("lightbox-title");
  var colorscaleEl = document.getElementById("lightbox-colorscale");
  var commentEl = document.getElementById("lightbox-comment");
  
  var printBtn = document.getElementById("lightbox-print-btn");
  var printContainer = document.getElementById("lightbox-print-container");
  var thumbsBox = document.getElementById("lightbox-thumbs-box");

  if (!lightbox || !lightboxImg) return;

  // 1. Sätt bild och texter för den valda varianten
  lightboxImg.src = activeArt.filename;
  lightboxImg.alt = activeArt.alt || "";

  if (titleEl) titleEl.textContent = activeArt.title || "";
  
  if (colorscaleEl) {
    var formattedScale = formatColorscale(activeArt.colorscale);
    colorscaleEl.textContent = formattedScale 
      ? "Färgskala: " + formattedScale 
      : "";
  }

  if (commentEl) {
    if (activeArt.comment && activeArt.comment.trim() !== "") {
      commentEl.textContent = activeArt.comment;
      commentEl.style.display = "block";
    } else {
      commentEl.textContent = "";
      commentEl.style.display = "none";
    }
  }

  // 2. Rendera pris/inforutan baserat på om den är såld eller inte
  function renderPrintInfo() {
    if (!printContainer || !printBtn) return;

    if (isPrintInfoActive) {
      printBtn.classList.add("active");

      // Om bilden är markerad som såld
      if (activeArt.sold === true) {
        printContainer.innerHTML = 
          '<div class="print-info-card">' +
            '<p class="price-highlight"><strong>Såld</strong></p>' +
          '</div>';
      } else {
        // Om den inte är såld (false eller saknas)
        var rawPrice = (activeArt.price !== undefined && activeArt.price !== null)
          ? String(activeArt.price).trim() 
          : "";

        var priceText = rawPrice !== "" ? rawPrice : "Pris på förfrågan";
        
        // Dynamisk rad för år (visas endast om 'year' finns i artworksData)
        var yearHTML = activeArt.year ? '<strong>År:</strong> ' + activeArt.year + '<br>' : '';

        printContainer.innerHTML = 
          '<div class="print-info-card">' +
            '<h4>Tryckinformation</h4>' +
            '<p class="price-highlight"><strong>Pris:</strong> ' + priceText + '</p>' +
            '<p class="specs-text">' +
              yearHTML +
              '<strong>Tryck:</strong> Epson SC-P900<br>' +
              '<strong>Papper:</strong> Fine Art Cotton Textured Natural II (300 g/m²)' +
            '</p>' +
            '<p class="note-text"><small>' +
              'Signeras på baksidan vid förfrågan.<br>' +
              'Levereras oramad.<br>' +
              'Anpassad inramning kan ordnas på förfrågan.' +
            '</small></p>' +
          '</div>';
      }
    } else {
      printBtn.classList.remove("active");
      printContainer.innerHTML = "";
    }
  }

  // 3. Knappklick
  if (printBtn) {
    printBtn.onclick = function (e) {
      e.stopPropagation();
      isPrintInfoActive = !isPrintInfoActive;
      renderPrintInfo();
    };
  }

  renderPrintInfo();

  // 4. Bygg miniatyrer
  var variants = artworksData.filter(function (art) {
    return art.number === groupNumber;
  });

  if (thumbsBox) {
    thumbsBox.innerHTML = "";

    if (variants.length > 1) {
      thumbsBox.style.display = "flex";

      variants.forEach(function (variant) {
        var thumb = document.createElement("img");
        thumb.src = variant.filename;
        thumb.alt = variant.alt || "";
        
        var thumbScale = formatColorscale(variant.colorscale);
        thumb.title = thumbScale ? "Färgskala: " + thumbScale : "";
        thumb.classList.add("lightbox-thumb");

        if (variant.filename === activeArt.filename) {
          thumb.classList.add("active");
        }

        thumb.addEventListener("click", function () {
          openLightboxGroup(groupNumber, variant);
        });

        thumbsBox.appendChild(thumb);
      });
    } else {
      thumbsBox.style.display = "none";
    }
  }

  lightbox.style.display = "flex";
}
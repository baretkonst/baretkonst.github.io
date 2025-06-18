// Hämta referenser till språkknapparna
const languageBtnSv = document.getElementById('language-btn-sv');
const languageBtnEn = document.getElementById('language-btn-en');

// Lägg till event listeners för språkknapparna
languageBtnSv.addEventListener('click', function() {
    // Byt till svenska språket, du kan lägga till logik här för att ändra innehåll
    console.log('Byt till svenska');
    // Här kan du till exempel uppdatera textinnehåll, länkar eller dylikt
});

languageBtnEn.addEventListener('click', function() {
    // Byt till engelska språket, du kan lägga till logik här för att ändra innehåll
    console.log('Byt till engelska');
    // Här kan du till exempel uppdatera textinnehåll, länkar eller dylikt
});


//function changeImage(imageSrc) {
//    document.getElementById("mainImage").src = imageSrc;
//}

function changeImage(imageName, imageSrc) {
    // Hitta bilden med det angivna namnet
    var image = document.querySelector(`img[id='${imageName}']`);
    
    if (image) {
        // Om bilden finns, ändra dess src
        image.src = imageSrc;
    } else {
        //console.log("Bild med namn " + imageName + " hittades inte.");
    }
}





window.addEventListener('DOMContentLoaded', function() {
    // Hämta alla bilder med class="images_table"
    const images = document.querySelectorAll('.images_table');
    
    // Kontrollera om bilderna finns
    if (images.length === 0) {
        console.log('Inga bilder med class "images_table" hittades!');
        return;
    }
    
    // Referens till tabellen för att lägga till miniatyrbilder
    const thumbnailTable = document.getElementById('thumbnailTable');
    
    // Skapa en rad för tabellen
    let row;

    // För varje bild på sidan, skapa en miniatyrbild och en länk
    images.forEach((image, index) => {
        // Skapa en ny rad för tabellen var tredje bild
        if (index % 3 === 0) {
            // Skapa en ny rad för varje uppsättning av 3 bilder
            row = document.createElement('tr');
            thumbnailTable.appendChild(row);
        }

        // Skapa en cell i tabellen
        var cell = document.createElement('td');
        
        // Skapa länk till den stora bilden (refererar till bildens id)
        var link = document.createElement('a');
        link.href = `#${image.id}`;  // Länk till den aktuella bildens id
        link.title = `Se Bild ${index + 1}`; // Tooltip på länken
        
        // Skapa miniatyrbilden
        var thumbnail = document.createElement('img');
        thumbnail.src = image.src; // Använd samma bildkälla för miniatyr
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.classList.add('thumbnail');
        
        // Lägg till miniatyrbilden i länken, och länken i cellen
        link.appendChild(thumbnail);
        cell.appendChild(link);
        
        // Lägg till cellen i den aktuella raden
        row.appendChild(cell);
    });

    // Lägg till en event listener för länkarna
    const links = document.querySelectorAll('a[href^="#"]'); // Hämta alla länkar som börjar med #

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Förhindra standardbeteendet för länken
        
            // Hämta elementet som är målet för länken
            const targetId = link.getAttribute('href').substring(1); // Ta bort '#' från href
            const targetElement = document.getElementById(targetId);
        
            if (targetElement) {
                // Använd getBoundingClientRect för att få positionen på elementet
                const rect = targetElement.getBoundingClientRect();
                const targetElementTop = rect.top + window.scrollY;
        
                // Logga elementets position
                console.log("Target element: ", targetElement);
                console.log("Target element top position: " + targetElementTop);
        
                // Hämta höjden på headern
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                console.log("Header height: " + headerHeight);
        
                // Scrolla ner till elementet plus extra antal pixlar (t.ex. 200px längre ner)
                const extraScroll = -45;  // Lägg till detta värde för att scrolla längre ner
                window.scrollTo({
                    top: targetElementTop - headerHeight + extraScroll, // Justera för headerns höjd, extra utrymme och rulla längre ner
                    behavior: 'smooth' // Gör rullningen mjuk
                });
            } else {
                console.log("Target element not found.");
            }
        });
    });
});

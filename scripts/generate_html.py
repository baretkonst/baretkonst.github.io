import os
import re
import json
from collections import defaultdict

# Ange sökvägen till mappen med dina PNG-filer
folder_path = '/home/bearbar/Dropbox/Projects/baretkonst.github.io/works'  # Ersätt med sökvägen till din mapp

# Regexp för att extrahera DATE och COLORMAP från filnamnet
file_pattern = re.compile(r"image_(\d+)_([a-zA-Z0-9_]+)\.png")


# Läs in JSON-filen med namn och beskrivningar
json_file_path = '/home/bearbar/Dropbox/Projects/baretkonst.github.io/works/name_and_description.json'  # Sökvägen till din JSON-fil
with open(json_file_path, 'r', encoding='utf-8') as json_file:
    name_and_description = json.load(json_file)

# Lista för att hålla reda på den genererade HTML-koden
html_output = []

# HTML-kod för början (header och navigation)
html_header = """
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bäret Konst</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header: fixerat längst upp -->
    <header class="site-header">
        <div class="header-content">
            <!-- Logotypen -->
            <img src="images/logo.png" alt="Logo" class="logo">
            <h1>Bäret Konst</h1>
        </div>

        <!-- Språkknappar för svenska och engelska -->
        <div class="language-dropdown" id="language-dropdown">
            <!-- Länk för Svenska -->
            <a href="works.html" id="language-btn-sv" class="dropdown-btn">
                <img src="images/sweden-flag.png" alt="Swedish" class="flag-icon"> Sv
            </a>
            <!-- Länk för Engelska -->
            <a href="works_en.html" id="language-btn-en" class="dropdown-btn">
                <img src="images/uk-flag.png" alt="English" class="flag-icon"> En
            </a>
        </div>
    </header>

    <!-- Resten av din HTML-kod -->
    <nav class="main-nav" id="main-nav">
        <ul>
            <li><a href="index.html">Hem</a></li>
            <li><a href="about.html">Om mig</a></li>
            <li><a href="process.html">Min process</a></li>
            <li><a href="works.html">Alster</a></li>
            <li><a href="contact.html">Kontakt</a></li>
        </ul>
    </nav>

    <!-- Text sektion -->
    <main>
        <section class="content">
            <h1>Alster</h1>
            <p>Nedan återfinns ett urval av de bilder jag har skapat. 
              Till höger om vissa bilder finns samma grundbild men färglagd med annan färgskala. </p>
        </section>

        <!-- Tabell med miniatyrbilder genereras automatiskt av JavaScript -->
        <table class="thumbnail-table" id="thumbnailTable"></table>

        <br><br><hr><br><br><br>

        <section class="works">
"""

# HTML-kod för slutet (footer och script)
html_footer = """
        </section>
        
        <footer class="site-footer">
          <p>&copy Bäret Konst 2025. Alla rättigheter förbehållna. Webbdesign av Bäret Konst.</p>
        </footer>

        <script src="script.js"></script>
    </body>
</html>
"""

# Funktion för att skapa HTML för tabellen
def create_html(date, colormaps, counter, name, description):
    # Grundstruktur för HTML-tabellen
    html = f"""
            <table class="centered-table">
                <tr>
                  <td><img id="work_{counter}" src="works/image_{date}_{colormaps[0]}.png" alt="Alster {counter}" class="images_table">
                  <br>
                    <div class="works-item">
                    <b>{name}</b><br>
                    {description}
                    </div>
                </td>
    """
    
    if len(colormaps) > 1:
        html += f"""
                  <td>
                    <div class="icons">
        """
    
        # Lägg till alla COLORMAPS i tabellen
        for idx, colormap in enumerate(colormaps):
            html += f"""
                        <img src="works/image_{date}_{colormap}.png" alt="Alster {counter} - {idx + 1}" class="icon" onclick="changeImage('work_{counter}','works/image_{date}_{colormap}.png')">
            """
            
        html += f"""
                    </div>
                </td>
        """
    
    # Avsluta tabellen
    html += f"""
                </tr>
              </table>

              <br><br><hr><br><br><br>
    """
    
    return html

# Dictionary för att hålla bilder per DATE
images_by_date = defaultdict(list)

# Hitta alla PNG-filer i mappen
files = os.listdir(folder_path)

# Gå igenom alla filer och gruppera dem efter DATE
for file in files:
    match = file_pattern.match(file)
    print(match)
    if match:
        date = match.group(1)
        colormap = match.group(2)
        images_by_date[date].append(colormap)

# Räknare för att spåra bildindex
counter = 1

# Generera HTML för varje grupp med bilder baserat på DATE
for date, colormaps in images_by_date.items():
    # Hämta NAME och DESCRIPTION från JSON-filen
    if date in name_and_description:
        name = name_and_description[date]["name"]
        description = name_and_description[date]["description_sv"]
    else:
        name = "Namnlös"
        description = "Ingen beskrivning tillgänglig."

    # Skapa HTML för tabellen med alla COLORMAPS
    html_output.append(create_html(date, colormaps, counter, name, description))
    counter += 1

# Skriv ut den genererade HTML-koden
html_result = html_header + "\n".join(html_output) + html_footer

# Spara HTML till en fil
with open("generated_output.html", "w") as file:
    file.write(html_result)

print("HTML-koden har genererats och sparats i 'generated_output.html'.")


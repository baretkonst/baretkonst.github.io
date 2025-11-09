import os
import re
import json
from collections import defaultdict

# Ange sökvägen till mappen med dina bild-filer
script_dir = os.path.dirname(os.path.abspath(__file__))
folder_path = os.path.join(os.path.dirname(script_dir), "works")

# Regexp för att extrahera DATE och COLORMAP från filnamnet
file_pattern = re.compile(r"image_(\d+)_([a-zA-Z0-9_]+)\.(png|jpeg)")

# Läs in JSON-filen med namn och beskrivningar
json_file_path = os.path.join(folder_path, "name_and_description.json")
with open(json_file_path, 'r', encoding='utf-8') as json_file:
    name_and_description = json.load(json_file)

# Lista för att hålla reda på den genererade HTML-koden
html_output = []

# HTML-kod för början (header och navigation)
html_header_swe = """
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

html_header_en = """
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
            <h1>Bäret Art</h1>
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

    <!-- Horisontell meny -->
    <nav class="main-nav" id="main-nav">
        <ul>
          <li><a href="index_en.html">Home</a></li>
          <li><a href="about_en.html">About me</a></li>
          <li><a href="process_en.html">My process</a></li>
          <li><a href="works_en.html">Artwork</a></li>
          <li><a href="contact_en.html">Contact</a></li>
        </ul>
    </nav>

    <!-- Text sektion -->
    <main>
        <section class="content">
            <h1>Artwork</h1>
            <p>Below is a selection of the images I have created.
              To the right of some images is the same basic image but colored with a different color scale. </p>
        </section>


        <!-- Tabell med miniatyrbilder genereras automatiskt av JavaScript -->
        <table class="thumbnail-table" id="thumbnailTable"></table>


        <br><br><hr><br><br><br>


        <section class="works">
"""


# HTML-kod för slutet (footer och script)
html_footer_swe = """
        </section>
    </main>

        <footer class="site-footer">
          <p>&copy Bäret Konst 2025. Alla rättigheter förbehållna. Webbdesign av Bäret Konst.</p>
        </footer>

        <script src="script.js"></script>
    </body>
</html>
"""

html_footer_en = """
        </section>
    </main>

    <footer class="site-footer">
      <p>&copy Bäret Konst 2025. All Rights Reserved. Web Design by Bäret Konst.</p>
  </footer>

    <script src="script.js"></script>
</body>
</html>
"""

# Funktion för att skapa HTML för tabellen
def create_html(date, colormaps, counter, name, description,image_formats):
    # Grundstruktur för HTML-tabellen
    html = f"""
            <table class="centered-table">
                <tr>
                  <td><img id="work_{counter}" src="works/image_{date}_{colormaps[0]}.{image_formats[0]}" alt="Alster {counter}" class="images_table">
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
        for idx, (colormap, image_format) in enumerate(zip(colormaps, image_formats)):
            html += f"""
                        <img src="works/image_{date}_{colormap}.{image_format}" alt="Alster {counter} - {idx + 1}" class="icon" onclick="changeImage('work_{counter}','works/image_{date}_{colormap}.{image_format}')">
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

# Hitta alla bild-filer i mappen
files = os.listdir(folder_path)

# Gå igenom alla filer och gruppera dem efter DATE
for file in files:
    match = file_pattern.match(file)
    print(match)
    if match:
        date = match.group(1)
        colormap = match.group(2)
        file_format = match.group(3)
        images_by_date[date].append({"colormap": colormap,"format": file_format})


# Räknare för att spåra bildindex
counter = 1

# Generera HTML för varje grupp med bilder baserat på DATE
for date, entries in images_by_date.items():
    # Extrahera colormaps och format i samma ordning
    colormaps = [entry["colormap"] for entry in entries]
    file_formats = [entry["format"] for entry in entries]

    if date in name_and_description:
        name = name_and_description[date]["name"]
        description = name_and_description[date]["description_sv"]
    else:
        name = "Namnlös"
        description = "Ingen beskrivning tillgänglig."

    # Skapa HTML för tabellen med alla COLORMAPS
    html_output.append(create_html(date, colormaps, counter, name, description,file_formats))
    counter += 1

# Skriv ut den genererade HTML-koden
html_result_swe = html_header_swe + "\n".join(html_output) + html_footer_swe
html_result_en = html_header_en + "\n".join(html_output) + html_footer_en

# Spara HTML till fil
with open("works_gen.html", "w") as file:
    file.write(html_result_swe)
with open("works_en_gen.html", "w") as file:
    file.write(html_result_en)

print("HTML-koden har genererats.")

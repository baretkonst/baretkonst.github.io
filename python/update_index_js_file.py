import json
import re


def update_artworks_js(primary_file_path, secondary_file_path, output_file_path):
    # regex för att fånga {...}-block i JS-filerna
    object_pattern = re.compile(r"\{[^{}]*\}", re.DOTALL)

    # 1. Läs in den andra filen (källan med ny data) och indexera objekten
    with open(secondary_file_path, "r", encoding="utf-8") as f:
        secondary_content = f.read()

    updates = {}
    for match in object_pattern.finditer(secondary_content):
        raw_obj = match.group(0)
        try:
            data = json.loads(raw_obj)
            number = str(data.get("number"))
            colorscale = data.get("colorscale")

            if number and colorscale:
                # Använd en tuple som unik nyckel för matchning
                key = (number, colorscale)
                updates[key] = raw_obj
        except json.JSONDecodeError:
            # Hoppar över om det inte är giltig JSON
            continue

    # 2. Läs in den första filen och ersätt matchande sektioner
    with open(primary_file_path, "r", encoding="utf-8") as f:
        primary_content = f.read()

    def replace_match(match):
        raw_obj = match.group(0)
        try:
            data = json.loads(raw_obj)
            number = str(data.get("number"))
            colorscale = data.get("colorscale")

            key = (number, colorscale)
            # Om nyckeln finns i uppdateringarna, ersätt stycket
            if key in updates:
                return updates[key]
        except json.JSONDecodeError:
            pass

        # Returnera originalstycket om ingen matchning hittades
        return raw_obj

    # Ersätt alla matchande objekt i den primära filen
    updated_content = object_pattern.sub(replace_match, primary_content)

    # 3. Spara resultatet
    with open(output_file_path, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"Uppdateringen är klar! Resultatet sparades i: {output_file_path}")


# --- ANVÄNDNING ---
file1 = "artworks.js"  # Filen som ska uppdateras
file2 = "updates.js"  # Filen som innehåller den nya datan
output = "artworks_updated.js"  # Den nya uppdaterade filen

update_artworks_js(file1, file2, output)

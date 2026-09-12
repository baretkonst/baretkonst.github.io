import os
from PIL import Image

def convert_images_to_webp(directory, quality=85):
    """
    Konverterar alla bildfiler i angiven mapp till WebP-format.
    
    :param directory: Mappen där bilderna ligger
    :param quality: Bildkvalitet för WebP (1-100), 85 ger utmärkt balanserad komprimering
    """
    # Bildformat som ska konverteras
    valid_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif')
    
    # Hämta alla filer i mappen
    files = os.listdir(directory)
    converted_count = 0
    skipped_count = 0

    print(f"Startar konvertering i: {directory}\n" + "-" * 40)

    for file_name in files:
        ext = os.path.splitext(file_name)[1].lower()
        
        # Kontrollera om filen är en bild och inte redan är en .webp
        if ext in valid_extensions:
            file_path = os.path.join(directory, file_name)
            output_path = os.path.splitext(file_path)[0] + '.webp'
            
            # Hoppa över om WebP-filen redan finns
            if os.path.exists(output_path):
                print(f"Hoppar över (finns redan): {os.path.basename(output_path)}")
                skipped_count += 1
                continue
            
            try:
                with Image.open(file_path) as img:
                    # Hantera RGBA/transparens om det är PNG
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGBA")
                    else:
                        img = img.convert("RGB")
                    
                    # Spara som WebP
                    img.save(output_path, 'WEBP', quality=quality, optimize=True)
                    
                    old_size = os.path.getsize(file_path) / 1024
                    new_size = os.path.getsize(output_path) / 1024
                    savings = (1 - (new_size / old_size)) * 100 if old_size > 0 else 0
                    
                    print(f"Konverterad: {file_name} -> {os.path.basename(output_path)} "
                          f"({old_size:.1f} KB -> {new_size:.1f} KB, -{savings:.1f}%)")
                    converted_count += 1
            except Exception as e:
                print(f"Fel vid konvertering av {file_name}: {e}")

    print("-" * 40)
    print(f"Klart! {converted_count} bilder konverterades, {skipped_count} hoppades över.")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    convert_images_to_webp(current_dir, quality=85)

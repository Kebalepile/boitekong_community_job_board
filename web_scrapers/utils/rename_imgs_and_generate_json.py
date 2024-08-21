import os
import json
import uuid
import hashlib

def get_file_hash(filepath):
    """Compute the MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def rename_images_and_create_json(directory="./database/agency_icons"):
    """
    Renames image files in the specified directory to a numerical sequence, deletes duplicates, and creates a JSON file containing the image URLs.

    Args:
        directory (str): The directory where the images are located. Defaults to "./database/agency_icons".

    Returns:
        None
    """
    # List all image files in the directory
    image_files = [f for f in os.listdir(directory) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    # Sort the files to ensure consistent renaming
    image_files.sort()

    # Dictionary to store file hashes and detect duplicates
    seen_hashes = {}
    duplicates = 0

    # Step 1: Temporarily rename all files to avoid conflicts and check for duplicates
    temp_names = {}
    for filename in image_files:
        old_path = os.path.join(directory, filename)
        file_hash = get_file_hash(old_path)

        if file_hash in seen_hashes:
            # If duplicate, delete the file
            os.remove(old_path)
            duplicates += 1
        else:
            seen_hashes[file_hash] = filename
            temp_name = f"{uuid.uuid4()}{os.path.splitext(filename)[1]}"  # Generate a unique temporary name
            temp_path = os.path.join(directory, temp_name)
            os.rename(old_path, temp_path)
            temp_names[temp_name] = filename  # Keep track of original filenames

    # Step 2: Rename to sequential names
    image_urls = []
    for count, temp_name in enumerate(temp_names, start=1):
        file_extension = os.path.splitext(temp_name)[1]
        new_name = f"{count}{file_extension}"
        temp_path = os.path.join(directory, temp_name)
        new_path = os.path.join(directory, new_name)
        
        os.rename(temp_path, new_path)
        image_urls.append(f"/assets/agency_icons/{new_name}")

    # Load the JSON files
    public_sector_path = './database/public/govpage-public-sector.json'
    private_sector_path = './database/public/govpage-private-sector.json'

    with open(public_sector_path, 'r') as public_file:
        govpage_public_data = json.load(public_file)

    with open(private_sector_path, 'r') as private_file:
        govpage_private_data = json.load(private_file)

    # Extract "imgSrc" from the "blogPosts" in both datasets
    for post in govpage_public_data.get('blogPosts', []):
        img_src = post.get('imgSrc')
        if img_src:
            image_urls.append(img_src)

    for post in govpage_private_data.get('blogPosts', []):
        img_src = post.get('imgSrc')
        if img_src:
            image_urls.append(img_src)

    # Create the JSON file, replacing it if it exists
    json_data = {"imageUrls": image_urls}
    json_path = os.path.join(directory, "imageUrls.json")

    with open(json_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

    print(f"Renamed {len(temp_names)} image files, deleted {duplicates} duplicates, and created/replaced imageUrls.json")

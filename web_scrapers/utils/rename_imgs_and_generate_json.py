import os
import json


def rename_images_and_create_json(directory="./database/agency_icons"):
    """
    Renames image files in the specified directory to a numerical sequence and creates a JSON file containing the image URLs.

    Args:
        directory (str): The directory where the images are located. Defaults to "./database/agency_icons".

    Returns:
        None
    """
    # List all image files in the directory
    image_files = [f for f in os.listdir(
        directory) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    # Sort the files to ensure consistent renaming
    image_files.sort()

    # Initialize the list for JSON data
    image_urls = []

    # Rename each image file
    for count, filename in enumerate(image_files, start=1):
        file_extension = os.path.splitext(filename)[1]
        new_name = f"{count}{file_extension}"
        old_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_name)

        os.rename(old_path, new_path)

        # Add the new path to the JSON list
        image_urls.append(f"/assets/agency_icons/{new_name}")

    # Load the JSON files
    with open('./database/public/govpage-public-sector.json', 'r') as public_file:
        govpage_public_data = json.load(public_file)

    with open('./database/public/govpage-private-sector.json', 'r') as private_file:
        govpage_private_data = json.load(private_file)

    # Extract "imgSrc" from the "blogPosts" in both datasets
    for post in govpage_public_data['blogPosts']:
        img_src = post.get('imgSrc')
        if img_src:  # Ensure 'imgSrc' is present
            image_urls.append(img_src)

    for post in govpage_private_data['blogPosts']:
        img_src = post.get('imgSrc')
        if img_src:  # Ensure 'imgSrc' is present
            image_urls.append(img_src)

    # Create the JSON file
    json_data = {"imageUrls": image_urls}
    json_path = os.path.join(directory, "imageUrls.json")

    with open(json_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

    print(f"Renamed {len(image_files)} image files and created imageUrls.json")

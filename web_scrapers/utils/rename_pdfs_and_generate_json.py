import os
import json
import uuid
import hashlib

def hash_file(filepath, chunk_size=8192):
    """
    Generates a hash for a file using SHA-256 to uniquely identify the file contents.

    Args:
        filepath (str): The path to the file to be hashed.
        chunk_size (int): The size of each chunk read from the file. Defaults to 8192.

    Returns:
        str: The hexadecimal hash of the file.
    """
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(chunk_size):
            hasher.update(chunk)
    return hasher.hexdigest()

def rename_pdfs_and_create_json(directory="./database/pdfs"):
    """
    Renames PDF files in the specified directory to a numerical sequence, removes duplicates, and creates a JSON file containing the PDF URLs.

    This function will:
    1. List all PDF files in the specified directory.
    2. Remove duplicate PDF files by comparing their hashes.
    3. Sort the remaining files alphabetically to ensure consistent renaming.
    4. Rename each PDF file to a sequential numeric name (e.g., '1.pdf', '2.pdf') after temporarily renaming them.
    5. Generate a list of the new PDF paths and save them in a JSON file.

    Args:
        directory (str): The directory where the PDF files are located. Defaults to "./database/pdfs".

    Returns:
        None

    Outputs:
        A JSON file named 'pdfUrls.json' will be created in the specified directory, containing the new URLs of the renamed PDF files.
    
    Prints:
        The function prints the number of PDF files that were renamed, duplicates deleted, and confirms the creation of the 'pdfUrls.json' file.
    """
    # List all PDF files in the directory
    pdf_files = [f for f in os.listdir(directory) if f.endswith('.pdf')]

    # Step 1: Remove duplicate files by comparing their hashes
    hash_map = {}
    duplicates = 0
    for filename in pdf_files:
        file_path = os.path.join(directory, filename)
        file_hash = hash_file(file_path)

        if file_hash in hash_map:
            os.remove(file_path)  # Remove the duplicate file
            duplicates += 1
        else:
            hash_map[file_hash] = filename

    # List the remaining files after removing duplicates
    pdf_files = list(hash_map.values())
    pdf_files.sort()  # Sort the files alphabetically to ensure consistent renaming

    # Step 2: Temporarily rename all files to avoid conflicts
    temp_names = {}
    for filename in pdf_files:
        temp_name = f"{uuid.uuid4()}.pdf"  # Generate a unique temporary name
        old_path = os.path.join(directory, filename)
        temp_path = os.path.join(directory, temp_name)
        os.rename(old_path, temp_path)
        temp_names[temp_name] = filename  # Keep track of original filenames

    # Step 3: Rename to sequential names
    pdf_urls = []
    for count, temp_name in enumerate(temp_names, start=1):
        new_name = f"{count}.pdf"
        temp_path = os.path.join(directory, temp_name)
        new_path = os.path.join(directory, new_name)
        
        os.rename(temp_path, new_path)
        pdf_urls.append(f"/assets/pdfs/{new_name}")

    # Create or replace the JSON file
    json_data = {"pdfUrls": pdf_urls}
    json_path = os.path.join(directory, "pdfUrls.json")

    # Writing the new JSON data, replacing the file if it already exists
    with open(json_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

    print(f"Renamed {len(pdf_files)} PDF files, deleted {duplicates} duplicates, and created/replaced pdfUrls.json")


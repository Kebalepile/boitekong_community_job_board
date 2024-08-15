import os
import json

def rename_pdfs_and_create_json(directory="./database/pdfs"):
    """
    Renames PDF files in the specified directory to a numerical sequence and creates a JSON file containing the PDF URLs.

    This function will:
    1. List all PDF files in the specified directory.
    2. Sort the files alphabetically to ensure consistent renaming.
    3. Rename each PDF file to a sequential numeric name (e.g., '1.pdf', '2.pdf').
    4. Generate a list of the new PDF paths and save them in a JSON file.

    Args:
        directory (str): The directory where the PDF files are located. Defaults to "./database/pdfs".

    Returns:
        None

    Outputs:
        A JSON file named 'pdfUrls.json' will be created in the specified directory, containing the new URLs of the renamed PDF files.
    
    Prints:
        The function prints the number of PDF files that were renamed and confirms the creation of the 'pdfUrls.json' file.
    """
    # List all PDF files in the directory
    pdf_files = [f for f in os.listdir(directory) if f.endswith('.pdf')]

    # Sort the files to ensure consistent renaming
    pdf_files.sort()

    # Initialize the list for JSON data
    pdf_urls = []

    # Rename each PDF file
    for count, filename in enumerate(pdf_files, start=1):
        new_name = f"{count}.pdf"
        old_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_name)

        os.rename(old_path, new_path)

        # Add the new path to the JSON list
        pdf_urls.append(f"/assets/pdfs/{new_name}")

    # Create the JSON file
    json_data = {"pdfUrls": pdf_urls}
    json_path = os.path.join(directory, "pdfUrls.json")

    with open(json_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

    print(f"Renamed {len(pdf_files)} PDF files and created pdfUrls.json")

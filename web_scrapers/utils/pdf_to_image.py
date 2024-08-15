import os
import json
import fitz  # PyMuPDF

def create_images_from_pdf_pages(pdf_folder='./database/pdfs',
                                 output_folder='./database/pdf_images',
                                 json_file_path='./database/pdf_images/metadata.json'):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Initialize metadata list
    metadata = []

    # Process each PDF file in the folder
    for pdf_filename in os.listdir(pdf_folder):
        if pdf_filename.lower().endswith('.pdf'):
            pdf_path = os.path.join(pdf_folder, pdf_filename)
            base_name = os.path.splitext(pdf_filename)[0]
            pdf_output_folder = os.path.join(output_folder, base_name)

            # Create a directory for each PDF
            if not os.path.exists(pdf_output_folder):
                os.makedirs(pdf_output_folder)

            # Open the PDF file
            pdf_document = fitz.open(pdf_path)

            # List to store image paths
            image_paths = []

            for i in range(len(pdf_document)):
                # Get a page
                page = pdf_document.load_page(i)

                # Render page to an image
                pix = page.get_pixmap()
                image_path = os.path.join(pdf_output_folder, f'{base_name}_page_{i+1}.png')
                pix.save(image_path)
                image_paths.append(f'./assets/pdf_images/{base_name}/{base_name}_page_{i+1}.png')

            # Add metadata entry
            metadata.append({
                'file': pdf_filename,
                'images': image_paths
            })

    # Save metadata to JSON
    with open(json_file_path, 'w') as json_file:
        json.dump(metadata, json_file, indent=4)


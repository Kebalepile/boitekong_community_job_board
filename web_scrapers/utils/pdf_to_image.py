import os
import json
import fitz  # PyMuPDF

def create_images_from_pdf_pages(pdf_folder='./database/pdfs',
                                 output_folder='./database/pdf_images',
                                 json_file_path='./database/pdf_images/metadata.json',
                                 dpi=300):  # Specify the desired DPI (dots per inch)
    # Create output directory if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    print(f"Output directory: {output_folder}")

    # Initialize metadata list
    metadata = []

    # Process each PDF file in the folder
    for pdf_filename in os.listdir(pdf_folder):
        if pdf_filename.lower().endswith('.pdf'):
            print(f"Processing PDF file: {pdf_filename}")

            pdf_path = os.path.join(pdf_folder, pdf_filename)
            base_name = os.path.splitext(pdf_filename)[0]
            pdf_output_folder = os.path.join(output_folder, base_name)

            # Create a directory for each PDF
            if not os.path.exists(pdf_output_folder):
                os.makedirs(pdf_output_folder)

            print(f"Created directory for PDF images: {pdf_output_folder}")

            # Open the PDF file
            pdf_document = fitz.open(pdf_path)
            print(f"Opened PDF document: {pdf_path}")

            # List to store image paths
            image_paths = []

            for i in range(len(pdf_document)):
                print(f"Rendering page {i + 1} of {len(pdf_document)}")

                # Get a page
                page = pdf_document.load_page(i)

                # Calculate the scaling factor based on the DPI
                zoom = dpi / 72  # 72 DPI is the default resolution in PyMuPDF
                matrix = fitz.Matrix(zoom, zoom)  # Create transformation matrix for zooming

                # Render page to an image with the desired DPI
                pix = page.get_pixmap(matrix=matrix)  # Apply the matrix to the page rendering
                image_path = os.path.join(pdf_output_folder, f'{base_name}_page_{i+1}.png')
                pix.save(image_path)
                image_paths.append(f'./assets/pdf_images/{base_name}/{base_name}_page_{i+1}.png')

                print(f"Saved image: {image_path}")

            # Add metadata entry
            metadata.append({
                'file': pdf_filename,
                'images': image_paths
            })

    # Save metadata to JSON
    with open(json_file_path, 'w') as json_file:
        json.dump(metadata, json_file, indent=4)
    
    print(f"Metadata saved to: {json_file_path}")
    print("Processing completed.")

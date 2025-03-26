# remove_bg.py
from rembg import remove
from PIL import Image
import sys

def main():
    if len(sys.argv) != 3:
        print("Usage: python remove_bg.py <input_path> <output_path>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    # Open the input image
    input_img = Image.open(input_path)

    # Remove the background
    output_img = remove(input_img)

    # Save the output image
    output_img.save(output_path, "PNG")

if __name__ == "__main__":
    main()
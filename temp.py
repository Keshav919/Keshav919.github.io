from PIL import Image, ImageFilter

def apply_gaussian_blur_pil(image_path, radius):
    # Open the image
    original_image = Image.open(image_path)
    print(f"Image loaded from: {image_path}")
    
    # Apply Gaussian Blur
    # The 'radius' parameter controls the intensity of the blur
    blurred_image = original_image.filter(ImageFilter.GaussianBlur(radius))
    print(f"Gaussian blur applied with radius: {radius}")
    
    # Save the blurred image
    save_path = '/Users/keshavrungta/Projects/Keshav919.github.io/images/code.png'
    blurred_image.save(save_path)
    print(f"Blurred image saved to: {save_path}")

# Example usage:
# Replace 'path/to/your/image.jpg' with your actual image file path
apply_gaussian_blur_pil('/Users/keshavrungta/Projects/Keshav919.github.io/images/code_original.png', radius=13)
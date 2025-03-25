import os
import re
import sys
import json
from pathlib import Path

def extract_text_from_file(file_path):
    """Extract text content from a file while removing special characters."""
    try:
        # Read the file content
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # For code files, keep only string literals, comments, and UI text
        if file_path.suffix in ['.ts', '.tsx', '.js', '.jsx']:
            # Extract string literals from code (both single and double quotes)
            strings = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', content)
            strings.extend(re.findall(r"'([^'\\]*(?:\\.[^'\\]*)*)'", content))
            
            # Extract JSX/TSX text content
            jsx_text = re.findall(r'>([^<>]+)<', content)
            
            # Extract comments
            comments = re.findall(r'\/\/(.+?)$', content, re.MULTILINE)
            comments.extend(re.findall(r'\/\*(.+?)\*\/', content, re.DOTALL))
            
            # Combine all extracted text
            return '\n'.join(strings + jsx_text + comments)
        
        # For HTML and components, extract text between tags
        elif file_path.suffix in ['.html', '.svg']:
            text = re.findall(r'>([^<>]+)<', content)
            return '\n'.join(text)
        
        # For CSS and styles, extract comments
        elif file_path.suffix in ['.css', '.scss', '.less']:
            comments = re.findall(r'\/\*(.+?)\*\/', content, re.DOTALL)
            return '\n'.join(comments)
        
        # For other files, return the content as is
        return content
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return ""

def should_ignore_file(file_path):
    """Check if the file should be ignored based on extension or path."""
    ignored_extensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico',
        '.woff', '.woff2', '.ttf', '.eot', '.otf',
        '.mp4', '.mp3', '.wav', '.ogg',
        '.pdf', '.docx', '.xlsx', '.pptx',
        '.zip', '.rar', '.tar', '.gz',
        '.min.js', '.min.css'
    ]
    
    ignored_directories = [
        'node_modules', '.git', '.github', 'dist', 'build',
        'public/images', 'public/assets', 'assets/images',
    ]
    
    # Check if file has an ignored extension
    if any(file_path.name.endswith(ext) for ext in ignored_extensions):
        return True
    
    # Check if file is in an ignored directory
    for ignored_dir in ignored_directories:
        if ignored_dir in file_path.parts:
            return True
    
    return False

def process_directory(directory_path, output_file):
    """Process all files in a directory and its subdirectories."""
    file_count = 0
    text_size = 0
    
    print(f"Processing directory: {directory_path}")
    
    # Open the output file in append mode
    with open(output_file, 'a', encoding='utf-8') as out_file:
        # Walk through all files in the directory
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_path = Path(os.path.join(root, file))
                
                # Skip ignored files
                if should_ignore_file(file_path):
                    continue
                
                # Extract text from the file
                file_text = extract_text_from_file(file_path)
                
                if file_text:
                    # Write file path and content to output file
                    out_file.write(f"\n\n--- {file_path} ---\n\n")
                    out_file.write(file_text)
                    file_count += 1
                    text_size += len(file_text)
    
    return file_count, text_size

def main():
    """Main function to extract text from project files."""
    if len(sys.argv) < 2:
        print("Usage: python extract_text.py <project_directory> [output_file]")
        return
    
    project_directory = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "project_text.txt"
    
    # Create or clear the output file
    with open(output_file, 'w', encoding='utf-8') as out_file:
        out_file.write(f"Text extraction from project: {project_directory}\n")
    
    # Process all files in the project directory
    file_count, text_size = process_directory(project_directory, output_file)
    
    print(f"Extraction complete!")
    print(f"Processed {file_count} files")
    print(f"Extracted {text_size} characters of text")
    print(f"Output saved to {output_file}")

if __name__ == "__main__":
    main()
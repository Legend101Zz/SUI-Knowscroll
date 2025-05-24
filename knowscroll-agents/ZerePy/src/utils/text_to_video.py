import os
import json
import subprocess
import tempfile
from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np
from datetime import datetime
import uuid

class SimpleTextToVideo:
    """
    A lightweight text-to-video solution for M1 Macs with limited compute.
    This creates videos from text by:
    1. Generating a series of text slides with transitions
    2. Adding simple animations and visual elements
    3. Combining them into a video with a simple background
    """
    
    def __init__(self, output_dir="./output/videos"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
        # Attempt to locate a usable font
        self.font_path = self._find_system_font()
    
    def _find_system_font(self):
        """Find a usable system font."""
        possible_font_paths = [
            # macOS fonts
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/SF-Pro-Display-Regular.otf", 
            "/System/Library/Fonts/SFNSText.ttf",
            
            # Linux fonts
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            
            # Windows fonts
            "C:\\Windows\\Fonts\\arial.ttf"
        ]
        
        for path in possible_font_paths:
            if os.path.exists(path):
                return path
                
        # Fallback - will use default PIL font
        return None
    
    def _create_text_slide(self, text, width=720, height=720, 
                          bg_color=(25, 25, 40), text_color=(240, 240, 240)):
        """Create a single text slide as an image."""
        # Create blank image
        img = Image.new('RGB', (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)
        
        # Load font
        try:
            font_size = 36
            title_font_size = 48
            if self.font_path:
                font = ImageFont.truetype(self.font_path, font_size)
                title_font = ImageFont.truetype(self.font_path, title_font_size)
            else:
                font = ImageFont.load_default()
                title_font = ImageFont.load_default()
        except Exception:
            font = ImageFont.load_default()
            title_font = ImageFont.load_default()
            
        # Split text into title and content
        lines = text.split('\n')
        title = lines[0] if lines else "Educational Content"
        content = '\n'.join(lines[1:]) if len(lines) > 1 else ""
        
        # Draw title
        draw.text((width//2, 100), title, font=title_font, fill=text_color, anchor="mm")
        
        # Draw content (simple word wrap)
        y_position = 200
        max_width = width - 100  # Margin on both sides
        
        words = content.replace('\n', ' \n ').split(' ')
        line = ""
        
        for word in words:
            if word == '\n':
                # Draw the current line and move to next line
                draw.text((width//2, y_position), line, font=font, fill=text_color, anchor="mm")
                y_position += int(font_size * 1.5)
                line = ""
                continue
                
            test_line = f"{line} {word}".strip()
            # Check if adding this word would make the line too long
            text_width = draw.textlength(test_line, font=font)
            
            if text_width <= max_width:
                line = test_line
            else:
                # Draw the current line and start a new one with this word
                draw.text((width//2, y_position), line, font=font, fill=text_color, anchor="mm")
                y_position += int(font_size * 1.5)
                line = word
        
        # Draw any remaining text
        if line:
            draw.text((width//2, y_position), line, font=font, fill=text_color, anchor="mm")
            
        return img
    
    def _add_simple_visual_elements(self, img):
        """Add simple visual elements to make the slide more interesting."""
        # Create a copy of the image to modify
        enhanced = img.copy()
        draw = ImageDraw.Draw(enhanced)
        
        width, height = img.size
        
        # Add a simple gradient overlay at the bottom
        for y in range(height-200, height):
            opacity = min(1.0, (y - (height-200)) / 200) * 0.7
            draw.line([(0, y), (width, y)], fill=(0, 0, 0, int(opacity * 255)), width=1)
            
        # Add a decorative border
        border_color = (100, 100, 240, 100)  # Light blue with some transparency
        border_width = 10
        draw.rectangle([(border_width, border_width), 
                       (width-border_width, height-border_width)], 
                       outline=border_color, width=3)
                       
        # Add some decorative elements
        # Draw a small circle in the corner
        draw.ellipse([(width-100, height-100), (width-50, height-50)], 
                    fill=(100, 200, 255, 150))
                    
        return enhanced
    
    def create_video_from_text(self, text, duration=10, filename=None):
        """
        Create a video from text.
        
        Args:
            text: The text to convert to video
            duration: Duration in seconds
            filename: Optional filename, will be generated otherwise
            
        Returns:
            Path to the generated video file
        """
        if filename is None:
            filename = f"video_{uuid.uuid4().hex[:8]}.mp4"
            
        # Create a temporary directory for frames
        with tempfile.TemporaryDirectory() as temp_dir:
            # Create base slide
            slide = self._create_text_slide(text)
            enhanced_slide = self._add_simple_visual_elements(slide)
            
            # Calculate frames
            fps = 30
            total_frames = duration * fps
            
            # Generate frames with simple transitions and animations
            for i in range(total_frames):
                frame = enhanced_slide.copy()
                draw = ImageDraw.Draw(frame)
                
                # Add a progress indicator
                progress = i / total_frames
                indicator_width = int(progress * frame.width * 0.8)
                draw.rectangle([(frame.width*0.1, frame.height-20), 
                               (frame.width*0.1 + indicator_width, frame.height-10)],
                               fill=(200, 200, 255))
                
                # Add a subtle animation (pulsing circle)
                pulse = 0.5 + 0.5 * np.sin(i * 0.1)
                radius = int(20 + 10 * pulse)
                draw.ellipse([(50-radius, 50-radius), (50+radius, 50+radius)], 
                            fill=(200, 200, 255, int(100 * pulse)))
                
                # Save the frame
                frame_path = os.path.join(temp_dir, f"frame_{i:04d}.jpg")
                frame.save(frame_path)
            
            # Combine frames into video using OpenCV
            output_path = os.path.join(self.output_dir, filename)
            self._frames_to_video(temp_dir, output_path, fps)
            
            return output_path
    
    def _frames_to_video(self, frames_dir, output_path, fps):
        """Combine image frames into a video."""
        # Get the first frame to determine dimensions
        frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_")])
        if not frame_files:
            raise ValueError("No frames found to create video")
            
        first_frame = cv2.imread(os.path.join(frames_dir, frame_files[0]))
        height, width, _ = first_frame.shape
        
        # Create video writer
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # or 'avc1' for H.264
        video = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        # Add all frames to the video
        for frame_file in frame_files:
            video.write(cv2.imread(os.path.join(frames_dir, frame_file)))
            
        video.release()
        
        return output_path
    
    def generate_content_video(self, title, script, visuals_desc=None):
        """
        Generate a video for educational content with the given script.
        
        Args:
            title: Title of the content segment
            script: Narration script
            visuals_desc: Description of visuals (will be used for metadata)
            
        Returns:
            Path to the generated video and metadata
        """
        # Format the text
        formatted_text = f"{title}\n\n{script}"
        
        # Determine length based on text (estimate)
        words = script.split()
        word_count = len(words)
        
        # Assume average speaking rate of 150 words per minute
        duration = min(max(word_count / 150 * 60, 10), 60)  # Between 10 and 60 seconds
        
        # Generate the video
        video_filename = f"{title.replace(' ', '_').lower()}.mp4"
        video_path = self.create_video_from_text(formatted_text, duration, video_filename)
        
        # Create metadata
        metadata = {
            "title": title,
            "script": script,
            "visuals_description": visuals_desc or "Simple animated text slides",
            "duration": duration,
            "generated_at": datetime.now().isoformat(),
            "video_path": video_path
        }
        
        # Save metadata alongside video
        metadata_path = os.path.splitext(video_path)[0] + ".json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
            
        return video_path, metadata_path


# Example usage
if __name__ == "__main__":
    generator = SimpleTextToVideo()
    
    # Example content
    title = "Understanding Blockchain Basics"
    script = """
    A blockchain is a distributed digital ledger that records transactions across multiple computers.
    
    Each block contains a timestamp and transaction data, and is linked to the previous block through cryptographic hashes.
    
    This creates an immutable chain of records that cannot be altered without changing all subsequent blocks.
    """
    
    video_path, metadata_path = generator.generate_content_video(title, script)
    print(f"Generated video: {video_path}")
    print(f"With metadata: {metadata_path}")
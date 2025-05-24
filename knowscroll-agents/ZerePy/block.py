#!/usr/bin/env python3
"""
KnowScroll Demo Script - Hackathon Presentation

This script simulates the entire KnowScroll workflow:
1. Proposal approval trigger
2. AI content creation
3. Content voting process
4. Publication of approved content
5. Recommendation generation

For demo purposes only - does not require ZerePy integration.
"""

import os
import json
import time
import random
import uuid
import subprocess
import datetime
import requests
from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np
import shutil

# Create necessary directories
os.makedirs("demo/proposals", exist_ok=True)
os.makedirs("demo/content_drafts", exist_ok=True)
os.makedirs("demo/votes", exist_ok=True)
os.makedirs("demo/published", exist_ok=True)
os.makedirs("demo/recommendations", exist_ok=True)
os.makedirs("demo/videos", exist_ok=True)

# Configuration for the demo
DEMO_CONFIG = {
    "proposal_id": 42,
    "channel_id": 15,
    "ollama_url": "http://localhost:11434/api/generate",
    "ollama_model": "deepseek-r1:1.5b", # or whatever model you have
    "simulation_delay": 1.5,  # seconds between steps for demo pacing
}

# ANSI colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_step(step, message):
    """Print a colored step message with a timestamp"""
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    print(f"{Colors.BOLD}{Colors.BLUE}[{timestamp}] STEP {step}:{Colors.ENDC} {Colors.YELLOW}{message}{Colors.ENDC}")

def print_agent(agent, message):
    """Print a colored agent message"""
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    colors = {
        "ContentCreationAgent": Colors.CYAN,
        "ApprovalAgent": Colors.GREEN,
        "RecommendationAgent": Colors.YELLOW
    }
    color = colors.get(agent, Colors.BLUE)
    print(f"{Colors.BOLD}{color}[{timestamp}] {agent}:{Colors.ENDC} {message}")

def simulate_delay():
    """Add a delay between steps for better demo pacing"""
    time.sleep(DEMO_CONFIG["simulation_delay"])

def get_llm_response(prompt):
    """Get a response from Ollama LLM"""
    try:
        response = requests.post(
            DEMO_CONFIG["ollama_url"],
            json={
                "model": DEMO_CONFIG["ollama_model"],
                "prompt": prompt,
                "stream": False
            }
        )
        if response.status_code == 200:
            return response.json()["response"]
        else:
            print(f"{Colors.RED}Error calling Ollama: {response.status_code}{Colors.ENDC}")
            # Return a fallback response for demo purposes
            return "Fallback response for demo"
    except Exception as e:
        print(f"{Colors.RED}Exception when calling Ollama: {str(e)}{Colors.ENDC}")
        # Return a fallback response for demo purposes
        return """
        {
            "title": "Blockchain Fundamentals",
            "segments": [
                {
                    "segment_title": "What is Blockchain?",
                    "script": "Blockchain is a distributed digital ledger that records transactions across multiple computers. Each block contains a timestamp and transaction data, and is linked to the previous block through cryptographic hashes.",
                    "visuals": "Animation showing linked blocks forming a chain."
                },
                {
                    "segment_title": "How Does Consensus Work?",
                    "script": "Consensus mechanisms ensure all participants agree on the ledger state. Popular methods include Proof of Work and Proof of Stake, where validators lock up tokens as collateral.",
                    "visuals": "Comparison diagram of different consensus methods."
                },
                {
                    "segment_title": "Smart Contracts Explained",
                    "script": "Smart contracts are self-executing programs that run on blockchain networks. They automatically enforce agreements between parties without needing intermediaries.",
                    "visuals": "Flowchart showing contract execution steps."
                }
            ]
        }
        """

class SimpleTextToVideo:
    """A lightweight text-to-video solution for demo purposes"""
    
    def __init__(self, output_dir="demo/videos"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
        # Find a usable system font
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
            try:
                text_width = draw.textlength(test_line, font=font)
            except AttributeError:
                # For older PIL versions
                text_width = font.getsize(test_line)[0]
            
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
        temp_dir = f"{self.output_dir}/temp_{uuid.uuid4().hex[:8]}"
        os.makedirs(temp_dir, exist_ok=True)
        
        try:
            # Create base slide
            slide = self._create_text_slide(text)
            enhanced_slide = self._add_simple_visual_elements(slide)
            
            # Calculate frames
            fps = 30
            total_frames = int(duration * fps)  # Convert to integer here
            
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
            
        finally:
            # Clean up temporary directory
            shutil.rmtree(temp_dir, ignore_errors=True)
    
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
        video_filename = f"{title.replace(' ', '_').lower()}_{uuid.uuid4().hex[:6]}.mp4"
        video_path = self.create_video_from_text(formatted_text, duration, video_filename)
        
        # Create metadata
        metadata = {
            "title": title,
            "script": script,
            "visuals_description": visuals_desc or "Simple animated text slides",
            "duration": duration,
            "generated_at": datetime.datetime.now().isoformat(),
            "video_path": video_path
        }
        
        # Save metadata alongside video
        metadata_path = os.path.splitext(video_path)[0] + ".json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
            
        return video_path, metadata_path

def simulate_proposal_approval():
    """Simulate the approval of a governance proposal"""
    print_step(1, "Governance Proposal Approval Detected")
    
    # Create a sample approved proposal
    proposal = {
        "proposal_id": DEMO_CONFIG["proposal_id"],
        "channel_id": DEMO_CONFIG["channel_id"],
        "title": "Introduction to Blockchain Technology",
        "description": "Create a beginner-friendly introduction to blockchain technology covering the basics, consensus mechanisms, and real-world applications.",
        "approved_at": datetime.datetime.now().isoformat(),
        "approval_votes": 75,  # percentage
        "content_uri": f"ipfs://Qm{uuid.uuid4().hex[:46]}"
    }
    
    # Save the proposal to file
    proposal_path = f"demo/proposals/proposal_{proposal['proposal_id']}.json"
    with open(proposal_path, 'w') as f:
        json.dump(proposal, f, indent=2)
    
    print(f"📋 Proposal #{proposal['proposal_id']} approved: \"{proposal['title']}\"")
    print(f"📝 Description: {proposal['description']}")
    print(f"✅ Approval: {proposal['approval_votes']}% of stakeholders voted in favor")
    
    simulate_delay()
    return proposal

def generate_content(proposal):
    """Simulate the ContentCreationAgent generating content"""
    print_step(2, "ContentCreationAgent Generating Educational Content")
    print_agent("ContentCreationAgent", f"Processing approved proposal #{proposal['proposal_id']}")
    print_agent("ContentCreationAgent", "Analyzing proposal description and generating content plan...")
    
    # Generate a content plan using Ollama
    content_prompt = f"""
    Create a plan for 3 short educational segments about: {proposal['description']}
    For each segment, provide:
    1. A title
    2. A brief script (100-150 words)
    3. Key visual elements
    
    Format your response as valid JSON with this structure:
    {{
        "title": "Overall series title",
        "segments": [
            {{
                "segment_title": "Title for segment 1",
                "script": "Narration script...",
                "visuals": "Description of visuals..."
            }},
            ...
        ]
    }}

    Make sure your JSON is properly formatted with no trailing commas.
    """
    
    # Get content from LLM
    llm_response = get_llm_response(content_prompt)
    
    # Extract the JSON part of the response
    try:
        # Try to find JSON in the response - it might have extra text
        import re
        json_match = re.search(r'({[\s\S]*})', llm_response)
        if json_match:
            llm_response = json_match.group(1)
        
        content_plan = json.loads(llm_response)
    except json.JSONDecodeError:
        print(f"{Colors.RED}Error parsing LLM response as JSON. Using fallback content.{Colors.ENDC}")
        content_plan = {
            "title": "Blockchain Fundamentals",
            "segments": [
                {
                    "segment_title": "What is Blockchain?",
                    "script": "Blockchain is a distributed digital ledger that records transactions across multiple computers. Each block contains a timestamp and transaction data, and is linked to the previous block through cryptographic hashes.",
                    "visuals": "Animation showing linked blocks forming a chain."
                },
                {
                    "segment_title": "How Does Consensus Work?",
                    "script": "Consensus mechanisms ensure all participants agree on the ledger state. Popular methods include Proof of Work and Proof of Stake, where validators lock up tokens as collateral.",
                    "visuals": "Comparison diagram of different consensus methods."
                },
                {
                    "segment_title": "Smart Contracts Explained",
                    "script": "Smart contracts are self-executing programs that run on blockchain networks. They automatically enforce agreements between parties without needing intermediaries.",
                    "visuals": "Flowchart showing contract execution steps."
                }
            ]
        }
    
    # Generate a draft ID
    draft_id = f"draft_{uuid.uuid4().hex[:8]}"
    
    print_agent("ContentCreationAgent", f"Content plan generated: \"{content_plan['title']}\" with {len(content_plan['segments'])} segments")
    
    # Create videos for each segment
    video_generator = SimpleTextToVideo()
    video_paths = []
    
    print_agent("ContentCreationAgent", "Generating videos for each content segment...")
    
    for i, segment in enumerate(content_plan['segments']):
        print_agent("ContentCreationAgent", f"Creating video {i+1}/{len(content_plan['segments'])}: \"{segment['segment_title']}\"")
        simulate_delay()
        
        video_path, metadata_path = video_generator.generate_content_video(
            title=segment['segment_title'],
            script=segment['script'],
            visuals_desc=segment.get('visuals')
        )
        
        video_paths.append({
            'segment_index': i,
            'title': segment['segment_title'],
            'video_path': video_path,
            'metadata_path': metadata_path
        })
    
    # Save draft metadata
    content_draft = {
        'draft_id': draft_id,
        'proposal_id': proposal['proposal_id'],
        'channel_id': proposal['channel_id'],
        'title': content_plan['title'],
        'segments': content_plan['segments'],
        'video_paths': video_paths,
        'created_at': datetime.datetime.now().isoformat(),
        'status': 'DRAFT'
    }
    
    draft_path = f"demo/content_drafts/{draft_id}.json"
    with open(draft_path, 'w') as f:
        json.dump(content_draft, f, indent=2)
    
    print_agent("ContentCreationAgent", f"Content draft {draft_id} created successfully")
    print_agent("ContentCreationAgent", f"Notifying ApprovalAgent about new draft...")
    
    simulate_delay()
    return content_draft

def facilitate_voting(content_draft):
    """Simulate the ApprovalAgent facilitating stakeholder voting"""
    print_step(3, "ApprovalAgent Facilitating Stakeholder Voting")
    print_agent("ApprovalAgent", f"Received notification about content draft {content_draft['draft_id']}")
    print_agent("ApprovalAgent", f"Draft title: \"{content_draft['title']}\"")
    print_agent("ApprovalAgent", f"Creating voting proposal for channel #{content_draft['channel_id']} stakeholders...")
    
    # Create a vote ID
    vote_id = f"vote_{uuid.uuid4().hex[:8]}"
    
    # Set up voting parameters
    voting_period_hours = 48
    voting_end = datetime.datetime.now() + datetime.timedelta(hours=voting_period_hours)
    
    # Create vote
    vote = {
        'vote_id': vote_id,
        'draft_id': content_draft['draft_id'],
        'proposal_id': content_draft['proposal_id'],
        'channel_id': content_draft['channel_id'],
        'title': content_draft['title'],
        'started_at': datetime.datetime.now().isoformat(),
        'ends_at': voting_end.isoformat(),
        'status': 'ACTIVE'
    }
    
    vote_path = f"demo/votes/{vote_id}.json"
    with open(vote_path, 'w') as f:
        json.dump(vote, f, indent=2)
    
    print_agent("ApprovalAgent", f"Voting proposal created with ID {vote_id}")
    print_agent("ApprovalAgent", f"Voting period: {voting_period_hours} hours")
    print_agent("ApprovalAgent", f"Simulating stakeholder voting...")
    
    # Simulate voting
    simulate_delay()
    
    # Generate some random votes (biased towards approval for demo)
    total_shares = 100
    voter_addresses = [f"0x{uuid.uuid4().hex[:40]}" for _ in range(8)]
    votes = []
    
    for_votes = 0
    against_votes = 0
    
    for i, voter in enumerate(voter_addresses):
        # Determine vote weight (shares)
        weight = random.randint(5, 25)
        if i < 6:  # Make 75% of voters approve
            direction = "FOR"
            for_votes += weight
        else:
            direction = "AGAINST"
            against_votes += weight
            
        votes.append({
            'voter': voter,
            'weight': weight,
            'direction': direction,
            'voted_at': datetime.datetime.now().isoformat()
        })
        
        print_agent("ApprovalAgent", f"Received vote from {voter[:8]}...{voter[-6:]}: {weight} shares {direction}")
        simulate_delay()
    
    # Add votes to the vote record
    vote['votes'] = votes
    vote['for_votes'] = for_votes
    vote['against_votes'] = against_votes
    vote['total_votes'] = for_votes + against_votes
    vote['quorum_reached'] = (for_votes + against_votes) / total_shares >= 0.2  # 20% quorum
    
    # Update vote file
    with open(vote_path, 'w') as f:
        json.dump(vote, f, indent=2)
    
    print_agent("ApprovalAgent", f"Voting complete: {for_votes} shares FOR, {against_votes} shares AGAINST")
    print_agent("ApprovalAgent", f"Total participation: {((for_votes + against_votes) / total_shares) * 100:.1f}% of total shares")
    
    simulate_delay()
    return vote

def publish_content(vote, content_draft):
    """Simulate the ApprovalAgent publishing approved content"""
    print_step(4, "ApprovalAgent Publishing Approved Content")
    
    if vote['for_votes'] > vote['against_votes'] and vote['quorum_reached']:
        # Content is approved
        vote['status'] = 'APPROVED'
        print_agent("ApprovalAgent", f"Content draft {content_draft['draft_id']} has been APPROVED by stakeholders")
        
        # Update content draft status
        content_draft['status'] = 'APPROVED'
        
        # Create published content record
        published_id = f"pub_{uuid.uuid4().hex[:8]}"
        published_content = {
            'published_id': published_id,
            'draft_id': content_draft['draft_id'],
            'vote_id': vote['vote_id'],
            'proposal_id': content_draft['proposal_id'],
            'channel_id': content_draft['channel_id'],
            'title': content_draft['title'],
            'segments': content_draft['segments'],
            'video_paths': content_draft['video_paths'],
            'published_at': datetime.datetime.now().isoformat()
        }
        
        # Save published content
        with open(f"demo/published/{published_id}.json", 'w') as f:
            json.dump(published_content, f, indent=2)
        
        print_agent("ApprovalAgent", f"Content published successfully with ID {published_id}")
        print_agent("ApprovalAgent", f"Content is now available for viewing in channel #{content_draft['channel_id']}")
        
    else:
        # Content is rejected
        vote['status'] = 'REJECTED'
        print_agent("ApprovalAgent", f"Content draft {content_draft['draft_id']} has been REJECTED by stakeholders")
        
        # Update content draft status
        content_draft['status'] = 'REJECTED'
    
    # Update vote file
    with open(f"demo/votes/{vote['vote_id']}.json", 'w') as f:
        json.dump(vote, f, indent=2)
    
    # Update content draft file
    with open(f"demo/content_drafts/{content_draft['draft_id']}.json", 'w') as f:
        json.dump(content_draft, f, indent=2)
    
    simulate_delay()
    return published_content if vote['status'] == 'APPROVED' else None

def generate_recommendations(published_content):
    """Simulate the RecommendationAgent generating personalized recommendations"""
    print_step(5, "RecommendationAgent Generating Recommendations")
    
    if not published_content:
        print_agent("RecommendationAgent", "No approved content to process. Skipping recommendation generation.")
        return
    
    print_agent("RecommendationAgent", "Analyzing user interaction patterns...")
    print_agent("RecommendationAgent", f"Processing newly published content: \"{published_content['title']}\"")
    
    # Simulate some user profiles
    user_profiles = [
        {
            'user_id': f"user_{uuid.uuid4().hex[:8]}",
            'address': f"0x{uuid.uuid4().hex[:40]}",
            'interests': ['blockchain', 'cryptocurrency', 'programming'],
            'viewing_history': ['crypto_basics', 'smart_contracts', 'defi_intro']
        },
        {
            'user_id': f"user_{uuid.uuid4().hex[:8]}",
            'address': f"0x{uuid.uuid4().hex[:40]}",
            'interests': ['finance', 'investing', 'economics'],
            'viewing_history': ['defi_intro', 'tokenomics', 'market_analysis']
        },
        {
            'user_id': f"user_{uuid.uuid4().hex[:8]}",
            'address': f"0x{uuid.uuid4().hex[:40]}",
            'interests': ['technology', 'web3', 'gaming'],
            'viewing_history': ['nft_gaming', 'web3_intro', 'metaverse']
        }
    ]
    
    # Generate recommendations for each user
    for user in user_profiles:
        print_agent("RecommendationAgent", f"Generating recommendations for user {user['user_id']}...")
        
        # Determine relevance score for the new content
        relevance_score = 0
        for interest in user['interests']:
            if interest in published_content['title'].lower() or any(interest in segment['segment_title'].lower() for segment in published_content['segments']):
                relevance_score += 0.2
        
        # Add some randomness
        relevance_score = min(1.0, relevance_score + random.uniform(0.1, 0.5))
        
        # Create recommendation
        recommendation = {
            'user_id': user['user_id'],
            'content_ids': [published_content['published_id']],
            'relevance_scores': [relevance_score],
            'reason': f"Based on your interest in {', '.join(user['interests'][:2])}",
            'generated_at': datetime.datetime.now().isoformat()
        }
        
        # Save recommendation
        with open(f"demo/recommendations/{user['user_id']}.json", 'w') as f:
            json.dump(recommendation, f, indent=2)
        
        print_agent("RecommendationAgent", f"Recommended content to {user['user_id']} with relevance score: {relevance_score:.2f}")
        simulate_delay()
    
    # Calculate engagement metrics for channel
    print_agent("RecommendationAgent", f"Calculating engagement metrics for channel #{published_content['channel_id']}...")
    
    # Simulate engagement metrics
    engagement = {
        'channel_id': published_content['channel_id'],
        'views': random.randint(50, 200),
        'avg_watch_time': random.uniform(30, 120),
        'completion_rate': random.uniform(0.5, 0.9),
        'likes': random.randint(10, 50),
        'shares': random.randint(5, 20),
        'calculated_at': datetime.datetime.now().isoformat()
    }
    
    # Save engagement metrics
    with open(f"demo/recommendations/engagement_{published_content['channel_id']}.json", 'w') as f:
        json.dump(engagement, f, indent=2)
    
    print_agent("RecommendationAgent", f"Channel #{published_content['channel_id']} engagement: {engagement['views']} views, {engagement['likes']} likes")
    
    # Calculate rewards
    reward_amount = (engagement['views'] * 0.0001 + 
                     engagement['likes'] * 0.001 + 
                     engagement['shares'] * 0.002) * engagement['completion_rate']
    
    reward = {
        'channel_id': published_content['channel_id'],
        'reward_amount': round(reward_amount, 4),
        'reward_token': 'S',
        'metrics': engagement,
        'distributed_at': datetime.datetime.now().isoformat()
    }
    
    # Save reward distribution
    with open(f"demo/recommendations/reward_{published_content['channel_id']}.json", 'w') as f:
        json.dump(reward, f, indent=2)
    
    print_agent("RecommendationAgent", f"Distributing reward of {reward['reward_amount']} {reward['reward_token']} tokens to channel #{published_content['channel_id']}")
    
    return True

def main():
    """Main demo workflow"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}======== KnowScroll AI Agent Demo ========{Colors.ENDC}\n")
    print("This demo simulates the entire workflow of the KnowScroll platform:")
    print("1. Governance proposal approval")
    print("2. AI content generation")
    print("3. Stakeholder voting")
    print("4. Content publication")
    print("5. Recommendation generation\n")
    
    input(f"{Colors.BOLD}Press Enter to start the demo...{Colors.ENDC}")
    print("\n")
    
    # Run the workflow
    proposal = simulate_proposal_approval()
    content_draft = generate_content(proposal)
    vote = facilitate_voting(content_draft)
    published_content = publish_content(vote, content_draft)
    generate_recommendations(published_content)
    
    print(f"\n{Colors.BOLD}{Colors.GREEN}======== Complete! ========{Colors.ENDC}\n")
    print(f"All generated files are stored in the {Colors.BOLD}demo/{Colors.ENDC} directory.")
    print(f"Generated videos can be found in {Colors.BOLD}demo/videos/{Colors.ENDC}\n")
    
    if published_content:
        print(f"{Colors.BOLD}Links to the generated videos:{Colors.ENDC}")
        for video_info in published_content['video_paths']:
            print(f"- {video_info['title']}: file://{os.path.abspath(video_info['video_path'])}")
    
    print("\n")

if __name__ == "__main__":
    main()
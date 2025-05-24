import os
import json
import sqlite3
import requests
from datetime import datetime
import hashlib
import time

# Create database connection to store content drafts
def get_content_db():
    db_path = "./data/content_drafts.db"
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    
    # Create table if it doesn't exist
    conn.execute('''
    CREATE TABLE IF NOT EXISTS content_drafts (
        draft_id TEXT PRIMARY KEY,
        proposal_id INTEGER,
        channel_id INTEGER,
        title TEXT,
        segments TEXT,
        created_at TIMESTAMP,
        status TEXT
    )
    ''')
    
    return conn

# Simple text-to-video simulation for demo purposes
def generate_video_placeholder(segment_text, segment_index, draft_id):

    
    output_dir = f"./content/drafts/{draft_id}"
    os.makedirs(output_dir, exist_ok=True)
    
    video_data = {
        "text": segment_text,
        "segment_index": segment_index,
        "simulated_video_length": len(segment_text) // 10,  # Simulate length based on text
        "generated_at": datetime.now().isoformat()
    }
    
    # Save placeholder as JSON
    with open(f"{output_dir}/segment_{segment_index}.json", 'w') as f:
        json.dump(video_data, f, indent=2)
    
    return f"{output_dir}/segment_{segment_index}.json"

# Main function to generate content
def generate_content_draft(agent_context, proposal_data, **kwargs):
    # Extract data from proposal
    proposal_id = proposal_data.get('proposal_id')
    channel_id = proposal_data.get('channel_id')
    description = proposal_data.get('description')
    content_uri = proposal_data.get('content_uri')
    
    # Generate a unique draft ID
    draft_id = hashlib.md5(f"{proposal_id}_{int(time.time())}".encode()).hexdigest()
    
    # Use LLM to generate content plan
    llm = agent_context.get_llm()
    content_prompt = f"""
    You are creating educational micro-content for a learning channel. 
    
    Proposal description: {description}
    
    Create a plan for a series of 5 short educational segments that would teach this topic effectively.
    For each segment:
    1. Provide a title
    2. Provide a brief script (100-150 words) that would be narrated
    3. Describe key visual elements that should appear
    
    Format your response as a JSON with the following structure:
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
    """
    
    # Get content plan from LLM
    try:
        content_plan_response = llm.generate(content_prompt)
        # Extract JSON from response
        content_plan = json.loads(content_plan_response)
    except Exception as e:
        return f"Error generating content plan: {str(e)}"
    
    # Store in database
    conn = get_content_db()
    conn.execute(
        "INSERT INTO content_drafts VALUES (?, ?, ?, ?, ?, ?, ?)",
        (
            draft_id,
            proposal_id,
            channel_id,
            content_plan['title'],
            json.dumps(content_plan['segments']),
            datetime.now().isoformat(),
            "DRAFT"
        )
    )
    conn.commit()
    
    # Generate video placeholders for each segment
    for i, segment in enumerate(content_plan['segments']):
        segment_text = f"{segment['segment_title']}\n\n{segment['script']}"
        video_path = generate_video_placeholder(segment_text, i, draft_id)
        
    # Notify the approval agent
    notification_data = {
        'draft_id': draft_id,
        'proposal_id': proposal_id,
        'channel_id': channel_id,
        'title': content_plan['title'],
        'segments_count': len(content_plan['segments'])
    }
    
    agent_context.queue_task("notify-approval-agent", notification_data)
    
    return f"Generated content draft {draft_id} for proposal #{proposal_id} with {len(content_plan['segments'])} segments."
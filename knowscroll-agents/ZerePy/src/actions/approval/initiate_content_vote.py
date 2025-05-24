import json
import sqlite3
import os
from datetime import datetime, timedelta
from web3 import Web3

# Connect to content votes database
def get_votes_db():
    db_path = "./data/content_votes.db"
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    
    # Create tables if they don't exist
    conn.execute('''
    CREATE TABLE IF NOT EXISTS content_votes (
        vote_id TEXT PRIMARY KEY,
        draft_id TEXT,
        proposal_id INTEGER,
        channel_id INTEGER,
        title TEXT,
        started_at TIMESTAMP,
        ends_at TIMESTAMP,
        status TEXT
    )
    ''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS vote_ballots (
        ballot_id INTEGER PRIMARY KEY AUTOINCREMENT,
        vote_id TEXT,
        voter_address TEXT,
        vote_weight INTEGER,
        vote_direction TEXT,
        voted_at TIMESTAMP,
        FOREIGN KEY (vote_id) REFERENCES content_votes (vote_id)
    )
    ''')
    
    return conn

# Load draft content
def get_content_draft(draft_id):
    conn = sqlite3.connect("./data/content_drafts.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM content_drafts WHERE draft_id = ?", (draft_id,))
    draft = cursor.fetchone()
    conn.close()
    
    if not draft:
        return None
        
    # Convert to dictionary
    draft_data = {
        'draft_id': draft[0],
        'proposal_id': draft[1],
        'channel_id': draft[2],
        'title': draft[3],
        'segments': json.loads(draft[4]),
        'created_at': draft[5],
        'status': draft[6]
    }
    
    return draft_data

# Main function to initiate content vote
def initiate_content_vote(agent_context, content_notification, **kwargs):
    draft_id = content_notification.get('draft_id')
    proposal_id = content_notification.get('proposal_id')
    channel_id = content_notification.get('channel_id')
    
    # Get the content draft
    draft_data = get_content_draft(draft_id)
    if not draft_data:
        return f"Error: Could not find draft with ID {draft_id}"
    
    # Connect to votes database
    conn = get_votes_db()
    cursor = conn.cursor()
    
    # Check if vote already exists for this draft
    cursor.execute("SELECT vote_id FROM content_votes WHERE draft_id = ?", (draft_id,))
    existing_vote = cursor.fetchone()
    
    if existing_vote:
        conn.close()
        return f"Vote already initiated for draft {draft_id} with vote ID {existing_vote[0]}"
    
    # Create new vote
    vote_id = f"vote_{draft_id}"
    vote_duration = 48  # 48 hours voting period
    
    now = datetime.now()
    ends_at = now + timedelta(hours=vote_duration)
    
    cursor.execute(
        "INSERT INTO content_votes VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (
            vote_id,
            draft_id,
            proposal_id,
            channel_id,
            draft_data['title'],
            now.isoformat(),
            ends_at.isoformat(),
            "ACTIVE"
        )
    )
    
    conn.commit()
    conn.close()
    
    # 1. Create an on-chain voting contract
    # 2. Send notifications to stakeholders
    # 3. Generate a preview interface for content
    
    response = f"""
    📣 New content vote initiated!
    
    Vote ID: {vote_id}
    Title: {draft_data['title']}
    Channel: #{channel_id}
    Voting Period: {now.strftime('%Y-%m-%d %H:%M')} to {ends_at.strftime('%Y-%m-%d %H:%M')}
    
    Stakeholders can vote by calling the cast_vote function with:
    - vote_id: {vote_id}
    - direction: 'FOR' or 'AGAINST'
    
    Content preview is available at: /preview/{draft_id}
    """
    
    return response
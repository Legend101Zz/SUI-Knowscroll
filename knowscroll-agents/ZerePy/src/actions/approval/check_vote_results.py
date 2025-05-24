def check_vote_results(agent_context, **kwargs):
    """
    Checks for content votes that have ended and need to be executed
    """
    import sqlite3
    import os
    from datetime import datetime
    
    # Connect to content votes database
    db_path = "./data/content_votes.db"
    if not os.path.exists(db_path):
        return "No votes database found"
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Find votes that have ended but not been executed
    now = datetime.now().isoformat()
    
    cursor.execute("""
        SELECT vote_id, draft_id, channel_id 
        FROM content_votes 
        WHERE ends_at < ? AND status = 'ACTIVE'
    """, (now,))
    
    ended_votes = cursor.fetchall()
    
    if not ended_votes:
        conn.close()
        return "No votes ready for execution"
    
    for vote_id, draft_id, channel_id in ended_votes:
        # Update status to PENDING_EXECUTION
        cursor.execute("""
            UPDATE content_votes
            SET status = 'PENDING_EXECUTION'
            WHERE vote_id = ?
        """, (vote_id,))
        
        # Queue for publication
        agent_context.queue_task("publish-approved-content", {
            "vote_id": vote_id,
            "draft_id": draft_id,
            "channel_id": channel_id
        })
    
    conn.commit()
    conn.close()
    
    return f"Found {len(ended_votes)} votes ready for execution"
def publish_approved_content(agent_context, vote_data, **kwargs):
    """
    Publishes approved content after successful vote
    """
    import sqlite3
    import os
    
    vote_id = vote_data.get('vote_id')
    draft_id = vote_data.get('draft_id')
    
    # Connect to votes database
    votes_db_path = "./data/content_votes.db"
    if not os.path.exists(votes_db_path):
        return f"Error: Votes database not found for vote {vote_id}"
    
    votes_conn = sqlite3.connect(votes_db_path)
    votes_cursor = votes_conn.cursor()
    
    # Check if vote passed
    votes_cursor.execute("""
        SELECT v.vote_id, v.draft_id, v.channel_id, v.title,
               SUM(CASE WHEN b.vote_direction = 'FOR' THEN b.vote_weight ELSE 0 END) as for_votes,
               SUM(CASE WHEN b.vote_direction = 'AGAINST' THEN b.vote_weight ELSE 0 END) as against_votes
        FROM content_votes v
        JOIN vote_ballots b ON v.vote_id = b.vote_id
        WHERE v.vote_id = ?
        GROUP BY v.vote_id
    """, (vote_id,))
    
    vote_result = votes_cursor.fetchone()
    
    if not vote_result:
        votes_conn.close()
        return f"Error: No vote data found for vote {vote_id}"
    
    _, _, channel_id, title, for_votes, against_votes = vote_result
    
    # Determine if content is approved
    is_approved = for_votes > against_votes
    
    # Update vote status
    votes_cursor.execute("""
        UPDATE content_votes
        SET status = ?
        WHERE vote_id = ?
    """, ('APPROVED' if is_approved else 'REJECTED', vote_id))
    votes_conn.commit()
    votes_conn.close()
    
    # Get content draft details
    drafts_db_path = "./data/content_drafts.db"
    if not os.path.exists(drafts_db_path):
        return f"Error: Content drafts database not found for draft {draft_id}"
    
    drafts_conn = sqlite3.connect(drafts_db_path)
    drafts_cursor = drafts_conn.cursor()
    
    drafts_cursor.execute("""
        UPDATE content_drafts
        SET status = ?
        WHERE draft_id = ?
    """, ('APPROVED' if is_approved else 'REJECTED', draft_id))
    
    drafts_conn.commit()
    drafts_conn.close()
    
    if is_approved:

        # 1. Publish content to public channel
        # 2. Update on-chain status
        # 3. Trigger notifications

        os.makedirs("./content/published", exist_ok=True)
        
        # Create a simple marker file
        with open(f"./content/published/{draft_id}.published", 'w') as f:
            f.write(f"Published: {title}\nChannel: {channel_id}\nVote ID: {vote_id}")
            
        return f"Content '{title}' has been approved and published to channel #{channel_id}"
    else:
        return f"Content '{title}' was rejected by channel #{channel_id} stakeholders"
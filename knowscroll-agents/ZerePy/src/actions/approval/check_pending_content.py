def check_pending_content(agent_context, **kwargs):
    """
    Checks for pending content drafts from the Content Creation Agent
    """
    import os
    import json
    
    notifications_dir = "./data/notifications"
    if not os.path.exists(notifications_dir):
        return "No pending content found"
    
    # Look for notification files
    notification_files = [f for f in os.listdir(notifications_dir) if f.startswith("draft_")]
    
    if not notification_files:
        return "No pending content found"
    
    # Process each notification
    for notification_file in notification_files:
        file_path = os.path.join(notifications_dir, notification_file)
        
        with open(file_path, 'r') as f:
            notification_data = json.load(f)
        
        # Queue for initiating content vote
        agent_context.queue_task("initiate-content-vote", notification_data)
        
        # Remove the notification file after processing
        os.remove(file_path)
    
    return f"Found {len(notification_files)} pending content drafts"
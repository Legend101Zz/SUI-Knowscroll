def notify_approval_agent(agent_context, notification_data, **kwargs):
    """
    Notifies the approval agent about a new content draft
    """
    print(f"Notifying approval agent about content draft {notification_data['draft_id']}")
    

    import json
    import os
    
    # Create notifications directory if it doesn't exist
    os.makedirs("./data/notifications", exist_ok=True)
    
    # Write notification to file
    with open(f"./data/notifications/draft_{notification_data['draft_id']}.json", 'w') as f:
        json.dump(notification_data, f, indent=2)
    
    return f"Notification sent for content draft {notification_data['draft_id']}"
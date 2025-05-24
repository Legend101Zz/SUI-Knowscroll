import json
import sqlite3
import os
import numpy as np
from datetime import datetime, timedelta
import pickle

# Connect to user interactions database
def get_user_data_db():
    db_path = "./data/user_interactions.db"
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    
    # Create tables if they don't exist
    conn.execute('''
    CREATE TABLE IF NOT EXISTS user_interactions (
        interaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_address TEXT,
        content_id TEXT,
        channel_id INTEGER,
        interaction_type TEXT,
        duration INTEGER,
        timestamp TIMESTAMP
    )
    ''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS user_recommendations (
        recommendation_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_address TEXT,
        content_ids TEXT,
        channel_ids TEXT,
        scores TEXT,
        generated_at TIMESTAMP
    )
    ''')
    
    return conn

# Get content metadata for recommendations
def get_content_metadata():
    # In a real implementation, this would query a content database
    # For demo purposes, we'll simulate with a small dataset
    
    # Try to load from cache first
    cache_path = "./data/content_metadata_cache.pkl"
    if os.path.exists(cache_path):
        try:
            with open(cache_path, 'rb') as f:
                return pickle.load(f)
        except:
            pass
    
    # Simulate content data
    content_data = {
        f"content_{i}": {
            "id": f"content_{i}",
            "channel_id": i % 10 + 1,
            "title": f"Educational Content #{i}",
            "topics": [
                np.random.choice(["math", "physics", "history", "programming", "biology", "chemistry"]),
                np.random.choice(["beginner", "intermediate", "advanced"])
            ],
            "publication_date": (datetime.now() - timedelta(days=np.random.randint(1, 100))).isoformat(),
            "popularity_score": np.random.random()
        }
        for i in range(1, 101)  # Generate 100 content items
    }
    
    # Cache the result
    os.makedirs(os.path.dirname(cache_path), exist_ok=True)
    with open(cache_path, 'wb') as f:
        pickle.dump(content_data, f)
    
    return content_data

# Get user preferences
def get_user_preferences(user_address, conn):
    cursor = conn.cursor()
    
    # Get recent user interactions
    cursor.execute("""
        SELECT content_id, interaction_type, duration 
        FROM user_interactions 
        WHERE user_address = ? 
        ORDER BY timestamp DESC 
        LIMIT 50
    """, (user_address,))
    
    interactions = cursor.fetchall()
    
    if not interactions:
        return {
            "preferred_topics": [],
            "preferred_channels": [],
            "viewing_times": {}
        }
    
    # Get content metadata
    content_metadata = get_content_metadata()
    
    # Analyze interactions to extract preferences
    topic_counts = {}
    channel_counts = {}
    content_durations = {}
    
    for content_id, interaction_type, duration in interactions:
        # Skip if content not found (might be removed)
        if content_id not in content_metadata:
            continue
            
        content = content_metadata[content_id]
        
        # Count topics
        for topic in content["topics"]:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
            
        # Count channels
        channel_id = content["channel_id"]
        channel_counts[channel_id] = channel_counts.get(channel_id, 0) + 1
        
        # Track content durations
        content_durations[content_id] = duration
    
    # Find preferred topics (top 3)
    preferred_topics = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    
    # Find preferred channels (top 3)
    preferred_channels = sorted(channel_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    
    # Calculate average viewing duration
    avg_duration = sum(content_durations.values()) / len(content_durations) if content_durations else 0
    
    user_preferences = {
        "preferred_topics": [topic for topic, _ in preferred_topics],
        "preferred_channels": [channel for channel, _ in preferred_channels],
        "avg_duration": avg_duration
    }
    
    return user_preferences

# Generate recommendations for a user
def generate_user_recommendations(user_address, user_preferences, content_metadata):
    # Define weights for different factors
    weights = {
        "topic_match": 0.4,
        "channel_match": 0.3,
        "recency": 0.2,
        "popularity": 0.1
    }
    
    # Current time for recency calculation
    now = datetime.now()
    
    # Calculate scores for each content
    content_scores = {}
    
    for content_id, content in content_metadata.items():
        # Initialize score
        score = 0
        
        # Topic match score
        topic_match = sum(1 for topic in content["topics"] if topic in user_preferences["preferred_topics"])
        topic_match_score = topic_match / max(1, len(user_preferences["preferred_topics"]))
        
        # Channel match score
        channel_match = 1 if content["channel_id"] in user_preferences["preferred_channels"] else 0
        
        # Recency score
        content_date = datetime.fromisoformat(content["publication_date"])
        days_old = (now - content_date).days
        recency_score = max(0, 1 - (days_old / 100))  # Normalize to 0-1
        
        # Popularity score (already 0-1)
        popularity_score = content["popularity_score"]
        
        # Calculate weighted score
        score = (
            weights["topic_match"] * topic_match_score +
            weights["channel_match"] * channel_match +
            weights["recency"] * recency_score +
            weights["popularity"] * popularity_score
        )
        
        content_scores[content_id] = score
    
    # Sort by score and get top 10
    sorted_content = sorted(content_scores.items(), key=lambda x: x[1], reverse=True)[:10]
    
    # Extract recommendations
    recommendations = {
        "content_ids": [content_id for content_id, _ in sorted_content],
        "scores": [score for _, score in sorted_content],
        "channel_ids": [content_metadata[content_id]["channel_id"] for content_id, _ in sorted_content]
    }
    
    return recommendations

# Main function to generate recommendations
def generate_recommendations(agent_context, **kwargs):

    # For demo purposes, we'll use a hard-coded list
    users = [
        "0x1234567890123456789012345678901234567890",
        "0x2345678901234567890123456789012345678901",
        "0x3456789012345678901234567890123456789012"
    ]
    
    # Connect to database
    conn = get_user_data_db()
    
    # Get content metadata
    content_metadata = get_content_metadata()
    
    recommendations_count = 0
    
    # Generate recommendations for each user
    for user_address in users:
        # Get user preferences
        user_preferences = get_user_preferences(user_address, conn)
        
        # Generate recommendations
        recommendations = generate_user_recommendations(user_address, user_preferences, content_metadata)
        
        # Store recommendations
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO user_recommendations (user_address, content_ids, channel_ids, scores, generated_at) VALUES (?, ?, ?, ?, ?)",
            (
                user_address,
                json.dumps(recommendations["content_ids"]),
                json.dumps(recommendations["channel_ids"]),
                json.dumps(recommendations["scores"]),
                datetime.now().isoformat()
            )
        )
        
        recommendations_count += 1
    
    conn.commit()
    conn.close()
    
    return f"Successfully generated recommendations for {recommendations_count} users."

# Helper function to get recommendations for a specific user
def get_user_recommendations(user_address):
    conn = get_user_data_db()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT content_ids, channel_ids, scores FROM user_recommendations WHERE user_address = ? ORDER BY generated_at DESC LIMIT 1",
        (user_address,)
    )
    
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        return []
        
    content_ids = json.loads(result[0])
    channel_ids = json.loads(result[1])
    scores = json.loads(result[2])
    
    # Get content metadata for all recommendations
    content_metadata = get_content_metadata()
    
    # Format recommendations
    recommendations = []
    for i, content_id in enumerate(content_ids):
        if content_id in content_metadata:
            recommendations.append({
                "content_id": content_id,
                "title": content_metadata[content_id]["title"],
                "channel_id": channel_ids[i],
                "score": scores[i]
            })
    
    return recommendations
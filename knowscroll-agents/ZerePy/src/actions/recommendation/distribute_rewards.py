import json
import sqlite3
import os
from datetime import datetime, timedelta
from web3 import Web3
import numpy as np

# Connect to engagement metrics database
def get_engagement_db():
    db_path = "./data/engagement_metrics.db"
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    
    # Create tables if they don't exist
    conn.execute('''
    CREATE TABLE IF NOT EXISTS channel_engagement (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id INTEGER,
        views INTEGER,
        avg_watch_time REAL,
        completion_rate REAL,
        likes INTEGER,
        shares INTEGER,
        calculated_at TIMESTAMP
    )
    ''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS reward_distribution (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id INTEGER,
        reward_amount TEXT,
        reward_token TEXT,
        transaction_hash TEXT,
        distributed_at TIMESTAMP
    )
    ''')
    
    return conn

# Calculate engagement metrics for channels
def calculate_engagement_metrics(agent_context, **kwargs):
    # Connect to user interactions database
    user_db = sqlite3.connect("./data/user_interactions.db")
    user_cursor = user_db.cursor()
    
    # Get engagement metrics database
    engagement_db = get_engagement_db()
    
    # Get all channel IDs
    # In a real implementation, you'd query the blockchain or a dedicated database
    # For demo purposes, we'll use a range
    channel_ids = range(1, 11)  # Channels 1-10
    
    now = datetime.now()
    week_ago = now - timedelta(days=7)
    
    metrics_added = 0
    
    for channel_id in channel_ids:
        # Get views for this channel in the last week
        user_cursor.execute("""
            SELECT COUNT(*) FROM user_interactions 
            WHERE channel_id = ? 
            AND interaction_type = 'view'
            AND timestamp > ?
        """, (channel_id, week_ago.isoformat()))
        
        views = user_cursor.fetchone()[0]
        
        # If no views, skip this channel
        if views == 0:
            continue
        
        # Get average watch time
        user_cursor.execute("""
            SELECT AVG(duration) FROM user_interactions 
            WHERE channel_id = ? 
            AND interaction_type = 'view'
            AND timestamp > ?
        """, (channel_id, week_ago.isoformat()))
        
        avg_watch_time = user_cursor.fetchone()[0] or 0
        
        # Get completion rate (simulate with random data)
        completion_rate = np.random.uniform(0.4, 0.95)
        
        # Get likes
        user_cursor.execute("""
            SELECT COUNT(*) FROM user_interactions 
            WHERE channel_id = ? 
            AND interaction_type = 'like'
            AND timestamp > ?
        """, (channel_id, week_ago.isoformat()))
        
        likes = user_cursor.fetchone()[0]
        
        # Get shares
        user_cursor.execute("""
            SELECT COUNT(*) FROM user_interactions 
            WHERE channel_id = ? 
            AND interaction_type = 'share'
            AND timestamp > ?
        """, (channel_id, week_ago.isoformat()))
        
        shares = user_cursor.fetchone()[0]
        
        # Store metrics
        engagement_db.execute("""
            INSERT INTO channel_engagement 
            (channel_id, views, avg_watch_time, completion_rate, likes, shares, calculated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (channel_id, views, avg_watch_time, completion_rate, likes, shares, now.isoformat()))
        
        metrics_added += 1
    
    engagement_db.commit()
    engagement_db.close()
    user_db.close()
    
    return f"Calculated engagement metrics for {metrics_added} channels."

# Distribute rewards based on engagement
def distribute_rewards(agent_context, **kwargs):
    # Connect to engagement database
    engagement_db = get_engagement_db()
    cursor = engagement_db.cursor()
    
    # Get latest engagement metrics for all channels
    cursor.execute("""
        SELECT e1.channel_id, e1.views, e1.avg_watch_time, e1.completion_rate, 
               e1.likes, e1.shares, e1.calculated_at
        FROM channel_engagement e1
        INNER JOIN (
            SELECT channel_id, MAX(calculated_at) as max_date
            FROM channel_engagement
            GROUP BY channel_id
        ) e2
        ON e1.channel_id = e2.channel_id AND e1.calculated_at = e2.max_date
    """)
    
    channels_data = cursor.fetchall()
    
    # Calculate engagement scores
    engagement_scores = []
    
    for channel_data in channels_data:
        channel_id, views, avg_watch_time, completion_rate, likes, shares, _ = channel_data
        
        # Calculate score using a weighted formula
        weights = {
            "views": 0.3,
            "avg_watch_time": 0.25,
            "completion_rate": 0.2,
            "likes": 0.15,
            "shares": 0.1
        }
        
        # Normalize metrics
        normalized_views = min(1.0, views / 100) if views else 0
        normalized_avg_watch_time = min(1.0, avg_watch_time / 300) if avg_watch_time else 0
        
        # Calculate score
        score = (
            weights["views"] * normalized_views +
            weights["avg_watch_time"] * normalized_avg_watch_time +
            weights["completion_rate"] * completion_rate +
            weights["likes"] * min(1.0, likes / 50) +
            weights["shares"] * min(1.0, shares / 20)
        )
        
        engagement_scores.append((channel_id, score))
    
    # Sort by score
    engagement_scores.sort(key=lambda x: x[1], reverse=True)
    
    # Total reward pool (in S tokens)
    total_reward_pool = 100  # 100 S tokens for this period
    
    # Distribute rewards to top 5 channels
    rewards_distributed = 0
    
    # Get Sonic network connection for actual reward distribution
    sonic_rpc = agent_context.get_connection_config("sonic").get("rpc", "https://rpc.soniclabs.com")
    w3 = Web3(Web3.HTTPProvider(sonic_rpc))
    
    # Get RevenueDistribution contract
    revenue_distribution_address = "0x..." # Replace with actual contract address
    
    # In a real implementation, you'd load the contract ABI and interact with it
    # For this demo, we'll simulate the transactions
    
    for i, (channel_id, score) in enumerate(engagement_scores[:5]):
        # Calculate reward amount (weighted by score rank)
        if i == 0:
            # Top channel gets 30% of the pool
            reward_amount = total_reward_pool * 0.3
        elif i == 1:
            # Second channel gets 25% of the pool
            reward_amount = total_reward_pool * 0.25
        elif i == 2:
            # Third channel gets 20% of the pool
            reward_amount = total_reward_pool * 0.2
        elif i == 3:
            # Fourth channel gets 15% of the pool
            reward_amount = total_reward_pool * 0.15
        else:
            # Fifth channel gets 10% of the pool
            reward_amount = total_reward_pool * 0.1
        
        # Simulate blockchain transaction
        tx_hash = f"0x{os.urandom(32).hex()}"
        
        # Record the reward distribution
        cursor.execute("""
            INSERT INTO reward_distribution
            (channel_id, reward_amount, reward_token, transaction_hash, distributed_at)
            VALUES (?, ?, ?, ?, ?)
        """, (channel_id, str(reward_amount), "S", tx_hash, datetime.now().isoformat()))
        
        rewards_distributed += 1
    
    engagement_db.commit()
    engagement_db.close()
    
    return f"Distributed rewards to {rewards_distributed} channels from a pool of {total_reward_pool} S tokens."
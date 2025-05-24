def calculate_engagement_metrics(agent_context, **kwargs):
    """
    Calculates engagement metrics for channels based on user interactions
    """
    # Use the implementation from the reward distributor artifact
    from src.actions.recommendation.distribute_rewards import calculate_engagement_metrics as calculate_metrics
    
    return calculate_metrics(agent_context, **kwargs)
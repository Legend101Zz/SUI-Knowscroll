
from web3 import Web3
import json
import os
import datetime
import sqlite3

# Load ABI for Governance contract
def load_contract_abi(contract_name):
    abi_path = f"./abis/{contract_name}.json"
    with open(abi_path, 'r') as f:
        contract_data = json.load(f)
    return contract_data['abi']

# Connect to local database to track processed proposals
def get_db_connection():
    db_path = "./data/knowscroll.db"
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    
    # Create table if it doesn't exist
    conn.execute('''
    CREATE TABLE IF NOT EXISTS processed_proposals (
        proposal_id INTEGER PRIMARY KEY,
        channel_id INTEGER,
        description TEXT,
        content_uri TEXT,
        processed_at TIMESTAMP
    )
    ''')
    
    return conn

# Main function to check for approved proposals
def check_approved_proposals(agent_context, **kwargs):
    # Get Sonic RPC URL from agent configuration
    rpc_url = agent_context.get_connection_config("sonic").get("rpc", "https://rpc.soniclabs.com")
    governance_address = "0x8a47f1097F85fa4f8ce536d513744Fb4377FBc72" 
    # Connect to blockchain
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    # Load contract
    governance_abi = load_contract_abi("Governance")
    governance_contract = w3.eth.contract(address=governance_address, abi=governance_abi)
    
    # Get database connection
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get recently processed proposals to avoid duplicates
    cursor.execute("SELECT proposal_id FROM processed_proposals")
    processed_ids = [row[0] for row in cursor.fetchall()]
    
    # Check for new executed proposals
    total_proposals = governance_contract.functions.getTotalProposalCount().call()
    
    new_approved_proposals = []
    
    # Check last 10 proposals or all if less than 10
    start_idx = max(1, total_proposals - 10)
    for proposal_id in range(start_idx, total_proposals + 1):
        if proposal_id in processed_ids:
            continue
            
        # Get proposal details
        details = governance_contract.functions.getProposalDetails(proposal_id).call()
        channel_id, description, content_uri, _, _, _, _, _, executed, passed = details
        
        # Check if proposal was executed and passed
        if executed and passed:
            # Record this proposal
            cursor.execute(
                "INSERT INTO processed_proposals VALUES (?, ?, ?, ?, ?)",
                (proposal_id, channel_id, description, content_uri, datetime.datetime.now())
            )
            
            new_approved_proposals.append({
                'proposal_id': proposal_id,
                'channel_id': channel_id,
                'description': description,
                'content_uri': content_uri
            })
    
    # Commit changes to database
    conn.commit()
    conn.close()
    
    # Format response for agent
    if new_approved_proposals:
        response = f"Found {len(new_approved_proposals)} newly approved proposals:\n"
        for proposal in new_approved_proposals:
            response += f"- Proposal #{proposal['proposal_id']} for Channel #{proposal['channel_id']}: {proposal['description']}\n"
            
        # Queue these proposals for content generation
        for proposal in new_approved_proposals:
            agent_context.queue_task("generate-content-draft", proposal)
    else:
        response = "No new approved proposals found."
    
    return response
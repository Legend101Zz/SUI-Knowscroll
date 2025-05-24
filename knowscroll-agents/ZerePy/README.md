# KnowScroll AI Agent Integration Guide

This guide provides detailed instructions on setting up and integrating the ZerePy-powered AI agents with your KnowScroll application. The system consists of three specialized agents that work together to create, approve, and recommend educational content.

## Prerequisites

- Python 3.10 or higher
- Poetry 1.5 or higher
- Ollama installed and running locally
- Deepseek-7B model downloaded in Ollama
- SUI wallet private key

## Installation

1. Clone the ZerePy repository:

```bash
git clone https://github.com/blorm-network/ZerePy.git
cd ZerePy
```

2. Install Poetry if you don't have it:

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

3. Install ZerePy dependencies:

```bash
poetry install --no-root
```

4. Create the necessary directories:

```bash
mkdir -p agents data/content_drafts data/content_votes data/user_interactions data/engagement_metrics abis
```

5. Copy all the agent configurations and action scripts to their respective locations:

```bash
# Create directories for actions
mkdir -p actions/content_creation actions/approval actions/recommendation utils
```

## Configuration

### Configure agents

1. Copy the provided agent configurations to the `agents` directory.
2. Copy action scripts to their respective directories.
3. Update the contract addresses in the scripts to match your deployed contracts.

## Setting Up Ollama

1. Download and install Ollama from https://ollama.ai/download

2. Download the Deepseek-7B model:

```bash
ollama pull deepseek-7b
```

3. Verify installation:

```bash
ollama list
```

You should see `deepseek-7b` in the list of models.

## Running the Agents

Start ZerePy:

```bash
cd ZerePy
poetry shell
poetry run python main.py
```

Configure connections:

```
configure-connection ollama
configure-connection sui
```

Follow the prompts to enter your connection details.

Load and start each agent:

```
load-agent ContentCreationAgent
start

# In another terminal
load-agent ApprovalAgent
start

# In another terminal
load-agent RecommendationAgent
start
```

## Integration with KnowScroll Frontend

### Webhooks Integration

To receive notifications from the agents, set up the following webhook endpoints in your frontend:

1. **Content Creation Webhook**:

   - Endpoint: `/api/webhooks/content-creation`
   - Method: POST
   - Payload: Contains draft content information

2. **Content Approval Webhook**:

   - Endpoint: `/api/webhooks/content-approval`
   - Method: POST
   - Payload: Contains voting results and publication status

3. **Recommendation Webhook**:
   - Endpoint: `/api/webhooks/recommendations`
   - Method: POST
   - Payload: Contains personalized recommendations for users

### Frontend Component Updates

Update your frontend to display AI-generated content:

1. Add a "Draft Content" section to your channel details page
2. Create a voting interface for stakeholders
3. Implement a recommendation feed on the main page

Example React component update:

```jsx
// In src/components/channel/ChannelView.tsx
import { useState, useEffect } from "react";

const DraftContentSection = ({ channelId }) => {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    // Fetch drafts from API
    const fetchDrafts = async () => {
      const response = await fetch(`/api/channels/${channelId}/drafts`);
      const data = await response.json();
      setDrafts(data);
    };

    fetchDrafts();
  }, [channelId]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Content Drafts</h2>
      {drafts.length === 0 ? (
        <p>No drafts available</p>
      ) : (
        <ul className="space-y-4 mt-4">
          {drafts.map((draft) => (
            <li key={draft.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{draft.title}</h3>
              <p className="text-sm text-gray-500">
                Created at: {new Date(draft.createdAt).toLocaleString()}
              </p>
              <div className="mt-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                  onClick={() =>
                    (window.location.href = `/preview/${draft.id}`)
                  }
                >
                  Preview
                </button>
                {draft.status === "PENDING_APPROVAL" && (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => (window.location.href = `/vote/${draft.id}`)}
                  >
                    Vote
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DraftContentSection;
```

## Text-to-Video Implementation

The provided implementation uses a simple approach that works on M1 Macs:

1. It creates a series of text slides with animations
2. Combines them into a video using OpenCV
3. Adds metadata for each video

For a more advanced solution after your demo, consider:

1. Using [Stable Video Diffusion](https://github.com/Stability-AI/StableVideoDiffusion) - there are now some lightweight models that run on consumer hardware
2. Integrating with a cloud-based text-to-video service like Runway, Synthesia, or Pictory
3. Exploring optimized models for Apple Silicon specifically

## Debugging and Troubleshooting

### Common Issues

1. **Connection to Ollama fails**:

   - Make sure Ollama is running: `ollama serve`
   - Verify model is downloaded: `ollama list`
   - Check URL is correct: `http://localhost:11434`

2. **SUI blockchain connection fails**:

   - Verify RPC URL
   - Check private key is correct
   - Ensure you have sufficient $S for transactions

3. **Agent tasks not executing**:
   - Check logs for errors: `tail -f logs/zerepy.log`
   - Verify task weights in agent configuration
   - Make sure required databases are created

### Logging and Monitoring

Enable verbose logging:

```
# In ZerePy CLI
set-log-level DEBUG
```

Log files are stored in the `logs` directory. You can tail them to see real-time activity:

```bash
tail -f logs/zerepy.log
```

## Conclusion

This integration creates a powerful autonomous system for your KnowScroll platform:

1. The **Content Creation Agent** monitors governance proposals and generates educational content
2. The **Approval Agent** facilitates stakeholder voting on content
3. The **Recommendation Agent** analyzes user behavior and distributes rewards

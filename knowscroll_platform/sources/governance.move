module knowscroll_platform::governance {
    use std::string::String;
    use sui::vec_map::{Self, VecMap};
    use sui::event;
    use knowscroll_platform::channel_nft::ChannelShare;

    // ====== Types ======

    public struct GovernanceRegistry has key {
        id: UID,
        min_voting_period: u64,
        proposal_threshold: u64, // In basis points
    }

    public struct Proposal has key, store {
        id: UID,
        channel_id: ID,
        proposer: address,
        title: String,
        description: String,
        content_uri: String,
        start_time: u64,
        end_time: u64,
        for_votes: u64,
        against_votes: u64,
        executed: bool,
        passed: bool,
        voters: VecMap<address, bool>, // voter -> has_voted
    }

    // ====== Events ======

    public struct ProposalCreated has copy, drop {
        proposal_id: ID,
        channel_id: ID,
        proposer: address,
        title: String,
    }

    public struct VoteCast has copy, drop {
        proposal_id: ID,
        voter: address,
        support: bool,
        weight: u64,
    }

    // ====== Functions ======

    fun init(ctx: &mut TxContext) {
        let governance = GovernanceRegistry {
            id: object::new(ctx),
            min_voting_period: 86400000, // 24 hours in milliseconds
            proposal_threshold: 500, // 5%
        };

        transfer::share_object(governance);
    }

    public fun create_proposal(
        _governance: &GovernanceRegistry,
        channel_id: ID,
        title: String,
        description: String,
        content_uri: String,
        voting_period: u64,
        ctx: &mut TxContext
    ): Proposal {
        let proposal_id = object::new(ctx);
        let proposal_object_id = object::uid_to_inner(&proposal_id);

        let proposal = Proposal {
            id: proposal_id,
            channel_id,
            proposer: tx_context::sender(ctx),
            title,
            description,
            content_uri,
            start_time: tx_context::epoch_timestamp_ms(ctx),
            end_time: tx_context::epoch_timestamp_ms(ctx) + voting_period,
            for_votes: 0,
            against_votes: 0,
            executed: false,
            passed: false,
            voters: vec_map::empty(),
        };

        event::emit(ProposalCreated {
            proposal_id: proposal_object_id,
            channel_id,
            proposer: tx_context::sender(ctx),
            title: proposal.title,
        });

        proposal
    }

    public fun cast_vote(
        proposal: &mut Proposal,
        shares: &ChannelShare,
        support: bool,
        ctx: &mut TxContext
    ) {
        let voter = tx_context::sender(ctx);
        let current_time = tx_context::epoch_timestamp_ms(ctx);

        // Check voting is active
        assert!(current_time >= proposal.start_time, 0);
        assert!(current_time <= proposal.end_time, 1);

        // Check voter hasn't voted
        assert!(!vec_map::contains(&proposal.voters, &voter), 2);

        // Check shares belong to this channel
        let (channel_id, amount) = knowscroll_platform::channel_nft::get_shares_info(shares);
        assert!(channel_id == proposal.channel_id, 3);

        // Record vote
        vec_map::insert(&mut proposal.voters, voter, true);

        if (support) {
            proposal.for_votes = proposal.for_votes + amount;
        } else {
            proposal.against_votes = proposal.against_votes + amount;
        };

        event::emit(VoteCast {
            proposal_id: object::uid_to_inner(&proposal.id),
            voter,
            support,
            weight: amount,
        });
    }

    public fun execute_proposal(proposal: &mut Proposal, ctx: &mut TxContext) {
        let current_time = tx_context::epoch_timestamp_ms(ctx);

        assert!(!proposal.executed, 0); // Already executed
        assert!(current_time > proposal.end_time, 1); // Voting not ended

        proposal.executed = true;
        proposal.passed = proposal.for_votes > proposal.against_votes;
    }

    // ====== View Functions ======

    public fun get_proposal_info(proposal: &Proposal): (ID, address, String, String, u64, u64, u64, u64, bool) {
        (
            proposal.channel_id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.start_time,
            proposal.end_time,
            proposal.for_votes,
            proposal.against_votes,
            proposal.executed
        )
    }
}

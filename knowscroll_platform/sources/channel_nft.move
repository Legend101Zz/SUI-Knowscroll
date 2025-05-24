module knowscroll_platform::channel_nft {
    use std::string::{Self, String};
    use sui::url::{Self, Url};
    use sui::vec_map::{Self, VecMap};
    use sui::event;

    // ====== Types ======

    public struct Channel has key, store {
        id: UID,
        name: String,
        description: String,
        category: String,
        creator: address,
        total_shares: u64,
        created_at: u64,
        active: bool,
        image_url: Option<Url>,
    }

    public struct ChannelShare has key, store {
        id: UID,
        channel_id: ID,
        amount: u64,
    }

    public struct ChannelRegistry has key {
        id: UID,
        channels: VecMap<ID, address>, // channel_id -> creator
        total_channels: u64,
    }

    public struct AdminCap has key, store {
        id: UID,
    }

    // ====== Events ======

    public struct ChannelCreated has copy, drop {
        channel_id: ID,
        creator: address,
        name: String,
        total_shares: u64,
    }

    public struct SharesTransferred has copy, drop {
        channel_id: ID,
        from: address,
        to: address,
        amount: u64,
    }

    // ====== Functions ======

    fun init(ctx: &mut TxContext) {
        let registry = ChannelRegistry {
            id: object::new(ctx),
            channels: vec_map::empty(),
            total_channels: 0,
        };

        let admin_cap = AdminCap {
            id: object::new(ctx),
        };

        transfer::share_object(registry);
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    public fun create_channel(
        registry: &mut ChannelRegistry,
        name: String,
        description: String,
        category: String,
        initial_shares: u64,
        image_url: Option<String>,
        ctx: &mut TxContext
    ): Channel {
        let channel_id = object::new(ctx);
        let channel_object_id = object::uid_to_inner(&channel_id);

        let image_url_option = if (option::is_some(&image_url)) {
            option::some(url::new_unsafe(*option::borrow(&image_url)))
        } else {
            option::none()
        };

        let channel = Channel {
            id: channel_id,
            name,
            description,
            category,
            creator: tx_context::sender(ctx),
            total_shares: initial_shares,
            created_at: tx_context::epoch_timestamp_ms(ctx),
            active: true,
            image_url: image_url_option,
        };

        // Create initial shares for creator
        let shares = ChannelShare {
            id: object::new(ctx),
            channel_id: channel_object_id,
            amount: initial_shares,
        };

        // Update registry
        vec_map::insert(&mut registry.channels, channel_object_id, tx_context::sender(ctx));
        registry.total_channels = registry.total_channels + 1;

        // Transfer shares to creator
        transfer::public_transfer(shares, tx_context::sender(ctx));

        // Emit event
        event::emit(ChannelCreated {
            channel_id: channel_object_id,
            creator: tx_context::sender(ctx),
            name: channel.name,
            total_shares: initial_shares,
        });

        channel
    }

    public fun transfer_shares(
        shares: ChannelShare,
        recipient: address,
        ctx: &mut TxContext
    ) {
        event::emit(SharesTransferred {
            channel_id: shares.channel_id,
            from: tx_context::sender(ctx),
            to: recipient,
            amount: shares.amount,
        });

        transfer::public_transfer(shares, recipient);
    }

    public fun split_shares(
        shares: &mut ChannelShare,
        amount: u64,
        ctx: &mut TxContext
    ): ChannelShare {
        assert!(shares.amount > amount, 0); // Insufficient shares

        shares.amount = shares.amount - amount;

        ChannelShare {
            id: object::new(ctx),
            channel_id: shares.channel_id,
            amount,
        }
    }

    public fun merge_shares(
        shares1: &mut ChannelShare,
        shares2: ChannelShare,
    ) {
        assert!(shares1.channel_id == shares2.channel_id, 1); // Channel mismatch

        let ChannelShare { id, channel_id: _, amount } = shares2;
        object::delete(id);

        shares1.amount = shares1.amount + amount;
    }

    // ====== View Functions ======

    public fun get_channel_info(channel: &Channel): (String, String, String, address, u64, u64, bool) {
        (
            channel.name,
            channel.description,
            channel.category,
            channel.creator,
            channel.total_shares,
            channel.created_at,
            channel.active
        )
    }

    public fun get_shares_info(shares: &ChannelShare): (ID, u64) {
        (shares.channel_id, shares.amount)
    }
}

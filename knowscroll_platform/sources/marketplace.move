module knowscroll_platform::marketplace {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use knowscroll_platform::channel_nft::{Self, ChannelShare};

    // ====== Types ======

    public struct Marketplace has key {
        id: UID,
        fee_percentage: u64, // In basis points (100 = 1%)
        fee_recipient: address,
    }

    public struct Listing has key, store {
        id: UID,
        seller: address,
        channel_id: ID,
        shares: ChannelShare,
        price_per_share: u64,
        listed_at: u64,
    }

    // ====== Events ======

    public struct ListingCreated has copy, drop {
        listing_id: ID,
        seller: address,
        channel_id: ID,
        amount: u64,
        price_per_share: u64,
    }

    public struct SharesPurchased has copy, drop {
        listing_id: ID,
        buyer: address,
        seller: address,
        amount: u64,
        total_price: u64,
    }

    // ====== Functions ======

    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            fee_percentage: 250, // 2.5%
            fee_recipient: tx_context::sender(ctx),
        };

        transfer::share_object(marketplace);
    }

    public fun create_listing(
        _marketplace: &Marketplace,
        shares: ChannelShare,
        price_per_share: u64,
        ctx: &mut TxContext
    ): Listing {
        let listing_id = object::new(ctx);
        let listing_object_id = object::uid_to_inner(&listing_id);
        let (channel_id, amount) = channel_nft::get_shares_info(&shares);

        let listing = Listing {
            id: listing_id,
            seller: tx_context::sender(ctx),
            channel_id,
            shares,
            price_per_share,
            listed_at: tx_context::epoch_timestamp_ms(ctx),
        };

        event::emit(ListingCreated {
            listing_id: listing_object_id,
            seller: tx_context::sender(ctx),
            channel_id,
            amount,
            price_per_share,
        });

        listing
    }

    public fun purchase_shares(
        marketplace: &Marketplace,
        listing: Listing,
        mut payment: Coin<SUI>, // Made mutable
        amount_to_buy: u64,
        ctx: &mut TxContext
    ): (ChannelShare, Coin<SUI>) {
        let Listing {
            id,
            seller,
            channel_id: _,
            mut shares,
            price_per_share,
            listed_at: _
        } = listing;

        let (_, total_amount) = channel_nft::get_shares_info(&shares);
        assert!(amount_to_buy <= total_amount, 0); // Not enough shares
        assert!(amount_to_buy > 0, 4); // Must buy at least 1 share

        let total_price = price_per_share * amount_to_buy;
        assert!(coin::value(&payment) >= total_price, 1); // Insufficient payment

        // Calculate fees
        let fee_amount = (total_price * marketplace.fee_percentage) / 10000;
        let seller_amount = total_price - fee_amount;

        // Split payment
        let fee_coin = coin::split(&mut payment, fee_amount, ctx);
        let seller_coin = coin::split(&mut payment, seller_amount, ctx);

        // Transfer fee to marketplace
        transfer::public_transfer(fee_coin, marketplace.fee_recipient);

        // Transfer payment to seller
        transfer::public_transfer(seller_coin, seller);

        // Get listing ID before deleting
        let listing_id = object::uid_to_inner(&id);
        object::delete(id);

        // Handle shares
        let purchased_shares = if (amount_to_buy == total_amount) {
            // Buying all shares
            shares
        } else {
            // Split shares - buying partial
            let purchased = channel_nft::split_shares(&mut shares, amount_to_buy, ctx);
            // Transfer remaining shares back to seller
            transfer::public_transfer(shares, seller);
            purchased
        };

        event::emit(SharesPurchased {
            listing_id,
            buyer: tx_context::sender(ctx),
            seller,
            amount: amount_to_buy,
            total_price,
        });

        (purchased_shares, payment) // Return purchased shares and remaining payment
    }

    public fun cancel_listing(listing: Listing, ctx: &mut TxContext): ChannelShare {
        let Listing {
            id,
            seller,
            channel_id: _,
            shares,
            price_per_share: _,
            listed_at: _
        } = listing;

        // Only seller can cancel
        assert!(seller == tx_context::sender(ctx), 2);

        object::delete(id);
        shares
    }

    // ====== View Functions ======

    public fun get_listing_info(listing: &Listing): (address, ID, u64, u64, u64) {
        let (channel_id, amount) = channel_nft::get_shares_info(&listing.shares);
        (
            listing.seller,
            channel_id,
            amount,
            listing.price_per_share,
            listing.listed_at
        )
    }
}

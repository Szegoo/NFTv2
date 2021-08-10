#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;
use scale::{Encode, Decode};
use ink_primitives::Key;

#[ink::contract]
mod erc1155 {
    use ink_storage::{
        traits::{
            PackedLayout,
            SpreadLayout,
        }
    };
    #[derive(scale::Encode, scale::Decode, SpreadLayout, PackedLayout, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(
            Debug,
            PartialEq,
            Eq,
            scale_info::TypeInfo,
            ink_storage::traits::StorageLayout
        )
    )]
    pub struct SwapRequest {
        initializer: AccountId,
        confirmer: AccountId,
        confirmer_token_id: u128,
        confirmer_amount: u128,
        initializer_token_id: u128,
        initialier_amount: u128
    }
    #[ink(storage)]
    pub struct ERC1155 {
        //address => tokenId => amount
        balances: ink_storage::collections::HashMap<(AccountId, u128), u128>,
        //address => tokenId => price 
        prices: ink_storage::collections::HashMap<(AccountId, u128), u128>,
        //real owner => account => is allowed to spend owners balance? yes | no
        approvals: ink_storage::collections::HashMap<(AccountId, AccountId), bool>,
        //tokenId => creator of the token
        creators: ink_storage::collections::HashMap<u128, AccountId>,
        requests: ink_storage::collections::HashMap<u128, SwapRequest>,
        //tokenId => indx => account
        owners: ink_storage::collections::HashMap<(u128, u128), AccountId>,
        last_id: u128,
        owners_length: u128,
        requests_length: u128
    }
    impl ERC1155 {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                balances: Default::default(),
                approvals: Default::default(),
                creators: Default::default(),
                owners: Default::default(),
                requests: Default::default(),
                prices: Default::default(),
                last_id: 1,
                owners_length: Default::default(),
                requests_length: 0
            }
        }
        #[ink(message)]
        pub fn balance_of(&self,account: AccountId, id: u128) -> Option<u128> {
            self.balances.get(&(account, id)).cloned()
        }
        #[ink(message)]
        pub fn price_of(&self, account: AccountId, id: u128) -> Option<u128> {
            self.prices.get(&(account, id)).cloned()
        }
        #[ink(message)]
        pub fn get_request(&self, id: u128) -> Option<SwapRequest> {
            let temp = SwapRequest {
                initializer: Default::default(),
                confirmer: Default::default(),
                confirmer_token_id: Default::default(),
                confirmer_amount: Default::default(),
                initializer_token_id: Default::default(),
                initialier_amount: Default::default()
            };
            self.requests.get(&id).cloned()
        }
        #[ink(message)]
        pub fn creator_of(&self, id: u128) -> Option<AccountId> {
            self.creators.get(&id).cloned()
        }
        #[ink(message)]
        pub fn owners_of(&self, token_id: u128, indx: u128) -> Option<AccountId> {
            self.owners.get(&(token_id, indx)).cloned()
        }
        #[ink(message)]
        pub fn mint(&mut self, amount: u128, price: u128) {
            let caller = self.env().caller();
            if amount == 0 {
                panic!("Amount needs to be bigger than 0");
            }
            self.balances.insert((caller, self.last_id), amount); 
            self.prices.insert((caller, self.last_id), price);
            self.creators.insert(self.last_id, caller);
            self.owners.insert((self.last_id, self.owners_length), caller);
            self.owners_length+=1;
            self.last_id+=1;
        }
        #[ink(message, payable)]
        pub fn buy(&mut self, token_id: u128, from: AccountId, amount: u128, 
        sell_price: u128) {
            let value = self.env().transferred_balance();
            let caller = self.env().caller();
            let priceResult = self.price_of(from, token_id);
            match priceResult {
                Some(price) => {
                    if value < price * amount {
                        panic!("Ova kolicina nije dovoljna za ovu tranzakciju!");
                    }
                    let balance_result = self.balance_of(from, token_id);
                    match balance_result {
                        Some(balance) => {
                            if balance == amount {
                                self.balances.insert((from, token_id), Default::default());
                                self.prices.insert((from, token_id), Default::default());
                                for i in 0..self.last_id {
                                    if self.owners_of(token_id, i) == Some(from) {
                                        self.owners.insert((token_id, i), Default::default());
                                    }
                                }
                            }else {
                                self.balances.insert((from, token_id), balance - amount);
                            }
                            let balance_of_token = self.balance_of(caller, token_id);
                            if balance_of_token == None || balance_of_token == Some(0) {
                                self.owners.insert((token_id,self.owners_length), caller);
                                self.balances.insert((caller, token_id), amount);
                            }else {
                                match balance_of_token {
                                    Some(res) => {
                                        self.balances.insert((caller, token_id), amount+res);
                                    }
                                    None => panic!("Doslo je do greske")
                                }
                            }
                            self.prices.insert((caller, token_id), sell_price);
                            if Some(from) == self.creator_of(token_id) {
                                self.env().transfer(from, value);
                            }else if value > 0 {
                                //let fee = value / 10;
                                let fee = 1;
                                let creator_res = self.creator_of(token_id);
                                match creator_res {
                                    Some(creator) => {
                                        self.env().transfer(creator, fee);
                                        self.env().transfer(from, value - fee);
                                    }
                                    None => panic!("No creator!")
                                }
                            }
                        }
                        None => panic!("the seller account doesn't have enought tokens")
                    }
                }
                None => panic!("this account does not have this token")
            }
        }
        #[ink(message)]
        pub fn create_swap_request(
            &mut self,
            your_token_id: u128,
            your_amount: u128,
            confirmer_token_id: u128,
            confirmer_amount: u128,
            confirmer: AccountId
        ) {
            let caller = self.env().caller();
            self.requests.insert(self.requests_length, SwapRequest {
                initializer: caller,
                initialier_amount: your_amount,
                initializer_token_id: your_token_id,
                confirmer,
                confirmer_amount,
                confirmer_token_id
            });
        }
        #[ink(message)]
        pub fn confirm_swap_request(&mut self, swap_request_id: u128) {
            let request_res = self.get_request(swap_request_id);
            match request_res {
                Some(request) => {

                    let caller = self.env().caller();
                    if request.confirmer == Default::default() {
                        panic!("Ovaj zahtev ne postoji");
                    }
                    if caller != request.confirmer {
                        panic!("Nemas pravo na ovo!");
                    }
                    if self.balance_of(caller, request.confirmer_token_id) < Some(request.confirmer_amount) {
                        panic!("Nemas dovoljno tokena!");
                    }
                    if self.balance_of(request.initializer, request.confirmer_token_id) < Some(request.initialier_amount) {
                        panic!("Balance od kreatora upita nije dovoljan!");
                    }
                    let confirmer_token_result = self.balance_of(caller, request.confirmer_token_id);
                    match confirmer_token_result {
                        Some(confirmer_token_balance) => {
                            self.balances.insert((caller, request.confirmer_token_id), confirmer_token_balance - request.confirmer_amount);
                        }
                        None => panic!("Doslo je do greske!")
                    }
                    let initializer_result = self.balance_of(request.initializer, request.confirmer_token_id);
                    match initializer_result {
                        Some(initializer_balance) => {
                            self.balances.insert((request.initializer, request.confirmer_token_id), initializer_balance+request.confirmer_amount);
                        }
                        None => {
                            self.balances.insert((request.initializer, request.confirmer_token_id), request.confirmer_amount);
                        }
                    }
                    let initializer_token_result = self.balance_of(caller, request.confirmer_token_id);
                    match initializer_token_result {
                        Some(initializer_token_balance) => {
                            self.balances.insert((request.initializer, request.initializer_token_id), initializer_token_balance - request.initialier_amount);
                        }
                        None => panic!("Doslo je do greske!")
                    }
                    let confirmer_result = self.balance_of(request.confirmer, request.initializer_token_id);
                    match confirmer_result {
                        Some(confirmer_balance) => {
                            self.balances.insert((request.confirmer, request.initializer_token_id), confirmer_balance+request.initialier_amount);
                        }
                        None => {
                            self.balances.insert((request.confirmer, request.initializer_token_id), request.initialier_amount);
                        }
                    }
                }
                None => panic!("Ne postoji zahtev sa ovim id-jem")
            } 
        }
    }
}

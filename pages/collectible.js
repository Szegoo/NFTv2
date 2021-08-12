import Web3 from 'web3';
import React from 'react';
import axios from 'axios';
import BigNumber from 'big-number';
import Router from 'next/router';
import {ABI, contractAddress} from '../ABI';
import { ApiPromise, WsProvider } from '@polkadot/api';

const web3 = new Web3(Web3.givenProvider);
export default class Collectible extends React.Component {
	state = {
		collectible: null,
		kolicina: 0,
		sellPrice: 0,
		kupi: true,
        tokenId: 0,
        yourAmountForSwap: 0,
        amountForSwap: 0,
        alert: false
	}
	static async getInitialProps({req, res, query}) {
		return {
			id: query.id,
			owner: query.owner
		}
	}
	componentDidMount() {
		this.getCollectible();
	}
	getCollectible = async() => {
		if(window !== undefined) {
			const ContractPromise = (await import("@polkadot/api-contract")).ContractPromise;
			const web3Enable = (await import("@polkadot/extension-dapp")).web3Enable;
			const web3Accounts = (await import("@polkadot/extension-dapp")).web3Accounts;
			const web3FromAddress = (await import("@polkadot/extension-dapp")).web3FromAddress;
			const allInjected = await web3Enable('my cool dapp');
			if(allInjected.length === 0) {
				return;
			}
			const allAccounts = await web3Accounts();
			let account = allAccounts[0];
			console.log(allInjected);

			const provider = new WsProvider('ws://127.0.0.1:9944');
			const api = await ApiPromise.create({ provider });
			const contract = new ContractPromise(api, ABI, contractAddress);
	
			const {id, owner} = this.props;
			let url = "http://localhost:3000/nft?id="+id;
			let price = (await contract.query.priceOf(account.address, {
				value: 0, gasLimit: -1
			}, owner, id)).output.toHuman();
			let creator = (await contract.query.creatorOf(account.address,{
				value: 0, gasLimit: -1
			}, id)).output.toHuman();
			let balance = (await contract.query.balanceOf(account.address, {
				value: 0, gasLimit: -1
			}, owner, id)).output.toHuman();

			let collectible = {...(await axios.get(url)).data, balance, price, creator};
			console.log(collectible);
			this.setState({collectible});
		}
	}
	handleChange = (e) => {
		//treba jos provera za celi broj
		this.setState({[e.target.name]: e.target.value});
	} 
	handleKupovina = async() => {
		if(window !== undefined) {
			const {id, owner} = this.props;
			const {kolicina, sellPrice, collectible} = this.state;
			const ContractPromise = (await import("@polkadot/api-contract")).ContractPromise;
			const web3Enable = (await import("@polkadot/extension-dapp")).web3Enable;
			const web3Accounts = (await import("@polkadot/extension-dapp")).web3Accounts;
			const web3FromAddress = (await import("@polkadot/extension-dapp")).web3FromAddress;
			const {lastId} = this.state;
			const allInjected = await web3Enable('my cool dapp');
			if(allInjected.length === 0) {
				return;
			}
			const allAccounts = await web3Accounts();
			let account = allAccounts[0];

			const provider = new WsProvider('ws://127.0.0.1:9944');
			const api = await ApiPromise.create({ provider });
			const contract = new ContractPromise(api, ABI, contractAddress);
			const injector = await web3FromAddress(account.address);
			console.log(contract.tx);
			const gasLimit = 9000n * 100000000n;
			collectible.price = parseFloat(collectible.price.replace(/,/g, ''));
			console.log(Number(collectible.price)*Number(kolicina));
			await contract.tx
			.buy({ value:collectible.price*kolicina, gasLimit }, id, owner, kolicina, sellPrice)
			.signAndSend(account.address,{signer: injector.signer}, async(result) => {
				if (result.status.isInBlock) {
					console.log('in a block');
				} else if (result.status.isFinalized) {
					console.log('finalized');
					Router.push("/");
				}
			});
		}
	}
    handleRequest = async() => {
		//
		if(window !== undefined) {
			const ContractPromise = (await import("@polkadot/api-contract")).ContractPromise;
			const web3Enable = (await import("@polkadot/extension-dapp")).web3Enable;
			const web3Accounts = (await import("@polkadot/extension-dapp")).web3Accounts;
			const web3FromAddress = (await import("@polkadot/extension-dapp")).web3FromAddress;
			const {lastId} = this.state;
			const allInjected = await web3Enable('my cool dapp');
			if(allInjected.length === 0) {
				return;
			}
			const allAccounts = await web3Accounts();
			let account = allAccounts[0];

			const provider = new WsProvider('ws://127.0.0.1:9944');
			const api = await ApiPromise.create({ provider });
			const contract = new ContractPromise(api, ABI, contractAddress);
			const injector = await web3FromAddress(account.address);
			const gasLimit = 9000n * 100000000n;

			const {id, owner} = this.props;
			const {tokenId, yourAmountForSwap, amountForSwap} = this.state;

			await contract.tx
			.createSwapRequest({ value:0, gasLimit }, tokenId, yourAmountForSwap,
				id, amountForSwap, owner).signAndSend(account.address,
					{signer: injector.signer}, async(result) => {
				if (result.status.isInBlock) {
					console.log('in a block');
				} else if (result.status.isFinalized) {
					console.log('finalized');
            		this.setState({alert: true});
				}
			});
		}
    }
	render() {
		const {id, owner} = this.props;
		const {collectible, kupi, alert} = this.state;
		return (
			<div>
				<h1 className="title">
				{collectible&& collectible.title}(Token {id})
				</h1>
				{collectible&&
					<div className="big-collectible">
						<img src={collectible.image}/>
						<h3>Jedinicna cena: {collectible.price}ETH</h3>
						<h3>Kolicina: {collectible.balance}</h3>
						<h3>Vlasnik: {owner}</h3>
						<h3>Kreator: {collectible.creator}</h3>
						<a onClick={() => this.setState({kupi: true})}>Kupi</a>
						<a onClick={() => this.setState({kupi: false})}>Menjaj</a>
						{kupi ? 
							<div>
								<input onChange={this.handleChange} name="kolicina" type="number" placeholder="kolicina za kupovinu"/>
								<input onChange={this.handleChange} name="sellPrice" type="number" placeholder="cena za prodaju"/>
								<button onClick={this.handleKupovina}>Kupi</button>
							</div>
							:
							<div>  
								<input onChange={this.handleChange} name="tokenId" type="number" placeholder="Token koji nudim"/>
								<p style={{color: "gray"}}>(id od tog tokena)</p>
								<input onChange={this.handleChange} name="yourAmountForSwap" type="number" placeholder="Kolicina koju nudim"/>
								<h3>Za</h3>
								<input onChange={this.handleChange} name="amountForSwap" type="number" placeholder="kolicina koju trazim za uzvrat"/>
								<button onClick={this.handleRequest}>Pokusaj da zamenis</button>
								<p style={{color: "gray"}}>(treba da sacekas potvrdu vlasnika tokena)</p>
								<p style={{color: "gray"}}>(Contract ne proverava sada balance, <br/> 
								provera se vrsi tokom potvrde zamene)</p>
							</div>
						}
                        {alert&&
                            <div className="alert">
                                <p>
                                Upit za menjanje je poslat...
                                </p>
                            </div>
                        }
					</div>
				}
			</div>
		)
	}
}
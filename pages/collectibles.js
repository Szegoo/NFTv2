import Web3 from 'web3';
import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import {ABI, contractAddress} from '../ABI';
import Router from 'next/router';
import { ApiPromise, WsProvider } from '@polkadot/api';

const web3 = new Web3(Web3.givenProvider);
export default class Browser extends React.PureComponent {
	state = {
		collectibles: null
	}
	componentDidMount() {
		this.collectible = new FormData();
		this.getCollectibles();
	}
	getCollectibles = async() => {
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

			var { gasConsumed, result, output } = await contract.query.getLastId(account.address, { value: 0, gasLimit: -1 });
			console.log(result.toHuman());
			let collectibles = [];
			if(result.isOk) {
			let lastId = output.toHuman();
			console.log(lastId);
			for(let i = 1, j=0; i < lastId; i++) {
				var {gasConsumed, result, output} = await contract.query.isOwner(account.address, {value: 0, gasLimit: -1},account.address, i);
				var {result, output} = await contract.query.getOwnersLength(account.address, {value:0, gasLimit: -1},i);
				if(result.isOk) {
					console.log(output.toHuman());
					for(let k = 1; k <= output.toHuman(); k++) {
						let address = (await contract.query.ownersOf(account.address,
							{value:0, gasLimit: -1},i, k)).output.toHuman();
						console.log("Adresa " + i + " "+address);
						if(address !== account.address) {
							var {result, output} = await contract.query.balanceOf(account.address, {value: 0, gasLimit: -1}, address, i);
							if(result.isOk) {
								const balance = output.toHuman();
								console.log(balance, i);
								if(balance > 0) {
									var {result, output} = await contract.query.priceOf(account.address, {
										value: 0, gasLimit: -1
									}, address, i);
									if(result.isOk) {
										const price = output.toHuman();
										let url = "http://localhost:3000/nft?id="+i;
										console.log(url);
										collectibles[j] = {...(await axios.get(url)).data,
										balance, price, address};
										j++;
									}
								}
							}
						}
					}
				}
			} 
			this.setState({lastId});
			}else {
				console.log(result.toHuman());
			}
			this.setState({collectibles});
		}
	}
	shorten = (text) => {
		return text.substring(0, 5) + "..." + text.substring(text.length - 3, text.length);
	}
	render() {
		const {collectibles} = this.state;
		console.log(collectibles);
		return (
			<div>
				<h1 className="title">
					Svi kolekcionarski tokeni
				</h1>
				<div className="nav-bar">
					<Link href="/"><a>Your Collectibles</a></Link>
					<Link href="/collectibles"><a>All Collectibles</a></Link>
					<Link href="/requests"><a>Your Swap Requests</a></Link>
				</div>
				<div className="collectibles">
					{collectibles&& collectibles.map(collectible => 
						<div key={collectible.id} onClick={() => Router.push(`/collectible?id=${collectible.id}&owner=${collectible.address}`)}
						 key={collectible.id} className="collectible">
							<img src={collectible.image}/>
							<p>id: {collectible.id} <br/> 
							kolicina: {collectible.balance} <br/>
							cena: {collectible.price}Eth
							<br />
							vlasnik: {this.shorten(collectible.address)}
							</p>
						</div>		
					)}
				</div>
			</div>
		)
	}
}
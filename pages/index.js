import Web3 from 'web3';
import React from 'react';
import axios from 'axios';
import BigNumber from 'big-number';
import Link from 'next/link';
import {ABI, contractAddress} from '../ABI';
import { ApiPromise, WsProvider } from '@polkadot/api';

const web3 = new Web3(Web3.givenProvider);

export default class Index extends React.PureComponent {
	state = {
		lastId: 0,
		cena: 0,
		kolicina: 0,
		collectibles: null,
		title: "",
		requests: null,
		creations: null
	}
	componentDidMount() {
		this.collectible = new FormData();
		//this.getCollectibles();
		this.enable();
	}
	enable = async() => {
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
					if(result.isOk) {
						console.log(output.toHuman());
						if(output.toHuman() === true) {
							var {result, output} = await contract.query.balanceOf(account.address, {value: 0, gasLimit: -1}, account.address, i);
							if(result.isOk) {
								const balance = output.toHuman();
								var {result, output} = await contract.query.priceOf(account.address, {
									value: 0, gasLimit: -1
								}, account.address, i);
								if(result.isOk) {
									const price = output.toHuman();
									let url = "http://localhost:3000/nft?id="+i;
									console.log(url);
									collectibles[j] = {...(await axios.get(url)).data,
									balance, price};
									j++;
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
	createCollectible = async() => {
		const {cena, kolicina} = this.state;
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
			console.log(allInjected);
			const allAccounts = await web3Accounts();
			let account = allAccounts[0];
			console.log(allInjected);

			const provider = new WsProvider('ws://127.0.0.1:9944');
			const api = await ApiPromise.create({ provider });
			const contract = new ContractPromise(api, ABI, contractAddress);
			console.log(account);
			const injector = await web3FromAddress(account.address);
			console.log(contract.tx);
			const gasLimit = 9000n * 10000000n;
			await contract.tx
			.mint({ value:0, gasLimit }, kolicina, cena)
			.signAndSend(account.address,{signer: injector.signer}, async(result) => {
				if (result.status.isInBlock) {
					console.log('in a block');
				} else if (result.status.isFinalized) {
					console.log('finalized');
					this.collectible.set('id', lastId)
					await axios.post("/api/add-nft", this.collectible);
					this.enable();
				}
			});
		}
	}
	getCollectibles = async() => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const NFTContract = new web3.eth.Contract(ABI, contractAddress, {from: account});
		let collectibles = [];
/* 		let creations = []; */
		const lastId = await NFTContract.methods.lastId().call();
 		for(let i = 1, j=0; i <= lastId; i++) {
			const balance = await NFTContract.methods.balanceOf(account, i).call();
/* 			const creatorOf = await NFTContract.methods.creatorOf(i).call(); */
			/* if(creatorOf.toLowerCase() === account.toLowerCase() && balance == 0) {
				console.log('hey');
				let url = await NFTContract.methods.baseUri().call();
				url = "http://" + 'localhost:3000/nft' + `?id=${i}`;
				let {data} = await axios.get(url);
				creations.push(data.image);
			} */
			if(balance > 0) {
				let url = await NFTContract.methods.baseUri().call();
				let price = await NFTContract.methods.priceOf(account, i).call() * Math.pow(10, -18);
				url = "http://" + url + `?id=${i}`;
				console.log(url);
				//stavljam sve podatke u jedan objekat
				collectibles[j] = {...(await axios.get(url)).data, balance, price};
/* 				if(creatorOf.toLowerCase() === account.toLowerCase()) {
					creations.push(collectibles[j].image);
				} */
				j++;
			}
		} 
		this.setState({collectibles});
	}
	handleChange = (e) => {
		if(e.target.name === "image"){
			this.collectible.set("image", e.target.files[0]);
		}else if (e.target.name === "title") {
			this.collectible.set("title", e.target.value);	
		}else {
			this.setState({[e.target.name]: e.target.value});
		}
	}
	render() {
		let {collectibles, requests} = this.state;
		return (
			<div>
				<h1 className="title">
					Napravi svoj kolekcionarski token
				</h1>
				<div className="nav-bar">
					<Link href="/"><a>Your Collectibles</a></Link>
					<Link href="/collectibles"><a>All Collectibles</a></Link>
					<Link href="/requests"><a>Your Swap Requests</a></Link>
				</div>
				<label htmlFor="image">
					Postavi sliku svog kolekcionarskog tokena
					(slike se smanjuju na 500x500px)
				</label>
				<input type="text" onChange={this.handleChange} name="title" placeholder="naziv"/>
				<input onChange={this.handleChange} name="cena" inputMode="decimal" type="number" placeholder="cena (ETH)"/>
				<input onChange={this.handleChange} name="kolicina" inputMode="decimal" type="number" placeholder="kolicina"/>
				<input onChange={this.handleChange} name="image" type="file"/>
				<button onClick={this.createCollectible}>Create</button>
				<h2>Your NFT's: </h2>
				<div className="collectibles">
				{collectibles&& collectibles.map(collectible => 
					<div key={collectible.id} className="collectible">
						<img src={collectible.image}/>
						<p>id: {collectible.id} <br/> 
						kolicina: {collectible.balance} <br/>
						cena: {collectible.price}Eth
						</p>
					</div>
				)}
				</div>
			</div>
		)
	}
}
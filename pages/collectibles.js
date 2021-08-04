import Web3 from 'web3';
import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import {ABI, contractAddress} from '../ABI';
import Router from 'next/router';

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
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const NFTContract = new web3.eth.Contract(ABI, contractAddress, {from: account});
		let collectibles = [];
		const lastId = await NFTContract.methods.lastId().call();
 		for(let i = 1, j=0; i < lastId; i++) {
			const owners = await NFTContract.methods.ownersOf(i).call();
			for(let k = 0; k < owners.length; k++) {
				if(owners[k].toLowerCase() !== account.toLowerCase()) {
					const balance = await NFTContract.methods.balanceOf(owners[k], i).call();
					if(balance > 0){
						let url = await NFTContract.methods.baseUri().call();
						let price = await NFTContract.methods.priceOf(owners[k], i).call() * Math.pow(10, -18);
						url = "http://" + 'localhost:3000/nft' + `?id=${i}`;
						console.log(url);
						//stavljam sve podatke u jedan objekat
						collectibles[j] = {...(await axios.get(url)).data, balance, 
							price, owner: owners[k]};
						j++;
					}
				}
			}
		} 
		this.setState({collectibles});
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
						<div key={collectible.id} onClick={() => Router.push(`/collectible?id=${collectible.id}&owner=${collectible.owner}`)}
						 key={collectible.id} className="collectible">
							<img src={collectible.image}/>
							<p>id: {collectible.id} <br/> 
							kolicina: {collectible.balance} <br/>
							cena: {collectible.price}Eth
							<br />
							vlasnik: {this.shorten(collectible.owner)}
							</p>
						</div>		
					)}
				</div>
			</div>
		)
	}
}
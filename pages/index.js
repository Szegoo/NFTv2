import Web3 from 'web3';
import React from 'react';
import axios from 'axios';
import BigNumber from 'big-number';
import Link from 'next/link';
import {ABI, contractAddress} from '../ABI';

const web3 = new Web3(Web3.givenProvider);

export default class Index extends React.PureComponent {
	state = {
		lastId: 0,
		cena: 0,
		kolicina: 0,
		collectibles: null,
		title: "",
		requests: null
	}
	componentDidMount() {
		this.collectible = new FormData();
		this.getCollectibles();
	}
	createCollectible = async() => {
		const {cena, kolicina} = this.state;
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const NFTContract = new web3.eth.Contract(ABI, contractAddress, {from: account});
		NFTContract.methods.lastId().call().then(async lastId => {
			const nextId = Number(lastId);
			this.collectible.set("id", nextId);
			//cenu mnozim sa 10^18 post je 1eth = 10^18 wei
			let price = await BigNumber(cena*Math.pow(10, 18)).toString();
			NFTContract.methods.mint(kolicina, price).send().then(async(response) => {
				await axios.post("/api/add-nft", this.collectible);
				console.log(response);
				//pozivam opet da bi se dodao novi token
				this.getCollectibles();
			});  
		});
	}
	getCollectibles = async() => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const NFTContract = new web3.eth.Contract(ABI, contractAddress, {from: account});
		let collectibles = [];
		const lastId = await NFTContract.methods.lastId().call();
 		for(let i = 1, j=0; i <= lastId; i++) {
			const balance = await NFTContract.methods.balanceOf(account, i).call();
			if(balance > 0) {
				let url = await NFTContract.methods.baseUri().call();
				let price = await NFTContract.methods.priceOf(account, i).call() * Math.pow(10, -18);
				url = "http://" + url + `?id=${i}`;
				console.log(url);
				//stavljam sve podatke u jedan objekat
				collectibles[j] = {...(await axios.get(url)).data, balance, price};
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
		console.log(requests);
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
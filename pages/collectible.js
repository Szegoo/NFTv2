import Web3 from 'web3';
import React from 'react';
import axios from 'axios';
import BigNumber from 'big-number';
import Router from 'next/router';
import {ABI, contractAddress} from '../ABI';

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
		const {id, owner} = this.props;
		const NFTContract = new web3.eth.Contract(ABI, contractAddress);
		const balance = await NFTContract.methods.balanceOf(owner, id).call();
		let url = await NFTContract.methods.baseUri().call();
		let price = await NFTContract.methods.priceOf(owner, id).call() * Math.pow(10, -18);
		let creator = await NFTContract.methods.creatorOf(id).call();
		url = "http://" + url + `?id=${id}`;
		console.log(url);
		//stavljam sve podatke u jedan objekat
		let collectible = {...(await axios.get(url)).data, balance, price, creator};
		this.setState({collectible});
	}
	handleChange = (e) => {
		//treba jos provera za celi broj
		this.setState({[e.target.name]: e.target.value});
	} 
	handleKupovina = async() => {
		const {id, owner} = this.props;
		const {kolicina, sellPrice, collectible} = this.state;
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const NFTContract = new web3.eth.Contract(ABI, contractAddress, {from: account});
		let value = await BigNumber((collectible.price * Math.pow(10, 18)) * kolicina).toString();
		let newPrice = await BigNumber(sellPrice*Math.pow(10,18)).toString();
		NFTContract.methods.buy(id, owner, kolicina, newPrice).send({
			value
		}).then(() => {
			Router.push("/");
		})
	}
    handleRequest = async() => {
        const {id, owner} = this.props;
		const {tokenId, yourAmountForSwap, amountForSwap} = this.state;
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const NFTContract = new web3.eth.Contract(ABI, contractAddress, {from: account});
        NFTContract.methods.createSwapRequest(tokenId, yourAmountForSwap, id, amountForSwap, owner).send().then(()=>{
            this.setState({alert: true});
        })
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
								<input onChange={this.handleChange} name="sellPrice" type="number" inputMode="decimal" placeholder="cena za prodaju"/>
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
import {useState, useEffect} from 'react';
import {ABI, contractAddress} from '../ABI';
import Link from 'next/link';
import Web3 from 'web3';
import axios from 'axios';
import Router from 'next/router';

const web3 = new Web3(Web3.givenProvider);


export default () => {
	const [requests, setRequests] = useState(null);
	useEffect(() => {
		getRequests();
	}, [])
	const getRequests = async() => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const NFTContract = new web3.eth.Contract(ABI, contractAddress, {from: account});	
		let yourRequests = []
		let allRequests = await NFTContract.methods.getRequests().call();
		for(let i = 0; i < allRequests.length; i++) {
			//proverava da li sam ja osoba na koju se ceka da se 
			//potvrdi tranzakcija
			if(allRequests[i].confirmer.toLowerCase() === account.toLowerCase()) {
				let baseUrl = await NFTContract.methods.baseUri().call();
				let url = "http://" + baseUrl + `?id=${allRequests[i].confirmerTokenId}`;
				const {data} = await axios.get(url);
				console.log(allRequests[i]);
				url = "http://" + baseUrl + `?id=${allRequests[i].initializerTokenId}`;
				console.log(url);
				const data2 = (await axios.get(url)).data;
				console.log(data2);
				yourRequests.push({...allRequests[i], confirmerImage: data.image,
				confirmerTitle: data.title, initializerImage: data2.image, initializerTitle: data2.title});
			}
		}
		setRequests(yourRequests);
	} 
	const handleSwap = async(id) => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const NFTContract = new web3.eth.Contract(ABI, contractAddress, {from: account});	
		console.log(id);
		NFTContract.methods.confirmSwapRequest(id).send().then(() => {
			Router.push('/');
		})	
	}
	console.log(requests);
	return (
		<div>
			<h2>Your Swap Requests: </h2>
			<div className="nav-bar">
					<Link href="/"><a>Your Collectibles</a></Link>
					<Link href="/collectibles"><a>All Collectibles</a></Link>
					<Link href="/requests"><a>Your Swap Requests</a></Link>
			</div>
			<div className="requests">
				{requests&& requests.map((request, indx) => 
				<div className="request-up" key={indx}>
					<div className="request">
						<div className="details">
							<img src={request.confirmerImage}/>
							<h3>id {request.confirmerTokenId}</h3>
							<h3>kolicina {request.confirmerAmount}</h3>
						</div>
						<div className="details">
							<img src={request.initializerImage}/>
							<h3>id {request.initializerTokenId}</h3>
							<h3>kolicina {request.initializerAmount}</h3>
						</div>
					</div>
					<button onClick={() => handleSwap(request.id)}>Prihvati zamenu</button>
				</div>
				)}
			</div>
		</div>
	)
}
import {useState, useEffect} from 'react';
import {ABI, contractAddress} from '../ABI';
import Link from 'next/link';
import Web3 from 'web3';
import axios from 'axios';
import Router from 'next/router';
import { ApiPromise, WsProvider } from '@polkadot/api';

export default () => {
	const [requests, setRequests] = useState(null);
	useEffect(() => {
		getRequests();
	}, [])
	const getRequests = async() => {
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

			let yourRequests = [];
			let requestsLength = (await contract.query.getRequestsLength(account.address,
				{value: 0, gasLimit:-1})).output.toHuman();
			console.log(requestsLength);
			for(let i = 0; i < requestsLength; i++) {
				let request = (await contract.query.getRequest(account.address,
					{value: 0, gasLimit: -1}, i)).output.toHuman();
				console.log(request);
				if(request.confirmer.toLowerCase() === account.address.toLowerCase()) {
					let url = "http://localhost:3000/nft?id="+request.confirmer_token_id;
					const {data} = await axios.get(url);
					url = "http://localhost:3000/nft?id="+request.initializer_token_id;
					const data2 = (await axios.get(url)).data;
					console.log(data2);
					yourRequests.push({...request, confirmerImage: data.image,
				confirmerTitle: data.title, initializerImage: data2.image, initializerTitle: data2.title});
				}
			}
			setRequests(yourRequests);
		}	
	} 
	const handleSwap = async(id) => {

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
			const injector = await web3FromAddress(account.address)
			const gasLimit = 9000n * 100000000n;

			await contract.tx
			.confirmSwapRequest({ value:0, gasLimit }, id)
			.signAndSend(account.address,{signer: injector.signer}, async(result) => {
				if (result.status.isInBlock) {
					console.log('in a block');
				} else if (result.status.isFinalized) {
					console.log('finalized');
					Router.push('/');
				}
			});
		}
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
							<h3>id {request.confirmer_token_id}</h3>
							<h3>kolicina {request.confirmer_amount}</h3>
						</div>
						<div className="details">
							<img src={request.initializerImage}/>
							<h3>id {request.initializer_token_id}</h3>
							<h3>kolicina {request.initializer_amount}</h3>
						</div>
					</div>
					<button onClick={() => handleSwap(request.id)}>Prihvati zamenu</button>
				</div>
				)}
			</div>
		</div>
	)
}
import './App.css';
import { useEffect, useState } from 'react';
import Web3 from "web3";
import Will from "./truffle_abis/Will.json";

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [willContract, setWillContract] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [addressInheritance, setAddressInheritance] = useState('')
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, [])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non ethereum browser detected. You should consider Metamask!"
      );
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    //LOAD will contract
    const willData = Will.networks[networkId];
    if (willData) {
      const will = new web3.eth.Contract(Will.abi, willData.address);
      setWillContract(will);

      const a = await will.methods
        .isOwner(accounts[0])
        .call()
      console.log('is Owner?', a)
      setIsOwner(a || false)
    } else {
      window.alert("will contract not deployed to detect network");
    }
    setLoading(false);
  }

  const handleSetInheritance = () => {
    setLoading(true);
    willContract.methods
      .setInheritance(addressInheritance, amount)
      .send({from:account})
      .on('transaction',(hash)=>{
        console.log(hash)
      })
    setLoading(false);
  }

  const handleDecease = ()=>{
    setLoading(true);
    willContract.methods
      .hasDeceased()
      .send({from:account})
      .on('transaction',(hash)=>{
        console.log(hash)
      })
    setLoading(false);
  }


  return (
    <div className="App">
      <p>
        Your account: {account ? account : 'loading...'}
      </p>
      {isOwner ? <>
        <p>Hello owner</p>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(addressInheritance)
          console.log(amount)
          handleSetInheritance()
        }}>
          <label>Address</label>
          <input
            type='String'
            placeholder='Add address'
            value={addressInheritance}
            onChange={(e) => setAddressInheritance(e.target.value)}></input>
          <label>amount</label>
          <input
            placeholder='amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}></input>
          <button type='submit'>Set Inheritance</button>
        </form>
        <button onClick={handleDecease}>decease</button>
        </> : <p>You are not owner of this contract</p>
      }
    </div>
  );
}

export default App;

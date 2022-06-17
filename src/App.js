import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, [])

  useEffect(() => {// Change account
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
    if (Web3.utils.isAddress(addressInheritance))
    {if(amount==0){
      window.alert('amount cant be zero')
    }else
      willContract.methods
        .setInheritance(addressInheritance, amount)
        .send({ from: account })
        .on('transactionHash', (hash) => {
          console.log(hash)
          window.alert('Sussecc address')
        }).on('erorr',error=>{
          console.log('error',error)
        })
      }
    else {
      window.alert('Wrong type address')
      setLoading(false);
    }
    setLoading(false);
  }

  const handleDecease = () => {
    setLoading(true);
    willContract.methods
      .hasDeceased()
      .send(
        { from: account }
        )
      .on('transactionHash', (hash) => {
        console.log('hash',hash)
      })
    setLoading(false);
  }

  const checkAdress = (string) => {
    if (!string) {
      setWarning(false)
      setAddressInheritance(string)
      return;
    }
    if (Web3.utils.isAddress(string)) {
      setWarning(false)
    } else {
      setWarning(true)
    }
    setAddressInheritance(string)
  }

  return (
    <div className="App">
      <p>
        Your account: {!loading ? account : 'loading...'}
      </p>
      {isOwner ? <>
        <p>Hello owner</p>
        <form 
         className='form'
        onSubmit={(e) => {
          e.preventDefault()
          console.log(addressInheritance)
          console.log(amount)
          handleSetInheritance()
        }}>
          <label>Address</label><br />
          <input
            style={warning?{border:'2px solid red',borderRadius: '4px'}:{}}
            type='String'
            placeholder='Add address'
            value={addressInheritance}
            onChange={(e) => checkAdress(e.target.value)}></input>
          {warning ? <p style={{ color: 'red' }}>Wrong type of address</p> : <></>}
          <br /><br />
          <label>amount</label><br />
          <input
            placeholder='amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}></input><br />
          <button type='submit'>Set Inheritance</button>
        </form>
        <button onClick={handleDecease}>decease</button>
      </> : <p>You are not owner of this contract</p>
      }
    </div>
  );
}

export default App;

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Web3 } from "web3"


const ADDRESS = "0x0E0eE71248A72db175d723864dCF18BbA6B558e1"
const ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "startingPoint",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "startingMessage",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "decreaseNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increaseNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "message",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newMessage",
        "type": "string"
      }
    ],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

function App() {
  const [number, setNumber] = useState("")
  const [message, setMessage] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [error, setError] = useState("")

  // Initialize web3 and contract 
  const getWeb3Contract = async () => {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      return new web3.eth.Contract(ABI, ADDRESS);
    } catch (err) {
      setError("Failed to connect to Web3: " + err.message);
      return null;
    }
  }

  // Reading functions
  async function getNumber() {
  
      const contract = await getWeb3Contract();
      if (!contract) return;
      const result = await contract.methods.getNumber().call();
      setNumber(result.toString());
     
   
  }

  async function getMessage() {
      const contract = await getWeb3Contract();
      if (!contract) return;
      const result = await contract.methods.message().call();
      setMessage(result);
      
   
  }

  // Writing functions
  async function increaseNumber() {
   
      const contract = await getWeb3Contract();
      if (!contract) return;
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.increaseNumber().send({ from: accounts[0] });
      await getNumber(); // Refresh the number
     
  }

  async function decreaseNumber() {
   
      const contract = await getWeb3Contract();
      if (!contract) return;
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.decreaseNumber().send({ from: accounts[0] });
      await getNumber(); // Refresh the number
    
   
  }

  async function updateMessage() {
   
      const contract = await getWeb3Contract();
      if (!contract) return;
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.setMessage(newMessage).send({ from: accounts[0] });
      await getMessage(); // Refresh the message
      setNewMessage(""); // Clear input
      
    
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>Number: {number}</p>
          <button onClick={decreaseNumber}>Decrease Number</button>
          <button onClick={increaseNumber}>Increase Number</button>
          <button onClick={getNumber}>Get Number</button>
        </div>
        <div>
          <p>Message: {message}</p>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter new message"
          />
          <button onClick={getMessage}>Get Message</button>
          <button onClick={updateMessage}>Update Message</button>
        </div>
      </div>
     
    </>
  )
}

export default App
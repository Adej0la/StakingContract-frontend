import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const StakingApp = () => {
  const contractAddress = "0x9B50f5a3B404c57C82790A410A18dCB75c3a5d92";
  const [totalStake, setTotalStake] = useState(null);
  const [userStakeBal, setUserStakeBal] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          accountChangedHandler(accounts[0]);
          setConnButtonText("Wallet Connected");
        });
    } else {
      setErroMessage("You need to install MetaMask!");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      abi.abi,
      tempSigner
    );
    setContract(tempContract);
  };

  const totalStakes = async () => {
    let val = await contract.totalStakes();
    setTotalStake(ethers.utils.formatEther(val));
  };

  // allows  user to stake an amount of tokens
  const stakeCreate = async (event) => {
    event.preventDefault();
    let val = await contract.createStake(event.target.stakedToken.value);
    console.log(val);

    // if (!val[0]) {
    //   return "Stake not created";
    // }
    // return `You have successfully staked ${val[1].toString()} tokens`;
  };

  // Retrieves the stake balance of user address
  const stakeBal = async (event) => {
    event.preventDefault();
    let val = await contract.stakeOf(event.target.stakedBal.value);
    setUserStakeBal(ethers.utils.formatEther(val));
  };

  // Allow user Perform a token Transfer
  const tokenTransfer = async (event) => {
    event.preventDefault();
    let val = await contract.transfer(
      event.target.receiver.value,
      event.target.amount.value
    );
    console.log(val);
  };

  // Rerender the total stakes
  useEffect(() => totalStakes());
  return (
    <div>
      <h2>{"Please connect to your Metamask wallet!"}</h2>
      <button onClick={connectWalletHandler}>{connButtonText}</button>

      <h3>
        This is the total amount of tokens staked by all users: {totalStake}
      </h3>
      <h3>Address: {defaultAccount}</h3>
      <form onSubmit={stakeCreate}>
        <input
          type="text"
          id="stakedToken"
          placeholder="Input amount of tokens you want to stake"
        />
        <button type={"submit"}>Stake Tokens</button>
      </form>

      <form onSubmit={stakeBal}>
        <input
          type="text"
          id="stakedBal"
          placeholder="Input your address to see your stake"
        />
        <button type={"submit"}>Check Stake Balance</button>
      </form>
      <h3>This is your token balance: {userStakeBal}</h3>

      <form onSubmit={tokenTransfer}>
        <input
          type="text"
          id="receiver"
          placeholder="Input the receiver's address"
        />
        <input
          type="text"
          id="amount"
          placeholder="Input the amount of tokens to be sent"
        />
        <button type={"submit"}>Transfer tokens</button>
      </form>
    </div>
  );
};

export default StakingApp;

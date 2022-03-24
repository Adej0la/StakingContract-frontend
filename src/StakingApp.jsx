import React, { useState } from "react";

const StakingApp = () => {
  const [erroMessage, setErroMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [currentContractVal, setCurrentContractVal] = useState(null);
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
  };
  return (
    <>
      <div>
        <h3>{"Please connect to your Metamask wallet!"}</h3>
        <button onClick={connectWalletHandler}>{connectButtonText}</button>
        <h3>Address: {defaultAccount}</h3>
      </div>
    </>
  );
};

export default StakingApp;

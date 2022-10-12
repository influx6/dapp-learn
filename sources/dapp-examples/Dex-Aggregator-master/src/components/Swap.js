import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Swap.css';

const Swap = ({
  account,
  contract,
  USDCBalance,
  WETHBalance,
  USDCContract,
}) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);

  const compareAndDisplayRate = async (e) => {
    const path = [
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ];
    let swapAmount = ethers.utils.parseUnits(e.target.value, 6);
    const cheaperRate = await contract.getHighestAmountOut(
      path,
      swapAmount.toString()
    );

    setRate(cheaperRate[1] / 10 ** 18);
  };

  const swap = async () => {
    try {
      setLoading(true);
      let swapAmount = ethers.utils.parseUnits(amount, 6);
      await USDCContract.approve(contract.address, swapAmount, {
        gasLimit: 300000,
      });
      let tx = await contract.usdcToWeth(swapAmount, { gasLimit: 300000 });
      await tx.wait();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className='App'>
      <div className='card app-card shadow'>
        <form>
          <div className='mb-3'>
            <input
              className='form-control form-control-lg'
              type='text'
              placeholder='Amount in USDC'
              value={amount}
              name='usdc'
              onChange={(e) => {
                setAmount(e.target.value);
                compareAndDisplayRate(e);
              }}
              aria-describedby='USDC-balance'
            />
            <div className='form-text' id='USDC-balance'>
              Balance: {USDCBalance} USDC
            </div>
          </div>

          <div className='mb-3'>
            <input
              className='form-control form-control-lg'
              type='text'
              placeholder='Amount in WETH'
              name='weth'
              readOnly
              value={rate}
              aria-describedby='WETH-balance'
            />
            <div className='form-text' id='WETH-balance'>
              Balance: {WETHBalance} WETH
            </div>
          </div>

          <div className='d-grid mx-auto'>
            <button
              onClick={swap}
              className='btn btn-dark btn-lg'
              type='button'
            >
              {loading ? (
                <span>
                  <span
                    className='spinner-grow spinner-grow-sm'
                    role='status'
                    aria-hidden='true'
                  ></span>
                  <span> Swapping...</span>{' '}
                </span>
              ) : (
                <span>Swap</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Swap;

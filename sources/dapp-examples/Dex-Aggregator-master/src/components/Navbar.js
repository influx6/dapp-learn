import React from 'react';

const Navbar = ({account, connectWallet, loading}) => {
  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-expand-md navbar-light'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='/home'>
            DexAggregator
          </a>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              
            </ul>
           
            {account == null ? (
        <button className='btn btn-dark' onClick={connectWallet}>
          {loading ? (
            <span>
              <span
                className='spinner-border spinner-border-sm me-2'
                role='status'
                aria-hidden='true'
              ></span>
              <span>Connecting..</span>
            </span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      ) : (
        <button type="button" className="btn btn-outline-dark" disabled>{account.slice(0, 7) + '....' + account.slice(34, 42)}</button>
      )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
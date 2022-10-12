import { useState } from 'react';
import './App.css';

function App() {
  const [nftOwner, setNftOwner] = useState('');
  const [allNfts, setAllNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNfts = async () => {

    setLoading(true);

    const options = { method: 'GET', headers: { Accept: 'application/json' } };
    fetch(
      `https://api.opensea.io/api/v1/assets?owner=${nftOwner}&limit=200&include_orders=false`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        //Once we get a response we save it in state as an array
        console.log(response.assets);
        setAllNfts(response.assets);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };


  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return (
    <div className='container'>
      <div className='input-group mt-5 mb-5'>
        <input
          type='text'
          className='form-control'
          placeholder='Address'
          aria-label="Recipient's username"
          aria-describedby='button-addon2'
          value={nftOwner}
          onChange={(e) => setNftOwner(e.target.value)}
        />
        {loading === true ? (
          <button className='btn btn-outline-primary' type='button' disabled>
            <span
              className='spinner-border spinner-border-sm me-2'
              role='status'
              aria-hidden='true'
            ></span>
            Loading...
          </button>
        ) : (
          <button
            className='btn btn-outline-primary'
            type='button'
            id='button-addon2'
            onClick={() => getNfts()}
          >
            Get All NFTs of this Address
          </button>
        )}
      </div>
      <div className='row'>
        {allNfts.map((nft, i) => {
          if (nft.image_preview_url !== null) {
            const uniqueString = makeid(6);
            return (
              <div
                key={i}
                className='card col-lg-4 m-auto mb-5 shadow border-0'
                style={{ width: '20rem' }}
              >
                {/* Display the image */}
                <div className='image-box'>
                  <img
                    src={nft.image_preview_url}
                    className='nft-img card-img-top pt-3'
                    alt='...'
                  />
                </div>
                <div className='card-body'>
                  {/* Display the tokenId, collection name etc */}
                  <h5 className='card-title fs-6'>#{nft.token_id}</h5>
                  <p className='card-text lead fs-6'>
                    <img
                      alt={nft.token_id}
                      src={nft.collection.image_url}
                      className='collection-image me-2'
                    ></img>
                    {nft.collection.name}
                  </p>
                  {/*  Button trigger modal  */}
                  <button
                    type='button'
                    className='btn btn-primary btn-sm'
                    data-bs-toggle='modal'
                    // data-bs-target is where the unique string is given and this will be the same for the modal as well
                    data-bs-target={`#${uniqueString}`}
                  >
                    Show Traits
                  </button>

                  {/* <!-- Modal which pops up when the show trait button is clicked --> */}
                  <div
                    className='modal fade'
                    id={uniqueString}
                    tabIndex='-1'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                  >
                    <div className='modal-dialog'>
                      <div className='modal-content'>
                        <div className='modal-header'>
                          <h6 className='modal-title' id='exampleModalLabel'>
                            <img
                              alt={nft.token_id}
                              src={nft.image_preview_url}
                              className='model-circle-image me-2'
                            ></img>{' '}
                            {nft.token_id}
                          </h6>
                          <button
                            type='button'
                            className='btn-close'
                            data-bs-dismiss='modal'
                            aria-label='Close'
                          ></button>
                        </div>
                        <div className='modal-body'>
                          {nft.traits.length === 0 ? (
                            <div>No Traits For This NFT</div>
                          ) : (
                            <table className='table table-hover'>
                              <thead>
                                <tr>
                                  <th scope='col'>#</th>
                                  <th scope='col'>Trait Type</th>
                                  <th scope='col'>Value</th>
                                  <th scope='col'>Trait Count</th>
                                </tr>
                              </thead>
                              {/* Looping through the traits that each nft has */}
                              {nft.traits.map((trait, i) => {
                                return (
                                  <tbody key={i}>
                                    <tr>
                                      <th scope='row'>{i}</th>
                                      <td>{trait.trait_type}</td>
                                      <td>{trait.value}</td>
                                      <td>{trait.trait_count}</td>
                                    </tr>
                                  </tbody>
                                );
                              })}
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* buy on opensea button which opens in a new tab */}
                  <a href={nft.permalink} target='_blank' rel='noreferrer'>
                    <button
                      type='button'
                      className='btn btn-outline-primary ms-2 btn-sm'
                    >
                      Buy on Opensea
                    </button>
                  </a>
                  <p className='card-text mt-3 fs-6'>
                    {nft.last_sale !== null &&
                      nft.last_sale.payment_token !== null && (
                        <span className='badge text-bg-light'>
                          {`Last Sale: ` +
                            Number(nft.last_sale.total_price) /
                              10 ** nft.last_sale.payment_token.decimals}{' '}
                          {nft.last_sale.payment_token.symbol}
                        </span>
                      )}
                  </p>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default App;

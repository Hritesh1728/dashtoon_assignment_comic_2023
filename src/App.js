import './App.css';
import React, { useState } from 'react';
import ControlPanel from './control_panel.js';
import Spinner from './spinner.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  const [imageData, setImageData] = useState({
  });
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className='background'>
        {Object.keys(imageData).length === 0 && loading === false ? (
          <div className="container">
            <div className="row">
              <div className="neons col-12">
                <h1><em>Create your comic from text in three steps.</em></h1>
                <ul>
                  <li>Click "Create"</li>
                  <li>Add text</li>
                  <li>Generate Comic</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          loading ? <Spinner /> :
            <div id="carouselExampleInterval" className="carousel carousel-fade display" data-bs-ride="pause">
              <ol className="carousel-indicators">
                {Object.keys(imageData).map((_, index) => (
                  <li
                    key={index}
                    data-bs-target="#carouselExampleInterval"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    style={{listStyle:'none'}}
                  ></li>
                ))}
              </ol>
              <div className="carousel-inner">
                {Object.entries(imageData) // Reverse the array
                  .map(([text, image], index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="10000">
                      <img
                        src={URL.createObjectURL(image)}
                        className="d-block w-100"
                        alt={`Slide ${index + 1}`}
                        style={{ maxHeight: '76vh', objectFit: 'contain', borderRadius: '10px' }}
                        id={`carouselImage${index}`}
                      />
                    </div>
                  ))
                }
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
        )}

        <ControlPanel imageData={imageData} setImageData={setImageData} loading={loading} setLoading={setLoading} />
        <ToastContainer />
      </div>
    </>
  );
};

export default App;

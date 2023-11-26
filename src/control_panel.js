import React, { useState } from 'react';
import './App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function query(data) {
    const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
            headers: {
                "Accept": "image/png",
                "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
}

const ControlPanel = ({ imageData, setImageData, loading, setLoading }) => {
    const [selectedNumberOfComics, setSelectedNumberOfComics] = useState(0);
    const [comicTexts, setComicTexts] = useState({});
    const [isResetting, setReset] = useState(false);

    const handleNumberOfComicsChange = (event) => {
        setSelectedNumberOfComics(Number(event.target.value));
    };

    const handleTextChange = (event, index) => {
        const newTexts = { ...comicTexts, [`comicText${index}`]: event.target.value };
        setComicTexts(newTexts);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isResetting) {
            console.log('Reset in progress. Skipping handleSubmit.');
            return;
        }

        const closeButton = document.querySelector('.btn-close');
        if (closeButton) {
            closeButton.click();
        }

        setLoading(true);
        setImageData({});

        const requests = [];

        for (const key in comicTexts) {
            if (comicTexts.hasOwnProperty(key)) {
                const text = comicTexts[key];
                if (isResetting) {
                    console.log('Reset in progress. Skipping request for:', text);
                    return;
                }
                const requestPromise = query({ inputs: text });
                requests.push(requestPromise);
                requestPromise.then((image) => {
                    setImageData((prevImageData) => ({
                        ...prevImageData,
                        [text]: image,
                    }));
                });
            }
        }

        try {
            const images = await Promise.all(requests);

            // Sort the images based on the order of comicTexts
            const sortedImageData = Object.entries(comicTexts).reduce((result, key, index) => {
                result[key] = images[index];
                return result;
            }, {});

            // Update imageData with sorted images
            setImageData(sortedImageData);

            toast.success('Your comic is ready');
        } catch (error) {
            console.error('Error loading images:', error);
            toast.error('Something went wrong in creating images.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setReset(true);

        const form = document.getElementById('comicForm');
        if (form) {
            form.reset();
        }
        setComicTexts({});
        setSelectedNumberOfComics(0);
        setImageData({});

        // Reset the select to the disabled value
        const selectElement = document.getElementById('numberOfComics');
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        setReset(false);
        toast.warning('All entries are reset!');
    };


    return (
        <>
            <div>
                <button className="btn btn-info top-right-button" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Create
                </button>
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-header" >
                        <h5 className="offcanvas-title" id="offcanvasExampleLabel">Create Your Ideas Into Comics!</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div className="animated-text">
                            <h3>Unleash your imagination <br />where words transform into comic wonders instantly.</h3>
                        </div>
                        <div className="container mt-5">
                            <form id="comicForm" onSubmit={handleSubmit}>
                                <div className="form-row mb-3">
                                    <div className="form-group col-md-12 d-flex justify-content-between align-items-center">
                                        <label htmlFor="numberOfComics">Select Number of Comic Images</label>
                                        <select
                                            className="form-control comic_no_input"
                                            id="numberOfComics"
                                            name="numberOfComics"
                                            required
                                            onChange={handleNumberOfComicsChange}
                                        >
                                            {[...Array(11)].map((_, index) => (
                                                <option key={index} value={index} disabled={index === 0} defaultValue={index === 0}>
                                                    {index === 0 ? 'Select' : index}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {[...Array(selectedNumberOfComics)].map((_, index) => (
                                    <div key={index} className="form-group" style={{
                                        marginBottom: index === selectedNumberOfComics - 1 ? '50px' : '10px',
                                    }}>
                                        <label htmlFor={`comicText${index + 1}`}>{`Text for Comic-Image ${index + 1}`}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`comicText${index + 1}`}
                                            name={`comicText${index + 1}`}
                                            required
                                            onChange={(event) => handleTextChange(event, index + 1)}
                                        />
                                    </div>
                                ))}

                                <div className="row mt-5 d-flex justify-content-end mb-3 fixed-bottom">
                                    <div className="col-auto" style={{ marginRight: '15px' }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={selectedNumberOfComics === 0}
                                        >
                                            Generate Comic
                                        </button>
                                    </div>
                                    <div className="col-auto" style={{ marginRight: '50px', marginLeft: '50px' }}>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ControlPanel;
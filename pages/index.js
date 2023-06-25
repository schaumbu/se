import {useEffect, useRef, useState} from 'react';
import {FaBook, FaTimes} from 'react-icons/fa';
import Autosuggest from 'react-autosuggest';

const IndexPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestionsList, setSuggestionsList] = useState([]);
    const [checked, setChecked] = useState(true);
    const [showFooter, setShowFooter] = useState(false);

    const [isRandom, setIsRandom] = useState(false);
    const submitButtonRef = useRef(null);

    useEffect(() => {
        if (isRandom) {
            submitButtonRef.current.click();
            setIsRandom(false)
        }
    }, [searchTerm, isRandom]);

    const handleRandomArticle = () => {
        fetch(`/api/randomArticle`)
            .then(response => response.json())
            .then(data => {
                setSearchTerm(data)
                setIsRandom(true)
            })
            .catch(error => {
                console.error('Fehler beim Abrufen des zufälligen Artikels:', error);
            });
    };

    const handleSwitchChange = () => {
        setChecked(!checked);
    };

    const handleInputChange = (e, {newValue}) => {
        setSearchTerm(newValue);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchResult(null);
        setShowResult(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/search?searchTerm=${searchTerm}`);
            const data = await response.json();

            setSearchResult(data);
            setShowResult(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const inputProps = {
        placeholder: 'Suchbegriff',
        value: searchTerm,
        onChange: handleInputChange
    };

    return (
        <div className="container-fluid d-flex flex-column min-vh-100 gradient-background">
            <div className="text-center d-flex flex-column align-items-center mt-25">
                <div className="book-icon">
                    <FaBook className="icon-size"/>
                </div>
                <h1 className="mb-4 mt-2">Einfach Verstehen</h1>
                <form id="searchForm" className="max-width-600" onSubmit={handleSubmit}>
                    <div className="input-group mb-3 rounded-pill position-relative">
                        <Autosuggest
                            suggestions={suggestionsList}
                            onSuggestionsFetchRequested={({value}) => {
                                fetch(`/api/suggestions?searchTerm=${value}`)
                                    .then(response => response.json())
                                    .then(data => setSuggestionsList(data))
                                    .catch(error => {
                                        console.error('Fehler beim Abrufen der Vorschläge:', error);
                                        setSuggestionsList([]);
                                    });
                            }}
                            onSuggestionSelected={(event, {suggestion}) => {
                                setSearchTerm(suggestion);
                                submitButtonRef.current.click(); // TODO: Beim Anklicken wird das hier nicht richtig ausgelöst
                            }}
                            onSuggestionsClearRequested={() => setSuggestionsList([])}
                            getSuggestionValue={suggestion => suggestion}
                            renderSuggestion={suggestion => <div>{suggestion}</div>}
                            inputProps={inputProps}
                            theme={{
                                container: 'autosuggest max-width-600',
                                input: 'form-control glowing-border input-bg',
                                suggestionsContainer: 'dropdown',
                                suggestionsList: `dropdown-menu show max-width-600 input-bg`,
                                suggestion: 'dropdown-item',
                                suggestionHighlighted: 'active'
                            }}
                        />
                        {searchTerm &&
                            <button type="button" onClick={handleClearSearch} className="btn bg-transparent clear-btn">
                                <FaTimes className="sm-icon-size"/>
                            </button>}
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="input-group w-auto">
                            <button ref={submitButtonRef} type="submit"
                                    className="btn btn-col btn-primary rounded-pill mr-3 btn-3">
                                Suchen
                            </button>
                            <button
                                type="button"
                                onClick={handleRandomArticle}
                                className="btn btn-col btn-primary rounded-pill btn-3"
                            >
                                Zufälliger Artikel
                            </button>
                        </div>
                    </div>

                </form>

            </div>
            {loading ? (
                <div className="d-flex justify-content-center loading-container mt-5">
                    <div className="spinner-border text-black" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                showResult && (
                    <div className="d-flex justify-content-center">
                        <div className="card my-3 rounded max-width-1300 output-bg animate__animated animate__fadeInUp">
                            <div className="card-header d-flex align-items-center justify-content-between">
                                <h5 className="mb-0">Suchergebnis</h5>
                                <div className="d-flex">
                                    <label className="form-check-label mx-3 switch-label" htmlFor="customSwitch">
                                        {checked ? "Einfache Sprache" : "Original"}
                                    </label>
                                    <div className="form-check form-switch d-flex align-self-center">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="customSwitch"
                                            checked={checked}
                                            onChange={handleSwitchChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {checked ?
                                    <div dangerouslySetInnerHTML={{__html: searchResult.simple}}/>

                                    : <div dangerouslySetInnerHTML={{__html: searchResult.original}}/>}
                            </div>
                        </div>

                    </div>
                )
            )}

            <footer className="footer text-center mt-auto bg-dark rounded-top p-1">
                <a className="text-decoration-none text-secondary" href="#" onClick={() => setShowFooter(true)}>
                    Impressum
                </a>

                {showFooter && (
                    <div className="modal custom-modal" onClick={() => setShowFooter(false)} tabIndex="-1" role="dialog"
                         style={{display: 'block'}}>
                        <div
                            className="modal-dialog modal-dialog-centered"
                            role="document"
                        >
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Impressum</h5>
                                </div>
                                <div className="modal-body">
                                    <h5>Verantwortlich für den Inhalt:</h5>
                                    <p>Arne Schaumburg</p>
                                    <p>Kontakt: arne.schaumburg@ovgu.de</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary"
                                            onClick={() => setShowFooter(false)}>
                                        Schließen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </footer>
        </div>

    );
};

export default IndexPage;

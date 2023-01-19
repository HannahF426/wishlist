// Imports
// --------------------------------
import React, { useState, useEffect } from 'react';
import { Header, Main, Item, Modal } from './styles';


// Render
// --------------------------------
export default () => {
    const [items, setItems] = useState([
        {
            name:
                "CASOFU Burritos Blanket, Giant Flour Tortilla Throw Blanket, Novelty Tortilla Blanket for Your Family, Soft and Comfortable Flannel Taco Blanket for Kids. (Burrito-a, 60inches)",
            url:
                "/CASOFU-Tortilla-Comfortable-Burrito-60inches/dp/B07QTHK8K9/ref=sr_1_1?dchild=1&keywords=burrito+blanket&qid=1586045729&sr=8-1",
            image:
                "https://m.media-amazon.com/images/I/811OenUrCyL._AC_UL320_ML3_.jpg",
            price: "19.94",
        },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [timeoutState, setTimeoutState] = useState(null);
    const [fetching, setFetching] = useState(false);
    const onClickToggleModal = () => {
        setShowModal(!showModal);
        setSearchResults([]);
        setSearch('');
    }
    const httpRequest = (query) => {
        fetch(`http://localhost:5000/search?q=${query}`)
            .then((response) => {
                const json = response.json();
                if (response.ok) {
                    return json;
                }
                return Promise.reject("Something went wrong.");
            })
            .then((json) => {
                setSearchResults(json.data);
                setFetching(false);
            })
            .catch((e) => {
                console.log("e", e);
                setFetching(false);
            });
    };
    const onChangeSearch = event => {
        setSearch(event.target.value);
    };
    const onKeyUpSearch = event => {
        if (search && search.length > 0) {
            clearTimeout(timeoutState);
            setTimeoutState(setTimeout(() => {
                httpRequest(search)
                setFetching(true);
            }, 500));
        }
    };

    const addItem = item => _event => {
        setItems([...items, item]);
        localStorage.setItem('myItems', JSON.stringify([...items, item]));
    }

    const deleteItem = k => () => {
        const newItems = [...items.slice(0, k), ...items.slice(k + 1)]
        setItems(newItems);
        localStorage.setItem('myItems', JSON.stringify(newItems));
    }

    useEffect(() => {
        setItems(JSON.parse(localStorage.getItem('myItems')) || []);
    }, []);

    return (
        <div>
            <Header
                background="https://wallpapers.net/web/wallpapers/free-download-hd-lovers-in-fantasy-world-wallpaper/1500x500.jpg">
                <div>
                    <a href="https://github.com/HannahF426">
                        <img alt="hannahfarrell"
                             src="https://avatars.githubusercontent.com/u/90870416?v=4"/>
                        <h1>Lets build a wishlist!</h1>
                        <p>Personal Wishlist</p>
                    </a>
                </div>
                <button onClick={onClickToggleModal}>Add Item</button>
            </Header>
            <Main>
                {items && items.length > 0
                    ? <section>
                        {items.map((i, k) => <Item key={`Item-${k}`}>
                            <dl>
                                <dt>...</dt>
                                <dd onClick={deleteItem(k)}>Delete</dd>
                            </dl>
                            <span>${i.price}</span>
                            <div><img alt={i.name} src={i.image} /></div>
                            <h3>{i.name}</h3>
                            <a href={`https://www.amazon.com${i.url}`} target="_blank" rel="noopener noreferrer">View On Amazon</a>
                        </Item>)}
                    </section>
                    : <section><p>No items yet<br/><span onClick={onClickToggleModal}>Start By Adding An Item</span></p></section>}
            </Main>

            <Modal show={showModal}>
                <div>
                    <button onClick={onClickToggleModal}>&times;</button>
                    <h1>Add Item</h1>
                    <input
                        disabled={fetching}
                        type="search"
                        value={search}
                        onChange={onChangeSearch}
                        onKeyUp={onKeyUpSearch}
                        placeholder="Search for products"
                    />
                    <section>
                        {fetching && (
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="38"
                                    height="38"
                                    viewBox="0 0 38 38"
                                    stroke="#666666"
                                >
                                    <g fill="none">
                                        <g transform="translate(1 1)" strokeWidth="2">
                                            <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                                            <path
                                                d="M36 18c0-9.94-8.06-18-18-18"
                                                transform="rotate(277.527 18 18)"
                                            >
                                                <animateTransform
                                                    attributeName="transform"
                                                    type="rotate"
                                                    from="0 18 18"
                                                    to="360 18 18"
                                                    dur="1s"
                                                    repeatCount="indefinite"
                                                />
                                            </path>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        )}
                        {!fetching &&
                            searchResults &&
                            searchResults.length > 0 &&
                            searchResults.map((i, k) => (
                                <article key={`items-${k}`}>
                                    <div>
                                        <img alt={i.name} src={i.image} />
                                    </div>
                                    <h3>{i.name}</h3>
                                    <span>${i.price}</span>
                                    <button onClick={addItem(i)}>+</button>
                                </article>
                            ))}
                    </section>
                </div>
            </Modal>

        </div>);
};


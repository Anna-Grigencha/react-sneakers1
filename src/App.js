import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';


function App() {

  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);


  React.useEffect(() => {

    axios.get('https://64ef46be219b3e2873c43e2f.mockapi.io/items').then((res) => {
      setItems(res.data);
    });

    axios.get('https://64ef46be219b3e2873c43e2f.mockapi.io/cart').then((res) => {
      setCartItems(res.data);
    });

    axios.get('https://64f972144098a7f2fc14645e.mockapi.io/favorites').then((res) => {
      setFavorites(res.data);
    });
  }, []);

  const onAddToCart = (obj) => {

    axios.post('https://64ef46be219b3e2873c43e2f.mockapi.io/cart', obj)
    setCartItems(prev => [...prev, obj]);
  };

  const onRemoveItem = (id) => {
    axios.delete(`https://64ef46be219b3e2873c43e2f.mockapi.io/cart/${id}`)
    setCartItems(prev => prev.filter(item => item.id !== id));
  }

  const onChangeSearchValue = (event) => {
    setSearchValue(event.target.value);
  }

  const onAddToFavorite = async (obj) => {

    if (favorites.find((favObj) => favObj.id === obj.id)) {
      axios.delete(`https://64f972144098a7f2fc14645e.mockapi.io/favorites/${obj.id}`);
    } else {
      const { data } = await axios.post('https://64f972144098a7f2fc14645e.mockapi.io/favorites', obj)
      setFavorites(prev => [...prev, data]);
    }
  }

  return (
    <div className="wrapper clear">

      {cartOpened ? <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} /> : null}

      <Header onClickCart={() => setCartOpened(true)} />


      <Routes>
        <Route path="/" exact element={<Home   //если путь path="/", то рендерим Home
          items={items}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onChangeSearchValue={onChangeSearchValue}
          onAddToFavorite={onAddToFavorite}
          onAddToCart={onAddToCart}
        />} />
      </Routes>

      <Routes>
        <Route path="/favorites" exact element={<Favorites
          items={favorites}
          onAddToFavorite={onAddToFavorite}     //в свойство передаем favorites

        />} />
      </Routes>
    </div>
  );
}

export default App;

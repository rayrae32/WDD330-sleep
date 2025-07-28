import { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Charger depuis localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    useEffect(() => {
        // Sauvegarder dans localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (animal) => {
        if (!favorites.some(fav => fav.id === animal.id)) {
            setFavorites([...favorites, animal]);
        }
    };

    const removeFavorite = (animalId) => {
        setFavorites(favorites.filter(animal => animal.id !== animalId));
    };

    const isFavorite = (animalId) => {
        return favorites.some(animal => animal.id === animalId);
    };

    return (
        <FavoritesContext.Provider
            value={{ favorites, addFavorite, removeFavorite, isFavorite }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
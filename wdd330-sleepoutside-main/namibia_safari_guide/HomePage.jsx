import { useEffect, useState } from 'react';
import AnimalCard from '../components/AnimalCard';

const HomePage = () => {
    const [featuredAnimals, setFeaturedAnimals] = useState([]);

    useEffect(() => {
        // Récupérer les animaux vedettes depuis l'API
        const fetchAnimals = async () => {
            try {
                const response = await axios.get('https://api.example.com/animals/featured');
                setFeaturedAnimals(response.data);
            } catch (error) {
                console.error('Error fetching animals:', error);
            }
        };

        fetchAnimals();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-poppins font-bold text-primary mb-8">
                Namibia Safari Guide
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredAnimals.map(animal => (
                    <AnimalCard key={animal.id} animal={animal} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
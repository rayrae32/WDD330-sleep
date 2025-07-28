import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AnimalDetailPage = () => {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [localName, setLocalName] = useState('');

    useEffect(() => {
        const fetchAnimalData = async () => {
            try {
                // Récupérer les données de base
                const animalRes = await axios.get(`https://api.example.com/animals/${id}`);
                setAnimal(animalRes.data);

                // Récupérer le nom local
                const nameRes = await axios.get(`https://api.example.com/languages/${id}`);
                setLocalName(nameRes.data.oshivambo);
            } catch (error) {
                console.error('Error fetching animal data:', error);
            }
        };

        fetchAnimalData();
    }, [id]);

    if (!animal) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                    <img
                        src={animal.image}
                        alt={animal.name}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                </div>

                <div className="md:w-2/3">
                    <h1 className="text-3xl font-poppins font-bold text-primary">
                        {animal.name}
                    </h1>
                    <p className="text-secondary text-xl mt-2">
                        {localName || 'Nom local non disponible'}
                    </p>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-gray-700">{animal.description}</p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Habitat</h2>
                        <p>{animal.habitat}</p>
                    </div>

                    <button className="mt-6 bg-primary text-white px-4 py-2 rounded-lg">
                        Ajouter aux favoris
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnimalDetailPage;
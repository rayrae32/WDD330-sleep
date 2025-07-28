import { useState, useEffect } from 'react';
import { loadGoogleMaps, calculateDistance } from '../services/mapsService';

const DistanceCalculator = () => {
    const [parks, setParks] = useState([]);
    const [fromPark, setFromPark] = useState('');
    const [toPark, setToPark] = useState('');
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Charger les parcs depuis l'API
        const fetchParks = async () => {
            try {
                const response = await axios.get('https://api.example.com/parks');
                setParks(response.data);
                if (response.data.length > 1) {
                    setFromPark(response.data[0].id);
                    setToPark(response.data[1].id);
                }
            } catch (error) {
                console.error('Error fetching parks:', error);
            }
        };

        fetchParks();
        loadGoogleMaps();
    }, []);

    const handleCalculate = async () => {
        if (!fromPark || !toPark) return;

        setLoading(true);
        try {
            const from = parks.find(p => p.id === fromPark);
            const to = parks.find(p => p.id === toPark);

            const result = await calculateDistance(from.location, to.location);

            if (result) {
                setDistance(result.distance.text);
                setDuration(result.duration.text);
            }
        } catch (error) {
            console.error('Error calculating distance:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Calculateur de distance entre parcs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-1">De :</label>
                    <select
                        value={fromPark}
                        onChange={(e) => setFromPark(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {parks.map(park => (
                            <option key={park.id} value={park.id}>
                                {park.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">À :</label>
                    <select
                        value={toPark}
                        onChange={(e) => setToPark(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {parks.map(park => (
                            <option key={park.id} value={park.id}>
                                {park.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={handleCalculate}
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
            >
                {loading ? 'Calcul en cours...' : 'Calculer la distance'}
            </button>

            {distance && duration && (
                <div className="mt-4 p-4 bg-white rounded shadow">
                    <p><strong>Distance :</strong> {distance}</p>
                    <p><strong>Durée estimée :</strong> {duration}</p>
                </div>
            )}
        </div>
    );
};

export default DistanceCalculator;
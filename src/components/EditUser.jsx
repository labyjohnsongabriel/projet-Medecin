import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function EditMedecin() {
    const navigate = useNavigate();
    const { NomMed} = useParams();
    const [inputs, setInputs] = useState({
        NomMed: '',
        Nbr_jours: '',
        Taux_journalier: ''
    });
    const [error, setError] = useState(null);

  
    useEffect(() => {
        
        axios.get(`http://localhost:8888/api/medecin/${NomMed}`)
            .then(response => {
                if (response.data) {
                    setInputs(response.data);
                } else {
                    setError('Médecin non trouvé.');
                }
            })
            .catch(err => {
                console.error('Erreur lors de la récupération des données:', err);
                setError('Erreur lors de la récupération des données.');
            });
    }, [NomMed]);


    
    const getUser = async () => {
        try {
            const response = await axios.get(`http://localhost:8888/api/user/${NomMed}`);
            console.log(response.data);
            setInputs(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
            setError('Erreur lors de la récupération des détails de l\'utilisateur.');
        }
    };

   
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevState => ({ ...prevState, [name]: value }));
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8888/api/user/${NomMed}`, inputs);
            console.log(response.data);

        
            if (response.data && response.data.status === 1) {
                navigate('/');
            } else {
                setError('Échec de la mise à jour de l\'enregistrement.');
            }
        } catch (error) {
            console.error('Erreur lors de la requête PUT:', error);
            setError('Erreur lors de l\'envoi de la requête. Veuillez réessayer.');
        }
    };

    return (
        <div className="container-flux">
            <h1 className="mb-4">Modifier Médecin</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="NomMed" className="form-label">Nom:</label>
                    <input
                        type="text"
                        id="NomMed"
                        name="NomMed"
                        value={inputs.NomMed}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Nbr_jours" className="form-label">Nombre de jours:</label>
                    <input
                        type="number"
                        id="Nbr_jours"
                        name="Nbr_jours"
                        value={inputs.Nbr_jours}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Taux_journalier" className="form-label">Taux journalier:</label>
                    <input
                        type="number"
                        id="Taux_journalier"
                        name="Taux_journalier"
                        value={inputs.Taux_journalier}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Enregistrer</button>
            </form>
        </div>
    );
        
}

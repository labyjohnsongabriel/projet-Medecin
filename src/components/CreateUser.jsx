import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateMedecin() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        NomMed: '',
        Nbr_jours: '',
        Taux_journalier: ''
    });
    const [error, setError] = useState(null);

    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevState => ({ ...prevState, [name]: value }));
    };

    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!inputs.NomMed || !inputs.Nbr_jours || !inputs.Taux_journalier) {
            setError("Tous les champs sont requis.");
            return;
        }
    
       
        if (inputs.Nbr_jours <= 0 || inputs.Taux_journalier <= 0) {
            setError("Les valeurs de 'Nbr_jours' et 'Taux_journalier' doivent être des nombres positifs.");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8888/api/users/save', inputs);
    
           
            if (response.data && response.data.status === 1) {
               
                navigate('/');
            } else {

                setError('Échec de la création de l\'enregistrement.');
            }
        } catch (error) {
            console.error('Erreur lors de la requête POST:', error);
            setError('Erreur lors de l\'envoi de la requête. Veuillez réessayer.');
        }
    };
    
    

    return (
        <div className="container">
            <h1 className="mb-4">Créer Médecin</h1>
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
                <button type="submit" className="btn btn-primary">Ajouter</button>
            </form>
        </div>
    );
}

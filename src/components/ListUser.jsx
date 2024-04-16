import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart } from 'chart.js/auto';

function ListUser() {
    const [users, setUsers] = useState([]);
    const apiBaseUrl = 'http://localhost:8888/api';
    const navigate = useNavigate(); // Ajout de la navigation

    useEffect(() => {
        getUsers();
    }, []);

    // Fonction pour obtenir la liste des utilisateurs
    const getUsers = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/user`);
            console.log(response.data);
            setUsers(response.data);
            drawHistogram(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des médecins :', error);
        }
    };

    // Fonction pour supprimer un utilisateur
    const deleteUser = async (NomMed) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
            try {
                
                const response = await axios.delete(`${apiBaseUrl}/users/delete/${NomMed}`);
                console.log(response.data);

                
                if (response.data && response.data.status === 1) {
                    getUsers(); 
                } else {
                    console.error('Échec de la suppression de l\'enregistrement.');
                }
            } catch (error) {
                console.error('Erreur lors de la requête DELETE:', error);
            }
        }
    };

    const calculerPrestation = (nombreJours, tauxJournalier) => {
        return nombreJours * tauxJournalier;
    };

    const drawHistogram = (usersData) => {
        const prestations = usersData.map(user => calculerPrestation(user.Nbr_jours, user.Taux_journalier));
        const ctx = document.getElementById('histogram').getContext('2d');
        
        // Vérifiez si un graphique existe déjà et détruisez-le
        if (window.histogramChart) {
            window.histogramChart.destroy();
        }

        // Créer un nouveau graphique à barres
        window.histogramChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Prestation Minimale', 'Prestation Maximale'],
                datasets: [{
                    label: 'Prestation',
                    data: [Math.min(...prestations), Math.max(...prestations)],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return (
        <div className="container">
            <h1 className="text-primary">Liste des Médecins</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nom</th>
                        <th>Nombre de jours</th>
                        <th>Taux journalier</th>
                        <th>Prestation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.NomMed}>
                            <td>{index + 1}</td>
                            <td>{user.NomMed}</td>
                            <td>{user.Nbr_jours}</td>
                            <td>{user.Taux_journalier}</td>
                            <td>{calculerPrestation(user.Nbr_jours, user.Taux_journalier)}</td>
                            <td>
                                <Link to={`/user/${user.NomMed}/edit`} style={{ marginRight: "10px" }} className="btn btn-success">Éditer</Link>
                                <button className="btn btn-danger" onClick={() => deleteUser(user.NomMed)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Histogramme des Prestations</h2>
            <canvas id="histogram"></canvas>
        </div>
    );
}

export default ListUser;

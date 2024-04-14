import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart } from 'chart.js/auto';

function ListUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    function getUsers() {
        axios.get('http://localhost:8888/api/user/')
            .then(function(response) {
                console.log(response.data);
                setUsers(response.data);
                drawHistogram(response.data);
            })
            .catch(function(error) {
                console.error('Erreur lors de la récupération des utilisateurs :', error);
            });
    }

    const deleteUser = (id) => {
        axios.delete(`http://localhost:8888/api/user/${id}/delete`)
            .then(function(response) {
                console.log(response.data);
                getUsers();
            })
            .catch(function(error) {
                console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            });
    }

    const calculerPrestation = (nombreJours, tauxJournalier) => {
        return nombreJours * tauxJournalier;
    }

    const drawHistogram = (usersData) => {
        const prestations = usersData.map(user => calculerPrestation(user.Nbr_jours, user.Taux_jounalier));
        const ctx = document.getElementById('histogram').getContext('2d');
        const histogram = new Chart(ctx, {
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
    }

    return (
        <div>
            <h1>Liste des Médecins</h1>
            <table className="table">
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
                    {users.map((user, key) => (
                        <tr key={key}>
                            <td>{user.id}</td>
                            <td>{user.NomMed}</td>
                            <td>{user.Nbr_jours}</td>
                            <td>{user.Taux_journalier}</td>
                            <td>{calculerPrestation(user.Nbr_jours, user.Taux_journalier)}</td>
                            <td>
                                <Link to={`user/${user.id}/edit`} style={{marginRight: "10px"}} className="btn btn-success">Edit</Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <canvas id="histogram"></canvas>
        </div>
    );
}

export default ListUser;

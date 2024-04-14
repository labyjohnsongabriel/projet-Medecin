import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons'


export default function ListUser() {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const {id} = useParams();

    useEffect(() => {
        getUser();
    }, []);

    function getUser() {
        axios.get(`http://localhost:8888/api/user/${id}`).then(function(response) {
            console.log(response.data);
            setInputs(response.data);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.put(`http://localhost:8888/api/user')
        /${id}/save`, inputs).then(function(response){
            console.log(response.data);
            navigate('/');
        });
        
    }
    return (
        <div>
            <h1>Edit Medecin</h1>
            <form onSubmit={handleSubmit}>
                <table cellSpacing="10" >
                    <tbody>
                        <tr>
                            <th>
                                <label>Nom: </label> 
                            </th>
                            <td>
                                <input value={inputs.NomMed} type="text" name="name" onChange={handleChange} className="form-control"/> 
                            </td>
                        </tr>  <br />
                        <tr>
                            <th>
                                <label>Nombre de jours: </label> 
                            </th>
                            <td> 
                                <input value={inputs.Nbr_jours} type="number" name="email" onChange={handleChange} className="form-control" /> 
                            </td>
                        </tr><br />
                        <tr>
                            <th>
                                <label>Taux journalier: </label> 
                            </th>
                            <td>
                                <input value={inputs.Taux_journalier} type="number" name="mobile" onChange={handleChange} className="form-control"/> 
                            </td>
                        </tr>  <br />

                        <tr>
                            <td colSpan="2" align ="right">
                                <button className="btn btn-success">save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

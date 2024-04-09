import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function ListUser() {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8888/api/users/save', inputs).then(function(response){
            console.log(response.data);
            navigate('/');
        });
        
    }
    return (
        <div className="ko"> 
            <h1>Create Medecin</h1>
            <form onSubmit={handleSubmit}>
                <table cellSpacing="10">
                    <tbody>
                        <tr>
                            <th>
                                <label>Nom: </label>
                            </th>
                            <td>
                                <input type="text" name="name" onChange={handleChange} className="form-control"/>
                            </td>
                        </tr>  <br />
                        <tr>
                            <th>
                                <label>Nombre de jours: </label>
                            </th>
                            <td> 
                                <input type="number" name="email" onChange={handleChange} className="form-control" />
                            </td>
                        </tr>  <br />
                        <tr>
                            <th>
                                <label>Taux journalier: </label>
                            </th>
                            <td>
                                <input type="number" name="mobile" onChange={handleChange} className="form-control"/>
                            </td>
                        </tr>  <br />

                        <tr>
                            <td colSpan="2" align ="right">
                                <button className="btn btn-primary">Save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

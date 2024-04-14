<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
    case "GET":
        $sql = "SELECT * FROM medicin";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $users = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($users);
        break;
    case "POST":
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if($path[1] == "api" && $path[2] =="users" &&$path[3] =="save"){
            $user = json_decode( file_get_contents('php://input') );
            $user->Nbr_jours = (int) $user->Nbr_jours;
            $user->Taux_journalier = (int) $user->Taux_journalier;
            $Prestation = $user->Nbr_jours * $user->Taux_journalier;
        $sql = "INSERT INTO medicin(NomMed, Nbr_jours, Taux_journalier, Prestation) VALUES(:NomMed, :Nbr_jours, :Taux_journalier, :Prestation)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':NomMed', $user->NomMed);
        $stmt->bindParam(':Nbr_jours', $user->Nbr_jours);
        $stmt->bindParam(':Taux_journalier', $user->Taux_journalier);
        $stmt->bindParam(':Prestation', $Prestation);


        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
            echo json_encode($response);
        }
        break;

    case "PUT":
        $user = json_decode( file_get_contents('php://input') );
        $sql = "UPDATE medicin SET NomMed = :NomMed, Nbr_jours = :Nbr_jours, Taux_journalier = :Taux_journalier, Prestation = :Prestation WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $user->id);
        $stmt->bindParam(':NomMed', $user->NomMed);
        $stmt->bindParam(':Nbr_jours', $user->Nbr_jours);
        $stmt->bindParam(':Taux_journalier', $user->Taux_journalier);
        $stmt->bindParam(':Prestation', $user->Prestation);
        

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case "DELETE":
        $sql = "DELETE FROM medicin WHERE id = :id";
        $path = explode('/', $_SERVER['REQUEST_URI']);

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $path[3]);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
}
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Définir les en-têtes CORS de manière plus spécifique
header("Access-Control-Allow-Origin: http://localhost:3000"); // Autorisez uniquement localhost:3000
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

switch($method) {
    case "GET":
        if (isset($path[2]) && is_numeric($path[2])) {
         
            $sql = "SELECT * FROM medicin WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[2], PDO::PARAM_INT);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($user);
        } else {
           
            $sql = "SELECT * FROM medicin";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($users);
        }
        break;
        case "POST":
            var_dump($path[1] === "users" && $path[2] === "save");
            if ($path[1] === "users" && $path[2] === "save") {
                $user = json_decode(file_get_contents('php://input'), true);
                
                if (!$user) {
                    echo json_encode(['status' => 0, 'message' => 'Invalid JSON input.']);
                    exit();
                }
        
              
                $Prestation = $user['Nbr_jours'] * $user['Taux_journalier'];
        
                $sql_check = "SELECT COUNT(*) FROM medicin WHERE NomMed = :NomMed";
                $stmt_check = $conn->prepare($sql_check);
                $stmt_check->bindValue(':NomMed', $user['NomMed'], PDO::PARAM_STR);
                $stmt_check->execute();
        
                $duplicate_count = $stmt_check->fetchColumn();
        
                if ($duplicate_count > 0) {
                    echo json_encode(['status' => 0, 'message' => 'Duplicate entry for NomMed.']);
                    exit();
                }
                
                
                $sql = "INSERT INTO medicin (NomMed, Nbr_jours, Taux_journalier, Prestation) 
                        VALUES (:NomMed, :Nbr_jours, :Taux_journalier, :Prestation)";
                $stmt = $conn->prepare($sql);
                $stmt->bindValue(':NomMed', $user['NomMed'], PDO::PARAM_STR);
                $stmt->bindValue(':Nbr_jours', (int)$user['Nbr_jours'], PDO::PARAM_INT);
                $stmt->bindValue(':Taux_journalier', (int)$user['Taux_journalier'], PDO::PARAM_INT);
                $stmt->bindValue(':Prestation', (float)$Prestation, PDO::PARAM_STR);
                
                try {
                    $executionResult = $stmt->execute();
                    
                    if ($executionResult) {
                        echo json_encode(['status' => 1, 'message' => 'Record inserted successfully.']);
                    } else {
                        echo json_encode(['status' => 0, 'message' => 'Failed to insert record.']);
                    }
                } catch (PDOException $e) {
                    echo json_encode(['status' => 0, 'message' => 'Error inserting record: ' . $e->getMessage()]);
                }
            } else {
                echo json_encode(['status' => 0, 'message' => 'Invalid endpoint for POST request.']);
            }
            break;
        
            case "PUT":
                
                if ($path[1] === "user" && isset($path[2]) && is_string($path[2])) {
                  
                    $NomMed = $path[2];
                    
                    // Décoder le JSON de la requête
                    $user = json_decode(file_get_contents('php://input'), true);
                    
                  
                    $Prestation = $user['Nbr_jours'] * $user['Taux_journalier'];
                    
                    
                    $sql = "UPDATE medicin SET NomMed = :NomMed, Nbr_jours = :Nbr_jours, Taux_journalier = :Taux_journalier, Prestation = :Prestation WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':NomMed', $user['NomMed'], PDO::PARAM_STR);
                    $stmt->bindParam(':Nbr_jours', (int)$user['Nbr_jours'], PDO::PARAM_INT);
                    $stmt->bindParam(':Taux_journalier', (int)$user['Taux_journalier'], PDO::PARAM_INT);
                    $stmt->bindParam(':Prestation', (float)$Prestation, PDO::PARAM_STR);
                    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                    
                    // Exécuter la requête
                    try {
                        if ($stmt->execute()) {
                            echo json_encode(['status' => 1, 'message' => 'Record updated successfully.']);
                        } else {
                            echo json_encode(['status' => 0, 'message' => 'Failed to update record.']);
                        }
                    } catch (PDOException $e) {
                        echo json_encode(['status' => 0, 'message' => 'Error updating record: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['status' => 0, 'message' => 'Invalid endpoint for PUT request.']);
                }
                break;
            
        case "DELETE":
            if ($path[1] === "users" && $path[2] === "delete" && isset($path[3]) && is_string($path[3])) {
               
                $NomMed = $path[3];
                
                
                $checkSql = "SELECT COUNT(*) FROM medicin WHERE NomMed = :NomMed";
                $checkStmt = $conn->prepare($checkSql);
                $checkStmt->bindParam(':NomMed', $NomMed, PDO::PARAM_STR);
                $checkStmt->execute();
                $count = $checkStmt->fetchColumn();
        
                
                if ($count > 0) {
                    $sql = "DELETE FROM medicin WHERE NomMed = :NomMed";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':NomMed', $NomMed, PDO::PARAM_STR);
        
                    try {
                      
                        if ($stmt->execute()) {
                            echo json_encode(['status' => 1, 'message' => 'Record deleted successfully.']);
                        } else {
                            echo json_encode(['status' => 0, 'message' => 'Failed to delete record.']);
                        }
                    } catch (PDOException $e) {
                     
                        echo json_encode(['status' => 0, 'message' => 'Error deleting record: ' . $e->getMessage()]);
                    }
                } else {
                   
                    echo json_encode(['status' => 0, 'message' => 'Record not found.']);
                }
            } 

            break;
        
        
}

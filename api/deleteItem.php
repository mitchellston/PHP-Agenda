<?php
use dbHandler\CompareMethods;
use dbHandler\PropertyTypes;
use FormValidation\Attributes;
use FormValidation\Methods;
use FormValidation\Types;
use FormValidation\Validation;

try {
    require_once "./loggedinConfig.php";
    $id = new Validation(
        "ID", Methods::POST, Types::NUMBER,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een agenda item geselecteerd zijn!"]
        ]
    );
    if (count($id->getErrors()) > 0) {
        echo json_encode(["Success" => false, "error" => ["title" => "POST", "message" => $id->getErrors()[0]]]);
        exit;
    }
    $result = $databaseConnection->delete(
        "Items",
        [
            ["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $id->getValue(), "type" => PropertyTypes::int]],
            ["column" => "User", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
        ]
    );
    if ($result == false) {
        echo json_encode(["Success" => false, "error" => ["title" => "DELETE", "message" => "Het verwijderen is niet gelukt"]]);
        exit;
    }
    echo json_encode(["Success" => true]);

} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
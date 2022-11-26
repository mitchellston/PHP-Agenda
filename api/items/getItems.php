<?php
use dbHandler\CompareMethods;
use dbHandler\PropertyTypes;
use FormValidation\Attributes;
use FormValidation\Methods;
use FormValidation\Types;
use FormValidation\Validation;

try {
    require_once "../config.php";
    require_once "../loggedinConfig.php";
    $id = new Validation(
        "ID", Methods::POST, Types::NUMBER,
        [
            Attributes::min => ["value" => 0, "errorMessage" => "Het ID kan niet kleiner dan 0 zijn!"]
        ]
    );
    if (count($id->getErrors()) > 0) {
        echo json_encode(["Success" => false, "error" => ["title" => "POST", "message" => $id->getErrors()[0]]]);
        exit;
    }
    $WHERE = [
        ["column" => "User", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
    ];
    if ($id->getValue() != "") {
        array_push($WHERE, ["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $id->getValue(), "type" => PropertyTypes::int]]);
    }
    $result = $databaseConnection->select(["ID", "Subject", "Content", "BeginDate", "EndDate", "Priority", "Status"], "items", $WHERE);
    if ($result == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NO RESULTS", "message" => "Er zijn geen items gevonden!"]]);
        exit;
    }
    echo json_encode(["Success" => true, "data" => $result]);
} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
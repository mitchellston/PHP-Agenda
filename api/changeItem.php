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
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een agenda item geselecteerd zijn!"],
        ]
    );
    $subject = new Validation(
        "subject", Methods::POST, Types::TEXT,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een onderwerp zijn!"],
            Attributes::maxLength => ["value" => 30, "errorMessage" => "Het onderwerp mag maximaal 30 karakters zijn!"]
        ]
    );
    $content = new Validation(
        "subject", Methods::POST, Types::TEXT,
        []
    );
    $beginDate = new Validation(
        "beginDate", Methods::POST, Types::DATE,
        []
    );
    $endDate = new Validation(
        "endDate", Methods::POST, Types::DATE,
        []
    );
    $priority = new Validation(
        "priority", Methods::POST, Types::NUMBER,
        [
            Attributes::min => ["value" => 0, "errorMessage" => "De priority moet tussen de 1 en 5 zijn!"],
            Attributes::max => ["value" => 6, "errorMessage" => "De priority moet tussen de 1 en 5 zijn!"]
        ]
    );
    $status = new Validation(
        "status", Methods::POST, Types::NUMBER,
        [
            Attributes::pattern => ["value" => "/(?=.*?[nbaNBA]).{0,}/", "errorMessage" => "De status moet 'n', 'b' of 'a' zijn!"]
        ]
    );
    $errors = array_merge($id->getErrors(), $subject->getErrors(), $content->getErrors(), $beginDate->getErrors(), $endDate->getErrors(), $priority->getErrors(), $status->getErrors());
    if (count($errors) > 0) {
        echo json_encode(["Success" => false, "error" => ["title" => "POST", "message" => $errors[0]]]);
        exit;
    }
    $toBeChanged = [
        ["column" => "Subject", "value" => ["value" => $subject->getValue(), "type" => PropertyTypes::string]],
        ["column" => "User", "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
    ];
    if ($content->getValue() != "") {
        array_push($toBeChanged, ["column" => "Content", "value" => ["value" => $content->getValue(), "type" => PropertyTypes::string]]);
    }
    if ($beginDate->getValue() != "") {
        array_push($toBeChanged, ["column" => "BeginDate", "value" => ["value" => $beginDate->getValue(), "type" => PropertyTypes::string]]);
    }
    if ($endDate->getValue() != "") {
        array_push($toBeChanged, ["column" => "BeginDate", "value" => ["value" => $endDate->getValue(), "type" => PropertyTypes::string]]);
    }
    if ($priority->getValue() != "") {
        array_push($toBeChanged, ["column" => "BeginDate", "value" => ["value" => $priority->getValue(), "type" => PropertyTypes::int]]);
    }
    if ($status->getValue() != "") {
        array_push($toBeChanged, ["column" => "BeginDate", "value" => ["value" => strtolower($status->getValue()), "type" => PropertyTypes::string]]);
    }

    $result = $databaseConnection->update(
        "items",
        $toBeChanged,
        [
            ["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $id->getValue(), "type" => PropertyTypes::int]],
            ["column" => "User", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
        ]
    );
    if ($result == false) {
        echo json_encode(["Success" => false, "error" => ["title" => "UPDATE", "message" => "Het bewerken is niet gelukt"]]);
        exit;
    }
    echo json_encode(["Success" => true]);

} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
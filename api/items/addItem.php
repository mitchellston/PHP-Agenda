<?php
use dbHandler\PropertyTypes;
use FormValidation\Attributes;
use FormValidation\Methods;
use FormValidation\Types;
use FormValidation\Validation;

try {
    require_once "../config.php";
    require_once "../loggedinConfig.php";
    $subject = new Validation(
        "subject", Methods::POST, Types::TEXT,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een onderwerp zijn!"],
            Attributes::maxLength => ["value" => 30, "errorMessage" => "Het onderwerp mag maximaal 30 karakters zijn!"]
        ]
    );
    $content = new Validation(
        "content", Methods::POST, Types::TEXT,
        []
    );
    $beginDate = new Validation(
        "beginDate", Methods::POST, Types::DATE,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een begin datum zijn!"],
        ]
    );
    $endDate = new Validation(
        "endDate", Methods::POST, Types::DATE,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een eind datum zijn!"],
        ]
    );
    $priority = new Validation(
        "priority", Methods::POST, Types::NUMBER,
        [
            Attributes::min => ["value" => 0, "errorMessage" => "De priority moet tussen de 1 en 5 zijn!"],
            Attributes::max => ["value" => 6, "errorMessage" => "De priority moet tussen de 1 en 5 zijn!"],
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een prioriteit zijn!"],
        ]
    );
    $status = new Validation(
        "status", Methods::POST, Types::TEXT,
        [
            Attributes::pattern => ["value" => "/(?=.*?[nbaNBA]).{0,}/", "errorMessage" => "De status moet 'n', 'b' of 'a' zijn!"],
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een status zijn!"],
        ]
    );
    $errors = array_merge($subject->getErrors(), $content->getErrors(), $beginDate->getErrors(), $endDate->getErrors(), $priority->getErrors(), $status->getErrors());
    if (count($errors) > 0) {
        echo json_encode(["Success" => false, "error" => ["title" => "POST", "message" => $errors[0]]]);
        exit;
    }
    $toBeInserted = [
        ["column" => "Subject", "value" => ["value" => $subject->getValue(), "type" => PropertyTypes::string]],
        ["column" => "User", "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
    ];
    if ($content->getValue() != "") {
        array_push($toBeInserted, ["column" => "Content", "value" => ["value" => $content->getValue(), "type" => PropertyTypes::string]]);
    }
    if ($beginDate->getValue() != "") {
        array_push($toBeInserted, ["column" => "BeginDate", "value" => ["value" => $beginDate->getValue(), "type" => PropertyTypes::string]]);
    }
    if ($endDate->getValue() != "") {
        array_push($toBeInserted, ["column" => "EndDate", "value" => ["value" => $endDate->getValue(), "type" => PropertyTypes::string]]);
    }
    if ($priority->getValue() != "") {
        array_push($toBeInserted, ["column" => "Priority", "value" => ["value" => $priority->getValue(), "type" => PropertyTypes::int]]);
    }
    if ($status->getValue() != "") {
        array_push($toBeInserted, ["column" => "Status", "value" => ["value" => strtolower($status->getValue()), "type" => PropertyTypes::string]]);
    }
    $result = $databaseConnection->insert("items", $toBeInserted);
    if ($result == false) {
        echo json_encode(["Success" => false, "error" => ["title" => "INSERT", "message" => "Het toevoegen van het item is niet gelukt"]]);
        exit;
    }
    echo json_encode(["Success" => true]);

} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
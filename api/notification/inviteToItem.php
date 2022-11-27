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
    require_once "./automaticDelete.php";
    $email = new Validation(
        "email", Methods::POST, Types::EMAIL,
        [
            Attributes::required => ["column" => "", "errorMessage" => "Er moet een e-mailadres gegeven worden van de persoon die je wilt uitnodigen!"]
        ]
    );
    $item = new Validation(
        "item", Methods::POST, Types::NUMBER,
        [
            Attributes::required => ["column" => "", "errorMessage" => "Er moet een agenda item zijn!"]
        ]
    );
    $message = new Validation(
        "message", Methods::POST, Types::TEXT,
        [
            Attributes::maxLength => ["column" => 100, "errorMessage" => "Het bericht mag maximaal 100 karakters zijn!"]
        ]
    );
    $errors = array_merge($email->getErrors(), $item->getErrors(), $message->getErrors());
    if (count($errors) > 0) {
        echo json_encode(["Success" => false, "error" => ["title" => "POST", "message" => $errors[0]]]);
        exit;
    }
    $sendTo = $databaseConnection->select(["ID"], "users", [["column" => "Email", "method" => CompareMethods::equals, "value" => ["value" => $email->getValue(), "type" => PropertyTypes::string]]], null, 1);
    if ($sendTo == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NO RESULTS", "message" => "Er is geen gebruiker gevonden met het opgegeven e-mailadres! (vraag de persoon om een account aan te maken)"]]);
        exit;
    }
    if ($sendTo[0]["ID"] == $_SESSION["User"]) {
        echo json_encode(["Success" => false, "error" => ["title" => "NO RESULTS", "message" => "Je kan jezelf niet uitnodigen!"]]);
        exit;
    }
    $result = $databaseConnection->select(["ID"], "notifications", [
        ["column" => "ToUser", "method" => CompareMethods::equals, "value" => ["value" => $sendTo[0]["ID"], "type" => PropertyTypes::int]],
        ["column" => "Item", "method" => CompareMethods::equals, "value" => ["value" => $item->getValue(), "type" => PropertyTypes::int]]
    ], null, 1);
    if ($result != null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NO RESULTS", "message" => "Je hebt al een uitnodiging gestuurd voor dit agenda item!"]]);
        exit;
    }
    $result = $databaseConnection->select(["ID", "Subject"], "items", [["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $item->getValue(), "type" => PropertyTypes::int]], ["column" => "User", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]], null, 1);
    if ($result == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NO RESULTS", "message" => "We konden dit agenda item niet vinden in je agenda!"]]);
        exit;
    }

    $toBeInserted = [
        ["column" => "FromUser", "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]],
        ["column" => "ToUser", "value" => ["value" => $sendTo[0]["ID"], "type" => PropertyTypes::int]],
        ["column" => "Item", "method" => CompareMethods::equals, "value" => ["value" => $item->getValue(), "type" => PropertyTypes::int]]
    ];
    if ($message->getValue() != "") {
        array_push($toBeInserted, ["column" => "Message", "value" => ["value" => $message->getValue(), "type" => PropertyTypes::string]]);
    } else {
        array_push($toBeInserted, ["column" => "Message", "value" => ["value" => "Je hebt een uitnodiging voor: " . $result[0]["Subject"], "type" => PropertyTypes::string]]);
    }
    $result = $databaseConnection->insert("notifications", $toBeInserted);
    if ($result == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "AANMAKEN", "message" => "Er is iets fout gegaan bij het uitnodigen van de persoon!"]]);
        exit;
    }
    echo json_encode(["Success" => true]);
} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!" . $err]]);
    exit;
}
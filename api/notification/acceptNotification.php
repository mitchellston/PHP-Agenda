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
    $id = new Validation(
        "ID", Methods::POST, Types::NUMBER,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet aangegeven worden welke uitnodiging uw accepteerd!"]
        ]
    );
    if (count($id->getErrors()) > 0) {
        echo json_encode(["Success" => false, "error" => ["title" => "POST", "message" => $id->getErrors()[0]]]);
        exit;
    }
    $toAccept = $databaseConnection->select([], "notifications", [
        ["column" => "ToUser", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]],
        ["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $id->getValue(), "type" => PropertyTypes::int]]
    ], null, 1);
    if ($toAccept == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NOT FOUND", "message" => "De uitnodiging die u probeert te accepteren bestaat niet!"]]);
        exit;
    }
    if ($toAccept[0]["Item"] == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NOT POSSIBLE", "message" => "Deze notificatie is niet te accepteren!"]]);
        exit;
    }
    $item = $databaseConnection->select([], "items", [
        ["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $toAccept[0]["Item"], "type" => PropertyTypes::int]]
    ], null, 1);
    if ($item == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NOT FOUND", "message" => "Het item dat u probeert te accepteren bestaat niet!"]]);
        exit;
    }
    $result = $databaseConnection->insert(
        "items",
        [
            ["column" => "Subject", "value" => ["value" => $item[0]["Subject"], "type" => PropertyTypes::string]],
            ["column" => "Content", "value" => ["value" => $item[0]["Content"], "type" => PropertyTypes::string]],
            ["column" => "BeginDate", "value" => ["value" => $item[0]["BeginDate"], "type" => PropertyTypes::string]],
            ["column" => "EndDate", "value" => ["value" => $item[0]["EndDate"], "type" => PropertyTypes::string]],
            ["column" => "Priority", "value" => ["value" => $item[0]["Priority"], "type" => PropertyTypes::int]],
            ["column" => "Status", "value" => ["value" => $item[0]["Status"], "type" => PropertyTypes::string]],
            ["column" => "User", "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
        ]
    );
    if ($result == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "FAILED RECREATION", "message" => "Het is niet gelukt om het agendapunt te kopieren!"]]);
        exit;
    }
    $databaseConnection->delete("notifications", [
        ["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $id->getValue(), "type" => PropertyTypes::int]],
        ["column" => "ToUser", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
    ]);
    $databaseConnection->insert("notifications", [
        ["column" => "ToUser", "value" => ["value" => $toAccept[0]["FromUser"], "type" => PropertyTypes::int]],
        ["column" => "FromUser", "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]],
        ["column" => "Message", "value" => ["value" => "Je uitnodiging is geaccepteerd en het agenda punt(" . $item[0]["Subject"] . ") is gekopieerd naar de agenda van de uitgenodigde!", "type" => PropertyTypes::string]]
    ]);
    echo json_encode(["Success" => true]);
} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
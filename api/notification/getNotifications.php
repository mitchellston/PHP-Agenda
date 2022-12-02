<?php
use dbHandler\CompareMethods;
use dbHandler\PropertyTypes;

try {
    require_once "../config.php";
    require_once "../loggedinConfig.php";
    require_once "./automaticDelete.php";
    $result = $databaseConnection->select(
        [["table" => "notifications", "column" => "ID"], "Email", "Seen", "Message", "Subject", "BeginDate", "EndDate", "SendDate"],
        "notifications",
        [
            ["column" => "ToUser", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
        ],
        [
            ["tableToJoin" => "users", "typeOfJoin" => \dbHandler\TypeOfJoin::LEFT, "fromColumn" => "notifications.FromUser", "toColumn" => "users.ID"],
            ["tableToJoin" => "items", "typeOfJoin" => \dbHandler\TypeOfJoin::LEFT, "fromColumn" => "notifications.Item", "toColumn" => "items.ID"]
        ],
        null,
        ["columns" => ["SendDate"], "order" => \dbHandler\order::DESCENDING]
    );
    if ($result == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NO RESULTS", "message" => "Er zijn geen notificaties gevonden!"]]);
        exit;
    }
    $databaseConnection->update("notifications", [["column" => "Seen", "value" => ["value" => 1, "type" => PropertyTypes::int]]], [["column" => "ToUser", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]], ["column" => "Seen", "method" => CompareMethods::equals, "value" => ["value" => 0, "type" => PropertyTypes::int]]]);
    echo json_encode(["Success" => true, "data" => $result]);
} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
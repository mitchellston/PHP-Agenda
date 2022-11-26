<?php
use dbHandler\CompareMethods;
use dbHandler\PropertyTypes;

require_once "./config.php";
if (!isset($_SESSION["User"]) || filter_var($_SESSION["User"], FILTER_VALIDATE_INT) == false || !isset($_SESSION["LoginToken"])) {
    echo json_encode(["Success" => false, "error" => ["title" => "NOT LOGGEDIN", "message" => "Voordat u verder gaat zal u eerst in moeten loggen of een account moeten maken!"]]);
    exit;
}
$result = $databaseConnection->select(
    ["LoginToken"],
    "users",
    [
        ["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
    ]
);
if ($result == null) {
    session_destroy();
    echo json_encode(["Success" => false, "error" => ["title" => "NOT LOGGEDIN", "message" => "Voordat u verder gaat zal u eerst in moeten loggen of een account moeten maken!"]]);
    exit;
}
unset($result);
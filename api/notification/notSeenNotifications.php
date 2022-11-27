<?php
use dbHandler\CompareMethods;
use dbHandler\PropertyTypes;

try {
    require_once "../config.php";
    require_once "../loggedinConfig.php";
    require_once "./automaticDelete.php";
    $result = $databaseConnection->select(["Seen"], "notifications", [["column" => "ToUser", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]], null);
    echo json_encode(["Success" => true, "Data" => count($result)]);

} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
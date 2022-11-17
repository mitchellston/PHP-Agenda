<?php
use dbHandler\CompareMethods;
use dbHandler\PropertyTypes;


try {
    require_once "./loggedinConfig.php";
    $result = $databaseConnection->update(
        "Users",
        [
            ["column" => "LoginToken", "value" => ["value" => "", "type" => PropertyTypes::string]]
        ],
        [
            ["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $_SESSION["User"], "type" => PropertyTypes::int]]
        ]
    );
    if ($result == false) {
        echo json_encode(["Success" => false, "error" => ["title" => "LOGOUT", "message" => "Er ging iets mis tijdens het uitloggen!"]]);
        exit;
    }
    session_destroy();
    echo json_encode(["Success" => false]);

} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
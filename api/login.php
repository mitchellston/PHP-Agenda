<?php

use dbHandler\CompareMethods;
use dbHandler\PropertyTypes;
use FormValidation\Attributes;
use FormValidation\Methods;
use FormValidation\Types;
use FormValidation\Validation;

try {
    require_once "./config.php";
    $email = new Validation(
        "email", Methods::POST, Types::EMAIL,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een email gegeven worden!"]
        ]
    );
    $password = new Validation(
        "password", Methods::POST, Types::TEXT,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een password gegeven worden!"]
        ]
    );
    $errors = array_merge($email->getErrors(), $password->getErrors());
    if (count($errors) > 0) {
        echo json_encode(["Success" => false, "error" => ["title" => "POST", "message" => $errors[0]]]);
        exit;
    }
    $result = $databaseConnection->select(
        [],
        "users",
        [
            ["column" => "Email", "method" => CompareMethods::equals, "value" => ["value" => $email->getValue(), "type" => PropertyTypes::string]]
        ]
    );
    if ($result == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "NO ACCOUNT", "message" => "Er is geen account met dit e-mailadres!"]]);
        exit;
    }
    if (password_verify($password->getValue() . $result[0]["Salt"], $result[0]["Password"]) == false) {
        echo json_encode(["Success" => false, "error" => ["title" => "PASSWORD", "message" => "Er zit een fout in uw password!"]]);
        exit;
    }
    $loginToken = substr(str_shuffle(str_repeat($x = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10 / strlen($x)))), 1, 10);
    $databaseConnection->update(
        "users",
        [["column" => "LoginToken", "value" => ["value" => $loginToken, "type" => PropertyTypes::string]]],
        [["column" => "ID", "method" => CompareMethods::equals, "value" => ["value" => $result[0]["ID"], "type" => PropertyTypes::int]]]
    );
    $_SESSION["LoginToken"] = $loginToken;
    $_SESSION["User"] = $result[0]['ID'];
    echo json_encode(["Success" => true]);


} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
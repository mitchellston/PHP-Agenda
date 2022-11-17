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
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een e-mailadres gegeven worden!"]
        ]
    );
    $password = new Validation(
        "password", Methods::POST, Types::TEXT,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Er moet een password gegeven worden!"],
            Attributes::minLength => ["value" => 7, "errorMessage" => "Je password moet minimaal 7 letters hebben!"],
            Attributes::maxLength => ["value" => 20, "errorMessage" => "Je password mag maximaal 20 letter hebben!"],
            Attributes::pattern => ["value" => "/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{0,}$/", "errorMessage" => "Het password moet minimaal 1 kleine letter, 1 hoofdletter, 1 cijfer en 1 speciaal teken bevatten!"]
        ]
    );
    $confirmPassword = new Validation(
        "confirmPassword", Methods::POST, Types::TEXT,
        [
            Attributes::required => ["value" => "", "errorMessage" => "Het paswoord moet nog een keer ingevuld worden bij herhaal password!"],
        ]
    );
    $errors = array_merge($email->getErrors(), $password->getErrors(), $confirmPassword->getErrors());
    if (count($error) > 0) {
        echo json_encode(["Success" => false, "error" => ["title" => "POST", "message" => $errors[0]]]);
        exit;
    }
    if ($password->getValue() != $confirmPassword->getValue()) {
        echo json_encode(["Success" => false, "error" => ["title" => "PASSWORDEN", "message" => "De passworden die u heeft ingevoerd zijn niet hetzelfde probeer het overnieuw!"]]);
        exit;
    }
    $result = $databaseConnection->select([], "Gebruikers", [["column" => "Email", "method" => CompareMethods::equals, "value" => ["value" => $email->getValue(), "type" => PropertyTypes::string]]]);
    if ($result == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "EMAIL", "message" => "Het e-mailadres dat u mee heeft geprobeerd te registreren heeft al een account!"]]);
        exit;
    }
    $loginToken = substr(str_shuffle(str_repeat($x = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10 / strlen($x)))), 1, 10);
    $generatedSalt = substr(str_shuffle(str_repeat($x = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10 / strlen($x)))), 1, 10);
    $hashedPassword = password_hash($password->getValue() . $generatedSalt, PASSWORD_BCRYPT, ["cost" => 12]);
    $result = $databaseConnection->insert(
        "Gebruikers",
        [
            ["column" => "Email", "value" => ["value" => $email->getValue(), "type" => PropertyTypes::string]],
            ["column" => "Salt", "value" => ["value" => $generatedSalt, "type" => PropertyTypes::string]],
            ["column" => "Password", "value" => ["value" => $generatedSalt, "type" => PropertyTypes::string]],
            ["column" => "LoginToken", "value" => ["value" => $loginToken, "type" => PropertyTypes::string]]
        ]
    );
    $result = $databaseConnection->select([], "Gebruikers", [["column" => "Email", "method" => CompareMethods::equals, "value" => ["value" => $email->getValue(), "type" => PropertyTypes::string]]]);
    if ($result == null) {
        echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
        exit;
    }
    $_SESSION["LoginToken"] = $loginToken;
    $_SESSION["User"] = $result[0]["ID"];
    echo json_encode(["Success" => true]);

} catch (Exception $err) {
    echo json_encode(["Success" => false, "error" => ["title" => "...", "message" => "Er ging iets fout probeer het later opnieuw!"]]);
    exit;
}
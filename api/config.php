<?php
use dbHandler\dbHandler;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once "../classes/form_validation.php";
require_once "../classes/DbHandler.php";
require_once "../env/dbLogin.php";
session_start();
header('Content-Type: application/json; charset=utf-8');
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");

$databaseConnection = new dbHandler(env\db\login::host, env\db\login::username, env\db\login::password, env\db\login::database);
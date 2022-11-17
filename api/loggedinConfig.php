<?php
if (!isset($_SESSION["User"]) || filter_var($_SESSION["User"], FILTER_VALIDATE_INT) == false) {
    echo json_encode(["Success" => false, "error" => ["title" => "NOT LOGGEDIN", "message" => "Voordat u verder gaat zal u eerst in moeten loggen of een account moeten maken!"]]);
    exit;
}
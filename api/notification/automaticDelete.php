<?php
try {
    $databaseConnection->delete("notifications", [["column" => "SendDate", "method" => \dbHandler\CompareMethods::lesser, "value" => ["value" => date("Y-m-d",strtotime("-1 month")), "type"=> \dbHandler\PropertyTypes::string]]]);
} catch (Exception $err) {}

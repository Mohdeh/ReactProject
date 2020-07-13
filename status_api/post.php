<?php

include_once('config_setup.php');

$status = json_decode(file_get_contents('php://input'), true);

$query = "INSERT INTO $table (`msg`, `type`, `time`) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($gDB, $query);
mysqli_stmt_bind_param($stmt, 'sss', $status['msg'], $status['type'], $status['time']);
mysqli_stmt_execute($stmt);

$newID = mysqli_stmt_insert_id($stmt);

mysqli_close($gDB);

header('Content-Type: application/json');
die(json_encode([
    'success' => TRUE,
    'id' => $newID
]));

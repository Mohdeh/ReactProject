<?php

// Uncomment to display any available errors
// error_reporting(E_ALL);
// ini_set('display_errors', 'On');

// Modify with your MySQL connection details
$connection = [];
$connection['host'] = 'localhost';
$connection['user'] = 'root';
$connection['pass'] = 'root';
$connection['name'] = 'status_api';

$table = 'statuses';

$gDB = mysqli_connect($connection['host'], $connection['user'], $connection['pass'], $connection['name']);

if (mysqli_connect_errno()) {
    printf("Database connection failed: %s\n", mysqli_connect_error());
    exit();
}

// Append ?delay=3 onto requests to simulate 3 seconds of latency
if (isset($_GET['delay']) && !empty($_GET['delay'])) {
    $delay = (int)$_GET['delay'] === 0 ? 3 : (int)$_GET['delay'];

    sleep($delay);
}

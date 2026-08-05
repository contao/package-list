<?php

use Contao\PackageList\Kernel;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpFoundation\Request;

require __DIR__.'/../vendor/autoload.php';

new Dotenv()->loadEnv(__DIR__.'/../.env', overrideExistingVars: true);

$kernel = new Kernel($_ENV['APP_ENV'] ?? 'prod', 'dev' === ($_ENV['APP_ENV'] ?? 'prod'));
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->headers->set('Access-Control-Allow-Origin', '*');
$response->send();
$kernel->terminate($request, $response);

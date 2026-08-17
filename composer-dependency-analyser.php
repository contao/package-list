<?php

use ShipMonk\ComposerDependencyAnalyser\Config\Configuration;
use ShipMonk\ComposerDependencyAnalyser\Config\ErrorType;

return (new Configuration())
    ->ignoreErrorsOnPackage('deployer/deployer', [ErrorType::UNUSED_DEPENDENCY])
    ->ignoreErrorsOnPackage('symfony/dotenv', [ErrorType::UNUSED_DEPENDENCY])
    ->ignoreUnknownFunctions([
        'Symfony\Component\DependencyInjection\Loader\Configurator\service',
        'Symfony\Component\DependencyInjection\Loader\Configurator\inline_service',
    ])
;

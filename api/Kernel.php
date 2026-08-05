<?php

declare(strict_types=1);

namespace Contao\PackageList;

use Cronitor\Client;
use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Cache\Adapter\FilesystemTagAwareAdapter;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpClient\CachingHttpClient;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use function Symfony\Component\DependencyInjection\Loader\Configurator\inline_service;
use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    #[\Override]
    public function registerBundles(): iterable
    {
        yield new FrameworkBundle();
    }

    protected function configureContainer(ContainerConfigurator $container): void
    {
        $services = $container->services();
        $services
            ->load('Contao\\PackageList\\', __DIR__.'/*')
            ->autowire()
            ->autoconfigure()
        ;

        $services
            ->set(Client::class)
            ->args([$_ENV['CRONITOR_API_KEY'] ?? ''])
        ;

        $services
            ->set(HttpClientInterface::class, CachingHttpClient::class)
            ->args([
                service('http_client'),
                inline_service(FilesystemTagAwareAdapter::class),
                [/* 'trace_level' => 'full' */],
            ])
        ;
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        $routes->import(__DIR__.'/Controller/', 'attribute');
    }
}

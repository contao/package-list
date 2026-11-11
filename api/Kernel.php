<?php

declare(strict_types=1);

namespace Contao\PackageList;

use Cronitor\Client;
use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    #[\Override]
    public function registerBundles(): iterable
    {
        yield new FrameworkBundle();
    }

    protected function configureContainer(ContainerConfigurator $container, LoaderInterface $loader, ContainerBuilder $builder): void
    {
        $localesFile = __DIR__.'/../src/i18n/locales.js';
        $builder->addResource(new FileResource($localesFile));

        $content = file_get_contents($localesFile);

        if (false === $content || !preg_match_all('/^ +([a-z]{2}(?:_[A-Z]{2})?):/m', $content, $matches)) {
            throw new \RuntimeException('Unable to extract supported locales from '.$localesFile);
        }

        $container->extension('framework', [
            'secret' => '%env(APP_SECRET)%',
            'default_locale' => 'en',
            'enabled_locales' => $matches[1],
            'set_locale_from_accept_language' => true,
            'http_client' => [
                'default_options' => [
                    'timeout' => 10,
                    'max_duration' => 60,
                    'retry_failed' => ['max_retries' => 3],
                    'caching' => true,
                ],
            ],
        ]);

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
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        $routes->import(__DIR__.'/Controller/', 'attribute');
    }
}

<?php

declare(strict_types=1);

namespace Contao\PackageList;

use Loupe\Loupe\Configuration;
use Loupe\Loupe\Loupe;
use Loupe\Loupe\LoupeFactory as RealLoupeFactory;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Loupe instance should not be stored in the container.
 */
final class PackageIndex
{
    public function __construct(
        #[Autowire(param: 'kernel.project_dir')] private readonly string $projectDir
    ) {
    }

    public function getLoupe(): Loupe
    {
        return new RealLoupeFactory()->create(
            $this->projectDir.'/var/loupe',
            Configuration::create()
                ->withPrimaryKey('objectID')
                ->withSearchableAttributes(['name', 'keywords', 'title', 'description'])
                ->withFilterableAttributes(['type', 'name', 'languages', 'dependency', 'discoverable'])
                ->withSortableAttributes(['abandoned', 'downloads', 'favers', 'updated', 'released'])
                ->withLanguages(['en', 'de'])
        );
    }

    /**
     * @return array{
     *     ads: array,
     *     news: array
     * }
     */
    public function getAds(string $language): array
    {
        $packages = @include($this->projectDir.'/packages.php');

        $data = ['primary' => [], 'secondary' => [], 'subheader' => []];
        $today = date('Ymd');

        foreach ($packages as $package) {
            if (isset($package['languages'][$language])) {
                $package = array_replace_recursive($package, $package['languages'][$language]);
            }

            foreach ($package['runs'] ?? [] as $run) {
                if ((isset($run['start']) && $run['start'] > $today) || (isset($run['stop']) && $run['stop'] < $today)) {
                    continue;
                }

                $p = array_replace_recursive($package, $run);

                if (isset($run['languages'][$language])) {
                    $p = array_replace_recursive($p, $run['languages'][$language]);
                }

                unset($p['runs'], $p['languages']);

                $data[$p['position']][] = $p;
            }
        }

        return $data;
    }
}

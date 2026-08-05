<?php

declare(strict_types=1);

namespace Contao\PackageList\Controller;

use Contao\PackageList\PackageIndex;
use Loupe\Loupe\BrowseParameters;
use Loupe\Loupe\Loupe;
use Loupe\Loupe\SearchParameters;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
#[Route('/discover/{sorting}', requirements: ['sorting' => 'released|latest|downloads|favers'], defaults: ['sorting' => null])]
class DiscoverController
{
    private Loupe $loupe;

    public function __construct(private readonly PackageIndex $packageIndex)
    {
    }

    public function __invoke(Request $request, string|null $sorting): Response
    {
        $this->loupe = $this->packageIndex->getLoupe();

        $language = $request->getLanguages()[0];

        if ($sorting) {
            $response = new JsonResponse($this->getSorted($language, $sorting, max($request->query->getInt('hitsPerPage'), 10)));
        } else {
            $response = new JsonResponse([
                'total' => $this->getTotalExtensions($language),
                'latest' => $this->getLatest($language),
                'downloads' => $this->getDownloads($language),
                'favers' => $this->getFavers($language),
                'ads' => $this->packageIndex->getAds($language),
            ]);
        }

        $response
            ->setPublic()
            ->setExpires(new \DateTimeImmutable('+ 5 minutes'))
            ->setVary('Accept-Language')
        ;

        return $response;
    }

    private function getTotalExtensions(string $language): int
    {
        $parameters = BrowseParameters::create()
            ->withFilter('languages = '.BrowseParameters::escapeFilterValue($language).' AND discoverable = true')
            ->withLimit(1)
        ;

        return $this->loupe->browse($parameters)->getTotalHits();
    }

    private function getLatest(string $language): array
    {
        $parameters = SearchParameters::create()
            ->withFilter('languages = '.SearchParameters::escapeFilterValue($language).' AND discoverable = true')
            ->withSort(['updated:desc'])
            ->withLimit(6)
        ;

        return $this->loupe->search($parameters)->toArray()['hits'];
    }

    private function getDownloads(string $language): array
    {
        $parameters = SearchParameters::create()
            ->withFilter('languages = '.SearchParameters::escapeFilterValue($language).' AND discoverable = true')
            ->withSort(['downloads:desc'])
            ->withLimit(4)
        ;

        return $this->loupe->search($parameters)->toArray()['hits'];
    }

    private function getFavers(string $language): array
    {
        $parameters = SearchParameters::create()
            ->withFilter('languages = '.SearchParameters::escapeFilterValue($language).' AND discoverable = true')
            ->withSort(['favers:desc'])
            ->withLimit(4)
        ;

        return $this->loupe->search($parameters)->toArray()['hits'];
    }

    private function getSorted(string $language, string $sorting, int $hitsPerPage): array
    {
        if ('latest' === $sorting) {
            $sorting = 'updated';
        }

        $parameters = SearchParameters::create()
            ->withFilter('languages = '.SearchParameters::escapeFilterValue($language).' AND discoverable = true')
            ->withSort([$sorting.':desc'])
            ->withHitsPerPage($hitsPerPage)
        ;

        return $this->loupe->search($parameters)->toArray();
    }
}

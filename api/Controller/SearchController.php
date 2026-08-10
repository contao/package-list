<?php

declare(strict_types=1);

namespace Contao\PackageList\Controller;

use Contao\PackageList\PackageIndex;
use Loupe\Loupe\SearchParameters;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
#[Route('/search')]
class SearchController
{
    public function __construct(private readonly PackageIndex $loupeFactory)
    {
    }

    public function __invoke(Request $request): Response
    {
        $language = $request->getLanguages()[0];

        $query = $request->query->getString('query');
        $themes = $request->query->getString('themes');
        $hitsPerPage = max($request->query->getInt('hitsPerPage'), 10);

        if ('' === $query) {
            return new Response('Must provide "query"', Response::HTTP_BAD_REQUEST);
        }

        $filter = 'languages = '.SearchParameters::escapeFilterValue($language).' AND dependency = false';

        if ('1' === $themes) {
            $filter .= " AND type = 'contao-theme'";
        } elseif ('0' === $themes) {
            $filter .= " AND type != 'contao-theme'";
        }

        $parameters = SearchParameters::create()
            ->withQuery($query)
            ->withFilter($filter)
            ->withSort(['abandoned:asc', '_relevance:desc', 'favers:desc', 'downloads:desc'])
            ->withHitsPerPage($hitsPerPage)
            ->withMatchingStrategy('all')
            ->withAttributesToHighlight(['title', 'description'], '%%', '%%')
        ;

        $result = $this->loupeFactory->getLoupe()->search($parameters);

        $response = new JsonResponse($result->toArray());
        $response
            ->setPrivate()
            ->setExpires(new \DateTimeImmutable('+ 5 minutes'))
            ->setVary('Accept-Language')
        ;

        return $response;
    }
}

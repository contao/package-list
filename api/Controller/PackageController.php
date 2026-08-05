<?php

declare(strict_types=1);

namespace Contao\PackageList\Controller;

use Contao\PackageList\PackageIndex;
use Loupe\Loupe\BrowseParameters;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
#[Route('/p/{name}', requirements: ['name' => '.+/.+'])]
class PackageController
{
    public function __construct(private readonly PackageIndex $loupeFactory)
    {
    }

    public function __invoke(Request $request, string $name): Response
    {
        $language = $request->getLanguages()[0];

        $parameters = BrowseParameters::create()
            ->withFilter('languages = '.BrowseParameters::escapeFilterValue($language).' AND name = '.BrowseParameters::escapeFilterValue($name))
            ->withLimit(1)
        ;

        $result = $this->loupeFactory->getLoupe()->browse($parameters);

        if (!$result->getTotalHits()) {
            $response = new Response('Not Found', Response::HTTP_NOT_FOUND);
        } else {
            $response = new JsonResponse($result->getHits()[0]);
        }

        $response
            ->setPublic()
            ->setExpires(new \DateTimeImmutable('+ 5 minutes'))
            ->setVary('Accept-Language')
        ;

        return $response;
    }
}

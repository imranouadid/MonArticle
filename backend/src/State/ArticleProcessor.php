<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Document\Article;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\SecurityBundle\Security;

class ArticleProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly DocumentManager $dm,
        private readonly Security $security
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Article) {
            return $data;
        }

        if ($operation->getMethod() === 'POST' || $operation->getMethod() === 'PUT') {
            $data->setAuthor($this->security->getUser());
        }

        $this->dm->persist($data);
        $this->dm->flush();

        return $data;
    }
}

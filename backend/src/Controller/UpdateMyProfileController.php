<?php

namespace App\Controller;

use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;

#[AsController]
class UpdateMyProfileController extends AbstractController
{
    public function __construct(
        private readonly Security $security,
        private readonly DocumentManager $documentManager
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();
        $data = json_decode($request->getContent(), true);

        $user->setName($data['name'] ?? $user->getName());
        $user->setEmail($data['email'] ?? $user->getEmail());

        $this->documentManager->persist($user);
        $this->documentManager->flush();

        return $this->json(
            $user,
            Response::HTTP_OK,
            [],
            ['groups' => ['User:read']]
        );
    }
}

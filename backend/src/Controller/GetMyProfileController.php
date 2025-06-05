<?php

namespace App\Controller;

use App\Document\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;

#[AsController]
class GetMyProfileController extends AbstractController
{
    public function __construct(private readonly Security $security) {}

    public function __invoke(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();

        return $this->json(
            $user,
            Response::HTTP_OK,
            [],
            ['groups' => ['User:read']]
        );
    }
}

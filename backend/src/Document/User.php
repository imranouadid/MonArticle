<?php

namespace App\Document;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use App\Controller\GetMyProfileController;
use App\Controller\UpdateMyProfileController;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;


#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/users/me',
            controller: GetMyProfileController::class,
            name: 'get_me',
        ),
        new Put(
            uriTemplate: '/users/me',
            controller: UpdateMyProfileController::class,
            denormalizationContext: ['groups' => ['User:put']],
            security: "is_granted('PUT', object)",
            name: 'put_me',
        ),
    ],
    normalizationContext: [
        'groups' => ['User:read'],
        'swagger_definition_name' => 'read',
    ],
    order: ['id' => 'DESC'],
    security: "is_granted('IS_AUTHENTICATED_FULLY')"
)]
#[ODM\Document]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const ROLE_USER = 'ROLE_USER';
    #[ODM\Id]
    #[Groups(['User:read', 'Article:read'])]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    #[Groups(['User:read', 'User:put', 'Article:read'])]
    private string $name;

    #[ODM\Field(type: 'string')]
    #[Groups(['User:read', 'User:put'])]
    private string $email;

    #[ODM\Field(type: 'string')]
    private string $password;

    #[ODM\ReferenceMany(targetDocument: Article::class, mappedBy: "author")]
    private Collection $articles;

    #[ODM\Field(type: "collection")]
    private array $roles = [];

    public function __construct()
    {
        $this->articles = new ArrayCollection();
    }

    public function getId(): ?string {
        return $this->id;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string {
        return $this->email;
    }

    public function setEmail(string $email): self {
        $this->email = $email;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getArticles(): Collection
    {
        return $this->articles;
    }

    public function addArticle(Article $article): self
    {
        if (!$this->articles->contains($article)) {
            $this->articles[] = $article;
            $article->setAuthor($this);
        }

        return $this;
    }

    public function removeArticle(Article $article): self
    {
        if ($this->articles->removeElement($article)) {
            if ($article->getAuthor() === $this) {
                $article->setAuthor(null);
            }
        }

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = self::ROLE_USER;

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function eraseCredentials(){}
}

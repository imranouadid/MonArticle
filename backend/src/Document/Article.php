<?php

namespace App\Document;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\State\ArticleProcessor;
use DateTime;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(processor: ArticleProcessor::class),
        new Get(),
        new Put(
            denormalizationContext: ['groups' => ['Article:put']],
            security: "object.getAuthor() == user",
            processor: ArticleProcessor::class,
        ),
        new Delete(
            security: "object.getAuthor() == user",
        )
    ],
    normalizationContext: [
        'groups' => ['Article:read'],
        'swagger_definition_name' => 'read',
    ],
    denormalizationContext: [
        'groups' => ['Article:write'],
        'swagger_definition_name' => 'write',
    ],
    order: ['id' => 'DESC'],
    security: "is_granted('IS_AUTHENTICATED_FULLY')"
)]
#[ODM\Document]
class Article
{
    #[ODM\Id]
    #[Groups(['Article:read'])]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    #[Assert\NotBlank]
    #[Groups(['Article:read', 'Article:put', 'Article:write'])]
    private string $title;

    #[ODM\Field(type: 'string')]
    #[Assert\NotBlank]
    #[Groups(['Article:read', 'Article:put', 'Article:write'])]
    private string $content;

    #[ODM\ReferenceOne(storeAs: "id", targetDocument: User::class, inversedBy: "articles")]
    #[Groups(['Article:read'])]
    private User $author;

    #[ODM\Field(type: 'date')]
    #[Groups(['Article:read'])]
    private DateTime $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTime();
    }

    public function getId(): ?string {
        return $this->id;
    }

    public function getTitle(): ?string {
        return $this->title;

    }
    public function setTitle(string $title): self {
        $this->title = $title; return $this;
    }

    public function getContent(): ?string {
        return $this->content;
    }
    public function setContent(string $content): self {
        $this->content = $content; return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getCreatedAt(): DateTime {
        return $this->createdAt;
    }
}

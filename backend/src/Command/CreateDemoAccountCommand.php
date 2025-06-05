<?php

namespace App\Command;

use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


#[AsCommand(
    name: 'app:create-demo-account',
    description: 'Create demo account',
)]
class CreateDemoAccountCommand extends Command
{
    private const USER_PASSWORD = 'testPassword';
    private const SUCCESS_CREATE_ACCOUNT_MESSAGE = 'Demo account created successfully ✅';
    private const COMMAND_DESCRIPTION = 'Creates a new demo account';

    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly DocumentManager $documentManager,
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->setDescription(self::COMMAND_DESCRIPTION)
            ->addArgument('email', InputArgument::REQUIRED, 'The email of the demo account')
            ->addArgument('name', InputArgument::REQUIRED, 'The name of the demo account');
    }


    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = $input->getArgument('email');
        $name = $input->getArgument('name');

        $existingUser = $this->documentManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$existingUser) {
            $user = new User();
            $user->setName($name);
            $user->setEmail($email);
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, self::USER_PASSWORD)
            );

            $this->documentManager->persist($user);
            $this->documentManager->flush();
        }

        $output->writeln(self::SUCCESS_CREATE_ACCOUNT_MESSAGE);

        return Command::SUCCESS;
    }
}

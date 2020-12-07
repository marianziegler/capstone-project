<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use App\Repository\UserRepository;
use App\Entity\User;
use App\Repository\TokenRepository;
use App\Service\AuthenticationService;

class UserController extends AbstractController
{
    /**
     * @Route("/user", methods={"GET"})
     */

    public function index(
        SerializerInterface $serializer,
        UserRepository $repository,
        TokenRepository $tokenRepository,
        Request $request,
        AuthenticationService $authentication
    ): JsonResponse 
    {
        $authData = $authentication->validateUser($request);
        
        if ($authData['success'] === false) {
            return $this->json(["loggedIn" => false], JsonResponse::HTTP_UNAUTHORIZED);
        }
        
        return new JsonResponse(
            $serializer->serialize($authData["user"], 'json',
                [
                    ObjectNormalizer::IGNORED_ATTRIBUTES => ['password', 'comments', 'tokens']
                ]),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    /**
     * @Route("/user", methods={"POST"})
     */

    public function register(
        Request $request,
        SerializerInterface $serializer,
        UserRepository $repository
    ): JsonResponse
    {
        $user = $serializer->deserialize($request->getContent(), User::class, 'json');
        
        $emailInUse = $repository->findBy(['email' => $user->getEmail()]);
        if(sizeof($emailInUse) > 0) {
            return $this->json(["userRegistration"=>false], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $repository->save($user);

        return $this->json(["userRegistration"=>true], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/user_update", methods={"POST"})
     */

    public function update(
        Request $request,
        AuthenticationService $authentication,
        TokenRepository $tokenRepository,
        UserRepository $repository
    ): JsonResponse
    {
        $authData = $authentication->validateUser($request);
        
        if ($authData['success'] === false) {
            return $this->json(["loggedIn" => false], JsonResponse::HTTP_UNAUTHORIZED);
        }
        
        $user = $authData["user"];
        $post = json_decode($request->getContent(), true);
        $user->updateWeights($post);
        $repository->save($user);

        return $this->json(["success" => true], JsonResponse::HTTP_OK);
    }
}

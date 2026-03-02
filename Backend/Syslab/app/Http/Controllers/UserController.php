<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

#rota de autenticação que retorna token sanctum para usuario
class UserController extends Controller
{
    #[OA\Post(
        path: '/api/user/login',
        summary: 'Login do usuário',
        description: 'Autentica um usuário e retorna um token Sanctum',
        requestBody: new OA\RequestBody(
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    required: ['email', 'password'],
                    properties: [
                        new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                        new OA\Property(property: 'password', type: 'string', example: 'password123'),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Login bem-sucedido'),
            new OA\Response(response: 401, description: 'Credenciais inválidas'),
        ]
    )]
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;
            $minutes = 60 * 24 * 7;

            return response()->json([
                'message' => 'Login realizado com sucesso',
                'user' => $user
            ])->cookie(
                'access_token',
                $token,
                $minutes,
                '/',
                null,
                false,
                true,
                false,
                'lax'
            );
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    #logout do usuário, revoga o token atual
    #[OA\Post(
        path: '/api/user/logout',
        summary: 'Logout do usuário',
        description: 'Revoga o token Sanctum do usuário atual',
        responses: [
            new OA\Response(response: 200, description: 'Logout bem-sucedido'),
        ]
    )]
    public function logout(Request $request)
    {
        $token = $request->user()?->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out successfully'])
            ->withoutCookie('access_token', '/');
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}

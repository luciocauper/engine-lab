<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class NewsController extends Controller
{

    #[OA\Get(
        path: "/api/news",
        summary: "Listar notícias",
        tags: ["News"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de notícias",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/News")
                )
            )
        ]
    )]
    public function index()
    {
        return News::with('author')->get();
    }


    #[OA\Post(
        path: "/api/news",
        summary: "Criar notícia",
        tags: ["News"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["title", "body_text", "author_id"],
                properties: [
                    new OA\Property(property: "title", type: "string"),
                    new OA\Property(property: "subtitle", type: "string", nullable: true),
                    new OA\Property(property: "body_text", type: "string"),
                    new OA\Property(property: "image", type: "string", nullable: true),
                    new OA\Property(property: "datastamp", type: "string", format: "date-time"),
                    new OA\Property(property: "author_id", type: "integer")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Notícia criada",
                content: new OA\JsonContent(ref: "#/components/schemas/News")
            )
        ]
    )]
    public function store(Request $request)
    {
        return News::create($request->all());
    }


    #[OA\Get(
        path: "/api/news/{id}",
        summary: "Buscar notícia por ID",
        tags: ["News"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Notícia encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/News")
            ),
            new OA\Response(response: 404, description: "Notícia não encontrada")
        ]
    )]
    public function show($id)
    {
        return News::with('author')->findOrFail($id);
    }

    #[OA\Put(
        path: "/api/news/{id}",
        summary: "Atualizar notícia",
        tags: ["News"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "title", type: "string"),
                    new OA\Property(property: "subtitle", type: "string"),
                    new OA\Property(property: "body_text", type: "string"),
                    new OA\Property(property: "image", type: "string"),
                    new OA\Property(property: "datastamp", type: "string", format: "date-time"),
                    new OA\Property(property: "author_id", type: "integer")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Notícia atualizada",
                content: new OA\JsonContent(ref: "#/components/schemas/News")
            )
        ]
    )]
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
        $news->update($request->all());
        return $news;
    }

    #[OA\Delete(
        path: "/api/news/{id}",
        summary: "Remover notícia",
        tags: ["News"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(response: 204, description: "Notícia removida"),
            new OA\Response(response: 404, description: "Notícia não encontrada")
        ]
    )]
    public function destroy($id)
    {
        News::findOrFail($id)->delete();
        return response()->noContent();
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
                    new OA\Property(
                        property: "images",
                        type: "array",
                        items: new OA\Items(type: "string")
                    ),
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'body_text' => 'required|string',
            'datastamp' => 'required|date',
            'author_id' => 'required|integer|exists:pessoas,id',
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['required', 'image'],
        ]);

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('news', 'public');
            }
            $validated['images'] = $imagePaths;
        }

        $news = News::create($validated);

        return response()->json($news->fresh('author'), 201);
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
                    new OA\Property(
                        property: "images",
                        type: "array",
                        items: new OA\Items(type: "string")
                    ),
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

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'body_text' => 'sometimes|string',
            'datastamp' => 'sometimes|date',
            'author_id' => 'sometimes|integer|exists:pessoas,id',
            'images' => ['sometimes', 'array'],
            'images.*' => ['nullable'],
        ]);

        // Imagens antigas recebidas como string
        $existingImages = collect($request->input('images', []))
            ->filter(fn($item) => is_string($item))
            ->values()
            ->toArray();

        // Novas imagens recebidas como arquivo
        $newImages = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $newImages[] = $file->store('news', 'public');
            }
        }

        // Junta imagens mantidas + novas
        $finalImages = array_merge($existingImages, $newImages);

        // Remove do storage as imagens que saíram
        $oldImages = $news->images ?? [];
        $imagesToDelete = array_diff($oldImages, $finalImages);
        foreach ($imagesToDelete as $imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        $news->update([
            'title' => $validated['title'] ?? $news->title,
            'subtitle' => $validated['subtitle'] ?? $news->subtitle,
            'body_text' => $validated['body_text'] ?? $news->body_text,
            'datastamp' => $validated['datastamp'] ?? $news->datastamp,
            'author_id' => $validated['author_id'] ?? $news->author_id,
            'images' => $finalImages,
        ]);

        return response()->json($news->fresh('author'));
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
        $news = News::findOrFail($id);

        if ($news->images) {
            foreach ($news->images as $imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        $news->delete();

        return response()->noContent();
    }
}

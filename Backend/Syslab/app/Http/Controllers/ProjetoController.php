<?php

namespace App\Http\Controllers;

use App\Models\Projeto;
use GuzzleHttp\Psr7\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;


class ProjetoController extends Controller
{
    #[OA\Get(
        path: "/api/projetos",
        summary: "Listar projetos",
        tags: ["Projeto"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de projetos",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/Projeto")
                )
            )
        ]
    )]
    public function index()
    {
        return Projeto::with('pessoas')->get();
    }

    #[OA\Post(
        path: "/api/projetos",
        summary: "Criar projeto",
        tags: ["Projeto"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name"],
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "image", type: "string", nullable: true),
                    new OA\Property(property: "description", type: "string", nullable: true),
                    new OA\Property(property: "status", type: "string"),
                    new OA\Property(property: "date_begin", type: "string", format: "date"),
                    new OA\Property(property: "date_end", type: "string", format: "date", nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Projeto criado",
                content: new OA\JsonContent(ref: "#/components/schemas/Projeto")
            )
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'date_begin' => 'required|date',
            'date_end' => 'nullable|date|after_or_equal:date_begin',
            'images' => ['required', 'array', 'min:1'],
            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120' // 5MB
            ],
        ]);

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('projetos', 'public');
                $imagePaths[] = $path;
            }
            $validated['images'] = $imagePaths;
        }

        return Projeto::create($validated);
    }

    #[OA\Get(
        path: "/api/projetos/{id}",
        summary: "Buscar projeto por ID",
        tags: ["Projeto"],
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
                description: "Projeto encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/Projeto")
            ),
            new OA\Response(response: 404, description: "Projeto não encontrado")
        ]
    )]
    public function show($id)
    {
        return Projeto::with('pessoas')->findOrFail($id);
    }

    #[OA\Put(
        path: "/api/projetos/{id}",
        summary: "Atualizar projeto",
        tags: ["Projeto"],
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
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "image", type: "string"),
                    new OA\Property(property: "description", type: "string"),
                    new OA\Property(property: "status", type: "string"),
                    new OA\Property(property: "date_begin", type: "string", format: "date"),
                    new OA\Property(property: "date_end", type: "string", format: "date")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Projeto atualizado",
                content: new OA\JsonContent(ref: "#/components/schemas/Projeto")
            )
        ]
    )]
    public function update(Request $request, $id)
{
    $projeto = Projeto::findOrFail($id);

    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
        'status' => 'sometimes|string',
        'date_begin' => 'sometimes|date',
        'date_end' => 'nullable|date|after_or_equal:date_begin',
        'images' => ['sometimes', 'array'],
        'images.*' => ['nullable'],
    ]);

    // 1️⃣ Imagens antigas (strings)
    $existingImages = collect($request->input('images', []))
        ->filter(fn ($item) => is_string($item))
        ->values()
        ->toArray();

    // 2️⃣ Novas imagens (arquivos)
    $newImages = [];

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            $newImages[] = $file->store('projetos', 'public');
        }
    }

    // 3️⃣ Junta tudo
    $finalImages = array_merge($existingImages, $newImages);

    // 4️⃣ Remove imagens deletadas do storage
    $oldImages = $projeto->images ?? [];
    $imagesToDelete = array_diff($oldImages, $finalImages);

    foreach ($imagesToDelete as $imagePath) {
        Storage::disk('public')->delete($imagePath);
    }

    // 5️⃣ Atualiza
    $projeto->update([
        'name' => $validated['name'] ?? $projeto->name,
        'description' => $validated['description'] ?? $projeto->description,
        'status' => $validated['status'] ?? $projeto->status,
        'date_begin' => $validated['date_begin'] ?? $projeto->date_begin,
        'date_end' => $validated['date_end'] ?? $projeto->date_end,
        'images' => $finalImages,
    ]);

    return response()->json($projeto->fresh());
}


    #[OA\Delete(
        path: "/api/projetos/{id}",
        summary: "Remover projeto",
        tags: ["Projeto"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(response: 204, description: "Projeto removido"),
            new OA\Response(response: 404, description: "Projeto não encontrado")
        ]
    )]
    public function destroy($id)
    {
        $projeto = Projeto::findOrFail($id);
        if ($projeto->images) {
            foreach ($projeto->images as $imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
        }
        $projeto->delete();

        return response()->noContent();
    }

    public function attachPessoa(Request $request, $id)
    {
        $projeto = Projeto::findOrFail($id);

        $projeto->pessoas()->attach($request->pessoa_id, [
            'integrantes' => $request->integrantes
        ]);

        return response()->json(['message' => 'Pessoa vinculada']);
    }
}

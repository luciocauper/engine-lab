<?php

namespace App\Http\Controllers;

use App\Models\Pessoa;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use Illuminate\Support\Facades\Storage;

class PessoaController extends Controller
{
    #[OA\Get(
        path: "/api/pessoas",
        summary: "Listar pessoas",
        tags: ["Pessoa"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de pessoas",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/Pessoa")
                )
            )
        ]
    )]
    public function index()
    {
        return response()->json(
            Pessoa::with('projetos', 'news')->get(),
            200
        );
    }

    #[OA\Post(
        path: "/api/pessoas",
        summary: "Criar pessoa",
        tags: ["Pessoa"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name"],
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "image", type: "string", nullable: true),
                    new OA\Property(property: "research", type: "string", nullable: true),
                    new OA\Property(property: "lattes", type: "string", nullable: true),
                    new OA\Property(property: "orcid", type: "string", nullable: true),
                    new OA\Property(property: "descricao", type: "string", nullable: true),
                    new OA\Property(property: "cargo", type: "string", nullable: true),
                    new OA\Property(property: "curso", type: "string", nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Pessoa criada",
                content: new OA\JsonContent(ref: "#/components/schemas/Pessoa")
            )
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'curso' => 'nullable|string|max:255',
            'image' => 'nullable|image',
            'research' => 'nullable|string|max:255',
            'lattes' => 'nullable|string|max:255',
            'orcid' => 'nullable|string|max:255',
            'descricao' => 'nullable|string'

        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('pessoas', 'public');
            $validated['image'] = $path;
        }

        $pessoa = Pessoa::create($validated);

        return response()->json($pessoa, 201);
    }

    #[OA\Get(
        path: "/api/pessoas/{id}",
        summary: "Buscar pessoa",
        tags: ["Pessoa"],
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
                description: "Pessoa encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/Pessoa")
            ),
            new OA\Response(response: 404, description: "Pessoa não encontrada")
        ]
    )]
    public function show($id)
    {
        $pessoa = Pessoa::with('projetos', 'news')->findOrFail($id);

        return response()->json($pessoa, 200);
    }

    #[OA\Put(
        path: "/api/pessoas/{id}",
        summary: "Atualizar pessoa",
        tags: ["Pessoa"],
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
                    new OA\Property(property: "research", type: "string"),
                    new OA\Property(property: "lattes", type: "string"),
                    new OA\Property(property: "orcid", type: "string"),
                    new OA\Property(property: "descricao", type: "string"),
                    new OA\Property(property: "cargo", type: "string"),
                    new OA\Property(property: "curso", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Pessoa atualizada",
                content: new OA\JsonContent(ref: "#/components/schemas/Pessoa")
            )
        ]
    )]
    public function update(Request $request, $id)
    {
        $pessoa = Pessoa::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'curso' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'research' => 'nullable|string|max:255',
            'lattes' => 'nullable|string|max:255',
            'orcid' => 'nullable|string|max:255',
            'descricao' => 'nullable|string'
        ]);

        if ($request->hasFile('image')) {

            // Remove imagem antiga
            if ($pessoa->image) {
                Storage::disk('public')->delete($pessoa->image);
            }

            // Salva nova imagem
            $path = $request->file('image')->store('pessoas', 'public');

            // Adiciona no array validado
            $data['image'] = $path;
        }

        $pessoa->update($data);

        return response()->json($pessoa->fresh(), 200);
    }


    #[OA\Delete(
        path: "/api/pessoas/{id}",
        summary: "Remover pessoa",
        tags: ["Pessoa"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(response: 204, description: "Removido")
        ]
    )]
    public function destroy($id)
    {
        Pessoa::findOrFail($id)->delete();

        return response()->noContent();
    }

    #[OA\Get(
        path: "/api/pessoas/{id}/projetos",
        summary: "Listar projetos da pessoa",
        tags: ["Pessoa-Projetos"],
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
                description: "Projetos",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/Projeto")
                )
            )
        ]
    )]
    public function projetos($id)
    {
        $pessoa = Pessoa::with('projetos')->findOrFail($id);

        return response()->json($pessoa->projetos, 200);
    }

    #[OA\Post(
        path: "/api/pessoas/{id}/projetos",
        summary: "Vincular projeto",
        tags: ["Pessoa-Projetos"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["projeto_id"],
                properties: [
                    new OA\Property(property: "projeto_id", type: "integer"),
                    new OA\Property(property: "integrantes", type: "string", nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Projeto vinculado")
        ]
    )]
    public function attachProjeto(Request $request, $id)
    {
        $data = $request->validate([
            'projeto_id' => 'required|integer|exists:projetos,id',
            'integrantes' => 'nullable|string'
        ]);

        $pessoa = Pessoa::findOrFail($id);

        $pessoa->projetos()->syncWithoutDetaching([
            $data['projeto_id'] => [
                'integrantes' => $data['integrantes'] ?? null
            ]
        ]);

        return response()->json([
            'message' => 'Projeto vinculado com sucesso'
        ], 200);
    }

    #[OA\Put(
        path: "/api/pessoas/{id}/projetos/sync",
        summary: "Sincronizar projetos",
        tags: ["Pessoa-Projetos"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(
                        property: "projetos",
                        type: "array",
                        items: new OA\Items(type: "integer")
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Projetos sincronizados")
        ]
    )]
    public function syncProjetos(Request $request, $id)
    {
        $data = $request->validate([
            'projetos' => 'required|array',
            'projetos.*' => 'integer|exists:projetos,id'
        ]);

        $pessoa = Pessoa::findOrFail($id);

        $pessoa->projetos()->sync($data['projetos']);

        return response()->json([
            'message' => 'Projetos sincronizados'
        ], 200);
    }

    #[OA\Delete(
        path: "/api/pessoas/{id}/projetos/{projetoId}",
        summary: "Desvincular projeto",
        tags: ["Pessoa-Projetos"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            ),
            new OA\Parameter(
                name: "projetoId",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Projeto removido")
        ]
    )]
    public function detachProjeto($id, $projetoId)
    {
        $pessoa = Pessoa::findOrFail($id);

        if (!$pessoa->projetos()->where('projeto_id', $projetoId)->exists()) {
            return response()->json([
                'message' => 'Vínculo não encontrado'
            ], 404);
        }

        $pessoa->projetos()->detach($projetoId);

        return response()->json([
            'message' => 'Projeto desvinculado com sucesso'
        ], 200);
    }
}

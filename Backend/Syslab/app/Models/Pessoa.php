<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Pessoa",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "name", type: "string", example: "Pablo Kauan"),
        new OA\Property(property: "image", type: "string", nullable: true, example: "perfil.jpg"),
        new OA\Property(property: "research", type: "string", nullable: true, example: "Inteligência Artificial"),
        new OA\Property(property: "lattes", type: "string", nullable: true),
        new OA\Property(property: "orcid", type: "string", nullable: true),
        new OA\Property(property: "descricao", type: "string", nullable: true),
        new OA\Property(property: "cargo", type: "string", nullable: true),
        new OA\Property(property: "curso", type: "string", nullable: true),

        new OA\Property(
            property: "projetos",
            type: "array",
            items: new OA\Items(ref: "#/components/schemas/Projeto")
        ),

        new OA\Property(
            property: "news",
            type: "array",
            items: new OA\Items(ref: "#/components/schemas/News")
        )
    ]
)]
class Pessoa extends Model
{
    protected $table = 'pessoas';

    protected $fillable = [
        'name',
        'image',
        'research',
        'lattes',
        'orcid',
        'descricao',
        'cargo',
        'curso'
    ];

    /*
    |--------------------------------------------------------------------------
    | Relacionamentos
    |--------------------------------------------------------------------------
    */

    public function projetos()
    {
        return $this->belongsToMany(Projeto::class, 'pessoa_projeto')
            ->withPivot('integrantes')
            ->withTimestamps();
    }

    public function news()
    {
        return $this->hasMany(News::class, 'author_id');
    }
}

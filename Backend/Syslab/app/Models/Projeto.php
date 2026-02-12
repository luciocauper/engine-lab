<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Projeto",
    type: "object",
    title: "Projeto",
    properties: [

        new OA\Property(
            property: "id",
            type: "integer",
            example: 1
        ),

        new OA\Property(
            property: "name",
            type: "string",
            example: "Sistema de Monitoramento Energético"
        ),

        new OA\Property(
            property: "image",
            type: "string",
            nullable: true,
            example: "projeto.jpg"
        ),

        new OA\Property(
            property: "description",
            type: "string",
            nullable: true,
            example: "Projeto voltado ao monitoramento de consumo energético"
        ),

        new OA\Property(
            property: "status",
            type: "string",
            example: "ativo"
        ),

        new OA\Property(
            property: "date_begin",
            type: "string",
            format: "date",
            example: "2025-01-01"
        ),

        new OA\Property(
            property: "date_end",
            type: "string",
            format: "date",
            nullable: true,
            example: "2025-12-31"
        ),

        /*
        |--------------------------------------------------------------------------
        | Pivot pessoa_projeto
        |--------------------------------------------------------------------------
        */

        new OA\Property(
            property: "pivot",
            type: "object",
            nullable: true,
            properties: [
                new OA\Property(
                    property: "integrantes",
                    type: "string",
                    nullable: true,
                    example: "Desenvolvedor Backend"
                )
            ]
        ),

        /*
        |--------------------------------------------------------------------------
        | Relacionamento Pessoas
        |--------------------------------------------------------------------------
        */

        new OA\Property(
            property: "pessoas",
            type: "array",
            nullable: true,
            items: new OA\Items(ref: "#/components/schemas/Pessoa")
        )
    ]
)]
class Projeto extends Model
{
    protected $table = 'projetos';

    protected $fillable = [
        'name',
        'images',
        'description',
        'status',
        'date_begin',
        'date_end'
    ];

    protected $casts = [
        'images' => 'array',
    ];


    /*
    |--------------------------------------------------------------------------
    | Relacionamentos
    |--------------------------------------------------------------------------
    */

    public function pessoas()
    {
        return $this->belongsToMany(Pessoa::class, 'pessoa_projeto')
            ->withPivot('integrantes')
            ->withTimestamps();
    }
}

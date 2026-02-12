<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "News",
    type: "object",
    title: "News",
    description: "Notícia publicada no sistema",
    properties: [

        new OA\Property(
            property: "id",
            type: "integer",
            example: 1
        ),

        new OA\Property(
            property: "title",
            type: "string",
            example: "Novo laboratório é inaugurado"
        ),

        new OA\Property(
            property: "subtitle",
            type: "string",
            nullable: true,
            example: "Espaço amplia pesquisas na universidade"
        ),

        new OA\Property(
            property: "body_text",
            type: "string",
            example: "O laboratório foi inaugurado com foco em inovação..."
        ),

        new OA\Property(
            property: "image",
            type: "string",
            nullable: true,
            example: "news.jpg"
        ),

        new OA\Property(
            property: "datastamp",
            type: "string",
            format: "date-time",
            example: "2025-02-01T10:30:00Z"
        ),

        new OA\Property(
            property: "author_id",
            type: "integer",
            example: 1
        ),

        /*
        |--------------------------------------------------------------------------
        | Relacionamento Autor
        |--------------------------------------------------------------------------
        */

        new OA\Property(
            property: "author",
            ref: "#/components/schemas/Pessoa"
        )
    ]
)]
class News extends Model
{
    protected $table = 'news';

    protected $fillable = [
        'title',
        'datastamp',
        'author_id',
        'subtitle',
        'body_text',
        'image'
    ];

    /*
    |--------------------------------------------------------------------------
    | Relacionamentos
    |--------------------------------------------------------------------------
    */

    public function author()
    {
        return $this->belongsTo(Pessoa::class, 'author_id');
    }
}


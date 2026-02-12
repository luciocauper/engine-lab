<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Pessoa;
use App\Models\Projeto;
use App\Models\News;

uses(RefreshDatabase::class);

/*
|--------------------------------------------------------------------------
| PESSOAS
|--------------------------------------------------------------------------
*/

test('listar pessoas', function () {
    $this->getJson('/api/pessoas')
        ->assertOk();
});

test('criar pessoa', function () {
    $this->postJson('/api/pessoas', [
        'name'  => 'João',
        'email' => 'joao@test.com',
    ])
        ->assertCreated()
        ->assertJsonFragment(['name' => 'João']);
});

test('mostrar pessoa', function () {
    $pessoa = Pessoa::create([
        'name'  => 'Maria',
        'email' => 'maria@test.com',
    ]);

    $this->getJson("/api/pessoas/{$pessoa->id}")
        ->assertOk()
        ->assertJsonFragment(['name' => 'Maria']);
});

test('atualizar pessoa', function () {
    $pessoa = Pessoa::create([
        'name'  => 'Pedro',
        'email' => 'pedro@test.com',
    ]);

    $this->putJson("/api/pessoas/{$pessoa->id}", [
        'name' => 'Pedro Atualizado',
    ])
        ->assertOk()
        ->assertJsonFragment(['name' => 'Pedro Atualizado']);
});

test('deletar pessoa', function () {
    $pessoa = Pessoa::create([
        'name'  => 'Carlos',
        'email' => 'carlos@test.com',
    ]);

    $this->deleteJson("/api/pessoas/{$pessoa->id}")
        ->assertNoContent();
});

/*
|--------------------------------------------------------------------------
| PROJETOS
|--------------------------------------------------------------------------
*/

test('listar projetos', function () {
    $this->getJson('/api/projetos')
        ->assertOk();
});

test('criar projeto', function () {
    $this->postJson('/api/projetos', [
        'name'        => 'Projeto X',
        'description' => 'Descrição do projeto',
        'status'      => 'ativo',
        'date_begin'  => '2026-02-01',
        'date_end'    => '2026-12-31',
    ])
        ->assertCreated()
        ->assertJsonFragment(['name' => 'Projeto X']);
});

test('mostrar projeto', function () {
    $projeto = Projeto::create([
        'name'        => 'Projeto A',
        'description' => 'Desc',
    ]);

    $this->getJson("/api/projetos/{$projeto->id}")
        ->assertOk()
        ->assertJsonFragment(['name' => 'Projeto A']);
});

test('atualizar projeto', function () {
    $projeto = Projeto::create([
        'name' => 'Projeto Antigo',
    ]);

    $this->putJson("/api/projetos/{$projeto->id}", [
        'name'   => 'Projeto Atualizado',
        'status' => 'finalizado',
    ])
        ->assertOk()
        ->assertJsonFragment(['name' => 'Projeto Atualizado']);
});

test('deletar projeto', function () {
    $projeto = Projeto::create([
        'name' => 'Projeto Delete',
    ]);

    $this->deleteJson("/api/projetos/{$projeto->id}")
        ->assertNoContent();
});

/*
|--------------------------------------------------------------------------
| PROJETOS DA PESSOA (PIVOT)
|--------------------------------------------------------------------------
*/

test('listar projetos da pessoa', function () {
    $pessoa = Pessoa::create([
        'name'  => 'Ana',
        'email' => 'ana@test.com',
    ]);

    $this->getJson("/api/pessoas/{$pessoa->id}/projetos")
        ->assertOk();
});

test('vincular projeto a pessoa', function () {
    $pessoa = Pessoa::create([
        'name'  => 'Lucas',
        'email' => 'lucas@test.com',
    ]);

    $projeto = Projeto::create([
        'name' => 'Projeto Link',
    ]);

    $this->postJson("/api/pessoas/{$pessoa->id}/projetos", [
        'projeto_id' => $projeto->id,
    ])
        ->assertOk();
});

test('sincronizar projetos da pessoa', function () {
    $pessoa = Pessoa::create([
        'name'  => 'Bruno',
        'email' => 'bruno@test.com',
    ]);

    $projeto1 = Projeto::create(['name' => 'Projeto 1']);
    $projeto2 = Projeto::create(['name' => 'Projeto 2']);

    $this->putJson("/api/pessoas/{$pessoa->id}/projetos", [
        'projetos' => [$projeto1->id, $projeto2->id],
    ])
        ->assertOk();
});

test('desvincular projeto da pessoa', function () {
    $pessoa = Pessoa::create([
        'name'  => 'Rafael',
        'email' => 'rafael@test.com',
    ]);

    $projeto = Projeto::create([
        'name' => 'Projeto Unlink',
    ]);

    $pessoa->projetos()->attach($projeto->id);

    $this->deleteJson("/api/pessoas/{$pessoa->id}/projetos/{$projeto->id}")
        ->assertOk();
});

/*
|--------------------------------------------------------------------------
| NEWS
|--------------------------------------------------------------------------
*/

test('listar noticias', function () {
    $this->getJson('/api/news')
        ->assertOk();
});

test('criar noticia', function () {
    $author = Pessoa::create([
        'name'  => 'Autor',
        'email' => 'autor@test.com',
    ]);

    $this->postJson('/api/news', [
        'title'      => 'Titulo',
        'body_text'  => 'Conteúdo da notícia',
        'datastamp'  => now()->toDateTimeString(),
        'author_id'  => $author->id,
    ])
        ->assertCreated()
        ->assertJsonFragment(['title' => 'Titulo']);
});

test('mostrar noticia', function () {
    $author = Pessoa::create([
        'name'  => 'Autor',
        'email' => 'autor@test.com',
    ]);

    $news = News::create([
        'title'      => 'Notícia 1',
        'body_text'  => 'Texto',
        'datastamp'  => now()->toDateTimeString(),
        'author_id'  => $author->id,
    ]);

    $this->getJson("/api/news/{$news->id}")
        ->assertOk()
        ->assertJsonFragment(['title' => 'Notícia 1']);
});

test('atualizar noticia', function () {
    $author = Pessoa::create([
        'name'  => 'Autor',
        'email' => 'autor@test.com',
    ]);

    $news = News::create([
        'title'      => 'Antiga',
        'body_text'  => 'Texto',
        'datastamp'  => now()->toDateTimeString(),
        'author_id'  => $author->id,
    ]);

    $this->putJson("/api/news/{$news->id}", [
        'title' => 'Atualizada',
    ])
        ->assertOk()
        ->assertJsonFragment(['title' => 'Atualizada']);
});

test('deletar noticia', function () {
    $author = Pessoa::create([
        'name'  => 'Autor',
        'email' => 'autor@test.com',
    ]);

    $news = News::create([
        'title'      => 'Apagar',
        'body_text'  => 'Texto',
        'datastamp'  => now()->toDateTimeString(),
        'author_id'  => $author->id,
    ]);

    $this->deleteJson("/api/news/{$news->id}")
        ->assertNoContent();
});

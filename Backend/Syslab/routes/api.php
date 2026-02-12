<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PessoaController;
use App\Http\Controllers\ProjetoController;
use App\Http\Controllers\NewsController;


/*
|--------------------------------------------------------------------------
| Pessoas
|--------------------------------------------------------------------------
*/
Route::get('pessoas', [PessoaController::class, 'index']);
Route::post('pessoas', [PessoaController::class, 'store']);
Route::get('pessoas/{id}', [PessoaController::class, 'show']);
Route::put('pessoas/{id}', [PessoaController::class, 'update']);
Route::delete('pessoas/{id}', [PessoaController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Projetos da Pessoa
|--------------------------------------------------------------------------
*/
Route::get('pessoas/{id}/projetos', [PessoaController::class, 'projetos']);
Route::post('pessoas/{id}/projetos', [PessoaController::class, 'attachProjeto']);
Route::put('pessoas/{id}/projetos', [PessoaController::class, 'syncProjetos']);
Route::delete('pessoas/{id}/projetos/{projetoId}', [PessoaController::class, 'detachProjeto']);

/*
|--------------------------------------------------------------------------
| Projetos
|--------------------------------------------------------------------------
*/
Route::get('projetos', [ProjetoController::class, 'index']);
Route::post('projetos', [ProjetoController::class, 'store']);
Route::get('projetos/{id}', [ProjetoController::class, 'show']);
Route::put('projetos/{id}', [ProjetoController::class, 'update']);
Route::delete('projetos/{id}', [ProjetoController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| News
|--------------------------------------------------------------------------
*/
Route::get('news', [NewsController::class, 'index']);
Route::post('news', [NewsController::class, 'store']);
Route::get('news/{id}', [NewsController::class, 'show']);
Route::put('news/{id}', [NewsController::class, 'update']);
Route::delete('news/{id}', [NewsController::class, 'destroy']);

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PessoaController;
use App\Http\Controllers\ProjetoController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\UserController;

//proteja todas as rotas com autenticação
Route::middleware('auth:sanctum')->group(function () {
    /*
|--------------------------------------------------------------------------
| Pessoas
|--------------------------------------------------------------------------
*/
    Route::post('pessoas', [PessoaController::class, 'store']);
    Route::put('pessoas/{id}', [PessoaController::class, 'update']);
    Route::delete('pessoas/{id}', [PessoaController::class, 'destroy']);

    /*
|--------------------------------------------------------------------------
| Projetos da Pessoa
|--------------------------------------------------------------------------
*/
    Route::post('pessoas/{id}/projetos', [PessoaController::class, 'attachProjeto']);
    Route::put('pessoas/{id}/projetos', [PessoaController::class, 'syncProjetos']);
    Route::delete('pessoas/{id}/projetos/{projetoId}', [PessoaController::class, 'detachProjeto']);

    /*
|--------------------------------------------------------------------------
| Projetos
|--------------------------------------------------------------------------
*/

    Route::post('projetos', [ProjetoController::class, 'store']);
    Route::put('projetos/{id}', [ProjetoController::class, 'update']);
    Route::delete('projetos/{id}', [ProjetoController::class, 'destroy']);

    /*
|--------------------------------------------------------------------------
| News
|--------------------------------------------------------------------------
*/
    Route::post('news', [NewsController::class, 'store']);
    Route::put('news/{id}', [NewsController::class, 'update']);
    Route::delete('news/{id}', [NewsController::class, 'destroy']);

    Route::post('user/logout', [UserController::class, 'logout']);
    Route::get('user/me', [UserController::class, 'me']);
});

Route::post('user/login', [UserController::class, 'login']);
Route::get('pessoas', [PessoaController::class, 'index']);
Route::get('pessoas/{id}', [PessoaController::class, 'show']);
Route::get('pessoas/{id}/projetos', [PessoaController::class, 'projetos']);
Route::get('projetos', [ProjetoController::class, 'index']);
Route::get('projetos/{id}', [ProjetoController::class, 'show']);
Route::get('news', [NewsController::class, 'index']);
Route::get('news/{id}', [NewsController::class, 'show']);

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UseSanctumTokenFromCookie
{
    public function handle(Request $request, Closure $next): Response
    {
        $cookieToken = $request->cookie('access_token');

        if ($cookieToken && !$request->bearerToken()) {
            $request->headers->set('Authorization', 'Bearer '.$cookieToken);
        }

        return $next($request);
    }
}


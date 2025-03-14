<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;


class EnsureAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        Log::info('AdminMiddleware executed');

        $user = $request->user();
        
        if (!$user || !in_array($user->email, config('app.admins'))){
            return response()->json(
                [
                    "message" => "Access Denied. Admins only."
                ], 403);
        }
        return $next($request);
    }
}

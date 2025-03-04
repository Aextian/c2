<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AttachPermissions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // Retrieve all permissions for the authenticated user
            $permissions = $user->getAllPermissions()->pluck('name'); // Use pluck to get only the names

            $username = $user->name;

            // Share permissions with Inertia
            Inertia::share([
                'permissions' => $permissions,
                'username' => $username
            ]);
        }

        return $next($request);
    }
}

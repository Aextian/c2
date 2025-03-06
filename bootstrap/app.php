<?php

use App\Http\Middleware\AttachPermissions;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ShareNotifications;
use App\Http\Middleware\UserPermissions;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            AttachPermissions::class,
            ShareNotifications::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            '/openai/generate-subtasks'
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

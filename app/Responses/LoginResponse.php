<?php

namespace App\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return redirect('/admin/dashboard');
        }

        if ($user->hasRole('staff')) {
            return redirect('/staff/dashboard');
        }

        if ($user->hasRole('user')) {
            return redirect()->route('home');
        }
        
    }
}
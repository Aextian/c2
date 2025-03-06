<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $allowed = $user->canAny(['user-edit', 'user-delete', 'user-create']);
        if (!$allowed) {
            return back()->with('error', 'You do not have permission to view users page.');
        }

        return inertia('users/index', [
            'users' => User::with('roles')->whereNot('email', 'admin')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        $allowed = $user->can('user-create');
        if (!$allowed) {
            return back()->with('error', 'You do not have permission to create users.');
        }


        return inertia('users/create', [
            'roles' => Role::get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $input = $request->validated();
        $input['password'] = Hash::make($input['password']);
        $user = User::create($input);
        $user->assignRole($request->input('roles'));
        return redirect()->route('users.index')->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = auth()->user();
        $allowed = $user->can('user-edit');
        if (!$allowed) {
            return back()->with('error', 'You do not have permission to edit user.');
        }

        return inertia('users/edit', [
            'user' => User::with('roles')->find($id),
            'roles' => Role::get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {

        $user = User::find($id);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        if ($request->input('password')) {
            $user->password = Hash::make($request->input('password'));
        }
        $user->save();
        $user->syncRoles($request->input('roles'));
        return redirect()->route('users.index')->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = auth()->user();
        $allowed = $user->can('user-delete');
        if (!$allowed) {
            return back()->with('error', 'You do not have permission to delete user.');
        }
        User::find($id)->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }
}

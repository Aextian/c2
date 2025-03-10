<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia(
            'permissions/index',
            [
                'roles' => Role::with('permissions')->get()
            ]

        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('permissions/create', [
            'user_permissions' => Permission::get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required',
        ]);

        $role = Role::create(['name' => $request->input('name')]);

        $role->syncPermissions($request->input('permissions'));

        return redirect()->route('permissions.index')->with('success', 'Role created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    { {
            $user = auth()->user();
            if ($user->can('role-edit')) {
                return inertia('permissions/edit', [
                    'role' => Role::with('permissions')->find($id),
                    'user_permissions' => Permission::get(),
                ]);
            }
            return back()->with('error', 'You do not have permission to edit this role.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,' . $id,
            'permissions' => 'required',
        ]);

        $role = Role::find($id);
        $role->name = $request->input('name');
        $role->save();
        $role->syncPermissions($request->input('permissions'));

        return redirect()->route('permissions.index')->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Role::find($id)->delete();
        return redirect()->route('permissions.index')->with('success', 'Role deleted successfully');
    }
}

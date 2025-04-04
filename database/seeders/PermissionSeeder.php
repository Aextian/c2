<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Roles
        $admin = Role::create(['name' => 'admin']);
        // Create Permissions
        $permissions = [
            // User Permissions
            'user-create',
            'user-delete',
            'user-edit',
            // Role Permissions
            'role-create',
            'role-delete',
            'role-edit',
            // Task Permissions
            'task-create',
            'task-delete',
            'task-edit',
            // chart Permissions
            'chart-view',
            //dashboard Permissions
            'coordinator-dashboard',

        ];
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Get all permissions and assign them to admin
        $admin->syncPermissions(Permission::where('name', '!=', 'coordinator-dashboard')->get());

        // Create an Admin User
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'], // Change to your admin email
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password') // Replace with a secure password
            ]
        );

        // Assign the admin role to the user (which includes all permissions)
        $adminUser->assignRole($admin);
    }
}

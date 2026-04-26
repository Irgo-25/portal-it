<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function view(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $search = $request->get('search', '');
        $sortBy = $request->get('sortBy', 'created_at');
        $sortDirection = $request->get('sortDirection', 'desc');
        return User::query()->paginate($perPage)->through( fn($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'created_at' => $user->created_at->format('d-M-Y H:i:s'),
        ]);
    }
    public function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
    public function update(User $user, array $data)
    {
        $user->update([
            'name' => $data['name'] ?? $user->name,
            'email' => $data['email'] ?? $user->email,
            'password' => isset($data['password']) ? Hash::make($data['password']) : $user->password,
        ]);

        return $user;
    }
    public function delete(User $user)
    {
        return $user->delete();
    }
}

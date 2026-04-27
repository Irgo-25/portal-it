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

        $allowedSorts = [
            'name',
            'email',
            'created_at',
        ];

        $sortBy = in_array(
            $request->get('sortBy'),
            $allowedSorts
        )
            ? $request->get('sortBy')
            : 'created_at';

        $sortDirection = $request->get('sortDirection') === 'asc'
            ? 'asc'
            : 'desc';

        return User::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn($user) => [
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

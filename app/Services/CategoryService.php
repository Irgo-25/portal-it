<?php 
namespace App\Services;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryService
{
        public function view(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $search = $request->get('search', '');

        $allowedSorts = [
            'name',
            'description',
        ];

        $sortBy = in_array(
            $request->get('sortBy'),
            $allowedSorts
        )
            ? $request->get('sortBy')
            : 'name';

        $sortDirection = $request->get('sortDirection') === 'asc'
            ? 'asc'
            : 'desc';

        return Category::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn ($category) => [
                'id_category' => $category->id_category,
                'name' => $category->name,
                'description' => $category->description
            ]);
    }
    public function store(array $data)
    {
        $data = Category::create([
            'name' => $data['name'],
            'description' => $data['description'],
        ]);
        return $data;
    }
    public function update( Category $category, array $data)
    {
        $category->updateOrFail([
            'name' => $data['name'],
            'description' => $data['description'],
        ]);
        return $category;
    }
    public function destroy(Category $category)
    {
        $category->delete();
    }
    public function bulkDestroy(Request $request)
    {
        $id_categories = $request->ids;
        return Category::whereIn('id_category', $id_categories)->delete();
    }
}

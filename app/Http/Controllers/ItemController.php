<?php

namespace App\Http\Controllers;

use App\Http\Requests\Item\ItemStore;
use App\Http\Requests\Item\ItemUpdate;
use App\Models\Category;
use App\Models\Departement;
use App\Models\Item;
use App\Models\Uom;
use App\Services\ItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    protected ItemService $itemService;
    public function __construct(ItemService $itemService)
    {
        $this->itemService = $itemService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $items = $this->itemService->view($request);
        $filters = $request->only(['search', 'perPage', 'sortBy', 'sortDirection']);
        return Inertia::render('Item/index-item', compact('items', 'filters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $code = $this->itemService->generateCode();
        $categories = Category::select('id_category as id', 'name')->get();
        $departements = Departement::select('id_departement as id', 'name', 'code')->get();
        $uoms = Uom::select('id_uom as id', 'name', 'symbol')->get();
        return Inertia::render('Item/create-item', compact('code', 'categories', 'departements', 'uoms'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ItemStore $request)
    {
        $data = $request->validated();
        $baseUomCount = collect($data['uoms'])->where('is_base', true)->count();
        if ($baseUomCount !== 1) {
            return back()->withErrors(['uoms' => 'Harus ada tepat satu satuan dasar.']);
        }
        $this->itemService->create($data);
        return redirect()->route('items.index')->with('success', 'Item created successfully.');
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
    public function edit(Item $item)
    {
        $item->load(['itemUoms.uom']);

        return Inertia::render('Item/edit-item', [
            'item'         => $item,
            'categories'   => Category::all(),
            'departements' => Departement::all(),
            'uoms'         => Uom::all(),
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(ItemUpdate $request, Item $item)
    {
        $this->itemService->update($item, $request->validated());

        return redirect()->route('items.index')
            ->with('success', 'Item berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

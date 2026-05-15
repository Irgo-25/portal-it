<?php

namespace App\Http\Controllers;

use App\Http\Requests\UOM\StoreUom;
use App\Http\Requests\UOM\UpdateUom;
use App\Models\Uom;
use App\Services\UomService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UomController extends Controller
{
    protected UomService $uomService;
    public function __construct(UomService $uomService)    {
        $this->uomService = $uomService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $uoms = $this->uomService->view($request);
        $filters = $request->only(['search', 'perPage', 'sortBy', 'sortDirection']);
        return Inertia::render('UOM/index-uom', compact('uoms', 'filters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUom $request)
    {
        $this->uomService->store($request->validated());
        return redirect()->route('uoms.index')->with('success', 'Unit of Measure created successfully.');
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUom $request, Uom $uom)
    {
        $this->uomService->update($uom, $request->validated());
        return redirect()->route('uoms.index')->with('success', 'Unit of Measure updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Uom $uom)
    {
        $this->uomService->delete($uom);
        return redirect()->route('uoms.index')->with('success', 'Unit of Measure deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $this->uomService->bulkDelete($request);
        return redirect()->route('uoms.index')->with('success', 'Selected Unit of Measure deleted successfully.');
    }
}

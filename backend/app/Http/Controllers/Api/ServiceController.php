<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // GET /api/admin/services
    public function index()
    {
        return Service::latest()->get();
    }

    // POST /api/admin/services
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'category'    => ['required', 'string', 'in:Government,Residential,Commercial,Renovation'],
            'description' => ['required', 'string'],
            'status'      => ['required', 'string', 'in:Active,Inactive'],
        ]);

        $service = Service::create($data);

        return response()->json($service, 201);
    }

    // PUT /api/admin/services/{service}
    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'category'    => ['required', 'string', 'in:Government,Residential,Commercial,Renovation'],
            'description' => ['required', 'string'],
            'status'      => ['required', 'string', 'in:Active,Inactive'],
        ]);

        $service->update($data);

        return response()->json($service);
    }

    // DELETE /api/admin/services/{service}
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['message' => 'Service deleted.']);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Court;
use Inertia\Inertia;
use Inertia\Response;

class CourtAvenueController extends Controller
{
    public function index(): Response
    {
        $courts = Court::query()
            ->where('status', 'available')
            ->orderBy('id')
            ->get();

        return Inertia::render('court_avenue/index', [
            'courts' => $courts,
        ]);
    }
}
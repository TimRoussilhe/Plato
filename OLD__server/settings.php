<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../shared/templates/',
            'shared_json_path' => __DIR__ . '/../shared/jsons/',
            'public_json_path' => __DIR__ . '/../public/assets/jsons/',
            'svgs_path' => __DIR__ . '/../shared/jsons/svgs.json',
            'routes_path' => __DIR__ . '/../shared/routes/routes.json'
        ]
    ]
];
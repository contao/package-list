<?php
namespace Deployer;

require 'recipe/common.php';

set('bin/console', '{{bin/php}} {{release_or_current_path}}/api/console');

set('shared_files', ['.env']);
set('shared_dirs', ['var/log', 'var/loupe', 'var/metadata']);
set('writable_dirs', ['var']);

set('allow_anonymous_stats', false);

host('r71.hostingwerk.de')
    ->set('remote_user', 'extensions')
    ->set('deploy_path', '~/public');

task('deploy:build-assets', function () {
    runLocally('npm run build');
});

task('deploy:upload', function () {
    $paths = ['api', 'dist/' => 'public', 'composer.json', 'composer.lock', 'packages.php'];

    foreach ($paths as $source => $target) {
        if (!\is_string($source)) {
            $source = $target;
            $target = '';
        }

        upload(
            $source,
            '{{release_path}}/'.$target,
            ['progress_bar' => false],
        );
    }
});

task('deploy', [
    'deploy:build-assets',
    'deploy:info',
    'deploy:setup',
    'deploy:release',
    'deploy:upload',
    'deploy:shared',
    'deploy:vendors',
    'deploy:symlink',
    'deploy:unlock',
    'deploy:cleanup',
    'deploy:success',
]);

after('deploy:failed', 'deploy:unlock');

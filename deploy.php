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

task('deploy:validate-packages', function () {
    if (!file_exists(__DIR__.'/packages.php')) {
        info('Skipping package validation – packages.php not found.');
        return;
    }

    $validate = null;
    $packages = include(__DIR__.'/packages.php');
    $checkImage = static function (array|null $data) {
        return !$data || !isset($data['image']) || file_exists(__DIR__.'/public'.parse_url($data['image'] ?? null)['path']);
    };
    $validate = static function (array|null $data) use ($checkImage, &$validate) {
        if (!$data) {
            return true;
        }

        if (!$checkImage($data)) {
            return false;
        }

        foreach (($data['languages'] ?? []) as $language) {
            if (!$validate($language)) {
                return false;
            }
        }

        foreach (($data['runs'] ?? []) as $run) {
            if (!$validate($run)) {
                return false;
            }
        }

        return true;
    };

    foreach ($packages as $k => $package) {
        if (!$validate($package)) {
            throw new \RuntimeException(sprintf('Package "%s" seems to have an invalid image.', $package['package'] ?? $package['url'] ?? $k));
        }
    }
});

task('deploy:upload', function () {
    $paths = ['api', 'src', 'dist/' => 'public', 'composer.json', 'composer.lock', 'packages.php'];

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
    'deploy:validate-packages',
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

<?php

declare(strict_types=1);

namespace Contao\PackageList\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[AsCommand('ad-summary', 'Show summary of configured ads.')]
class AdSummaryCommand extends Command
{
    public function __construct(
        #[Autowire(param: 'kernel.project_dir')] private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $packages = @include $this->projectDir.'/packages.php';

        if (!\is_array($packages)) {
            $packages = [];
        }

        $currentMonth = new \DateTimeImmutable('first day of this month 00:00:00');
        $maxDate = $currentMonth;
        $alwaysOn = [];

        foreach ($packages as $package) {
            if (!($package['published'] ?? true)) {
                continue;
            }

            $name = $package['package'] ?? $package['title'] ?? $package['url'] ?? '';
            $hasDatedRun = false;

            foreach ($package['runs'] ?? [] as $run) {
                if (!($run['published'] ?? true)) {
                    continue;
                }

                if (isset($run['start']) || isset($run['stop'])) {
                    $hasDatedRun = true;

                    if (isset($run['start'])) {
                        $startDate = \DateTimeImmutable::createFromFormat('Ymd', (string) $run['start']);
                        if ($startDate && $startDate > $maxDate) {
                            $maxDate = $startDate;
                        }
                    }

                    if (isset($run['stop'])) {
                        $stopDate = \DateTimeImmutable::createFromFormat('Ymd', (string) $run['stop']);
                        if ($stopDate && $stopDate > $maxDate) {
                            $maxDate = $stopDate;
                        }
                    }
                }
            }

            if (!$hasDatedRun) {
                $alwaysOn[] = $name;
            }
        }

        $rows = [];
        $period = new \DatePeriod($currentMonth, new \DateInterval('P1M'), $maxDate->modify('last day of this month 23:59:59'));

        foreach ($period as $dt) {
            $mStart = (int) $dt->format('Ym01');
            $mEnd = (int) $dt->format('Ymt');

            $primary = [];
            $secondary = [];
            $subheader = [];

            foreach ($packages as $package) {
                if (!($package['published'] ?? true)) {
                    continue;
                }

                $name = $package['package'] ?? $package['title'] ?? $package['url'] ?? '';

                foreach ($package['runs'] ?? [] as $run) {
                    if (!($run['published'] ?? true)) {
                        continue;
                    }

                    if (!isset($run['start']) && !isset($run['stop'])) {
                        continue;
                    }

                    if (isset($run['start']) && (int) $run['start'] > $mEnd) {
                        continue;
                    }

                    if (isset($run['stop']) && (int) $run['stop'] < $mStart) {
                        continue;
                    }

                    $item = $name;
                    $dates = [];

                    if (isset($run['start']) && (int) $run['start'] > $mStart) {
                        $startDate = \DateTimeImmutable::createFromFormat('Ymd', (string) $run['start']);
                        if ($startDate) {
                            $dates[] = \sprintf('from %s', $startDate->format('d.m.Y'));
                        }
                    }

                    if (isset($run['stop']) && (int) $run['stop'] < $mEnd) {
                        $stopDate = \DateTimeImmutable::createFromFormat('Ymd', (string) $run['stop']);
                        if ($stopDate) {
                            $dates[] = \sprintf('until %s', $stopDate->format('d.m.Y'));
                        }
                    }

                    if (!empty($dates)) {
                        $item .= \sprintf(' (%s)', implode(' ', $dates));
                    }

                    $position = strtolower($run['position'] ?? 'primary');
                    if ('secondary' === $position) {
                        $secondary[] = $item;
                    } elseif ('subheader' === $position) {
                        $subheader[] = $item;
                    } else {
                        $primary[] = $item;
                    }
                }
            }

            if (empty($primary) && empty($secondary) && empty($subheader)) {
                continue;
            }

            $rows[] = [
                $dt->format('m/Y'),
                implode("\n", array_unique($primary)),
                implode("\n", array_unique($secondary)),
                implode("\n", array_unique($subheader)),
            ];
        }

        $io = new SymfonyStyle($input, $output);
        $io->table(['Month/Year', 'Primary', 'Secondary', 'Subheader'], $rows);

        if (!empty($alwaysOn)) {
            $io->section('Always on');
            $io->listing(array_unique($alwaysOn));
        }

        return Command::SUCCESS;
    }
}

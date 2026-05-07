import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import clsx from 'clsx';

const nav = [
  { to: '/dashboard', label: 'Dashboard', desc: 'Resumen y KPIs' },
  { to: '/findings', label: 'Hallazgos', desc: 'Detecciones' },
  { to: '/rules', label: 'Reglas', desc: 'Patrones' },
  { to: '/audit', label: 'Auditoría', desc: 'Trazabilidad' },
] as const;

function NavItem({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'group flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-all',
          isActive
            ? 'bg-gradient-to-r from-emerald-500/15 to-sky-500/10 text-white ring-1 ring-emerald-500/30'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        )
      }
    >
      <span className="text-sm font-semibold tracking-tight">{label}</span>
      <span className="text-xs font-normal opacity-70">{desc}</span>
    </NavLink>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  useEffect(() => {
    let cancelled = false;
    axios
      .get('/api/v1/health', { timeout: 4000 })
      .then(() => {
        if (!cancelled) setApiStatus('ok');
      })
      .catch(() => {
        if (!cancelled) setApiStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(14,165,233,0.06),transparent)]" />

      <div className="relative flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/70 px-4 py-6 backdrop-blur-xl">
          <div className="mb-8 px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20">
                BG
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">BankGuard</p>
                <p className="text-[11px] text-slate-500">Postura de seguridad</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>

          <div className="mt-auto space-y-3 border-t border-slate-800/80 pt-6">
            <div
              className={clsx(
                'flex items-center gap-2 rounded-lg px-2 py-2 text-xs ring-1',
                apiStatus === 'ok' && 'bg-emerald-950/40 text-emerald-200 ring-emerald-900/50',
                apiStatus === 'error' && 'bg-rose-950/40 text-rose-200 ring-rose-900/50',
                apiStatus === 'checking' && 'bg-slate-900/80 text-slate-400 ring-slate-800'
              )}
            >
              <span
                className={clsx(
                  'h-2 w-2 shrink-0 rounded-full',
                  apiStatus === 'ok' && 'bg-emerald-400 shadow-[0_0_10px_theme(colors.emerald.400)]',
                  apiStatus === 'error' && 'bg-rose-400',
                  apiStatus === 'checking' && 'animate-pulse bg-slate-500'
                )}
              />
              <span className="font-medium">
                {apiStatus === 'ok' && 'API conectada'}
                {apiStatus === 'error' && 'API no disponible (¿puerto 8000?)'}
                {apiStatus === 'checking' && 'Comprobando API…'}
              </span>
            </div>
            <p className="px-1 text-[11px] leading-relaxed text-slate-500">
              Frontend en Vite: el proxy envía{' '}
              <code className="rounded bg-slate-900 px-1 font-mono text-slate-400">/api</code> →{' '}
              <code className="rounded bg-slate-900 px-1 font-mono text-slate-400">localhost:8000</code>
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/55 px-6 py-4 backdrop-blur-md">
            <h1 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Panel de control
            </h1>
          </header>
          <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

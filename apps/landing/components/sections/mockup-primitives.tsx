'use client';

import {
  IconUsers,
  IconBuilding,
  IconGitBranch,
  IconShield,
  IconFileSpreadsheet,
  IconSettings,
  IconBell,
  IconSearch,
  IconCircleCheck,
  IconClock,
  IconTrendingUp,
} from '@tabler/icons-react';
import { Badge } from '../../components/ui/badge';
import { EmployeeDemo, BranchDemo } from '../../lib/types';
import { useLanguage } from '../../components/sections/language-context';

export function MockupAppShell({
  children,
  activeNav = 'dashboard',
  companyName,
  showWatermark = true,
}: {
  children: React.ReactNode;
  activeNav?: 'dashboard' | 'employees' | 'branches' | 'roles' | 'import' | 'settings';
  companyName?: string;
  showWatermark?: boolean;
}) {
  const { lang, dir, t } = useLanguage();

  const effectiveCompanyName =
    companyName ||
    (lang === 'ar' ? 'شركة لومينا للتقنية والخدمات ش.م.م' : 'Lumina Tech & Services SAE');

  const navItems = [
    { id: 'dashboard', label: lang === 'ar' ? 'لوحة المعلومات' : 'Dashboard', icon: IconBuilding },
    { id: 'employees', label: lang === 'ar' ? 'سجل الموظفين' : 'Employees', icon: IconUsers },
    { id: 'branches', label: lang === 'ar' ? 'الفروع التشغيلية' : 'Branches', icon: IconGitBranch },
    { id: 'roles', label: lang === 'ar' ? 'المستخدمون والصلاحيات' : 'Roles & Access', icon: IconShield },
    { id: 'import', label: lang === 'ar' ? 'استيراد البيانات' : 'Data Import', icon: IconFileSpreadsheet },
    { id: 'settings', label: lang === 'ar' ? 'إعدادات المنشأة' : 'Settings', icon: IconSettings },
  ];

  return (
    <div
      dir={dir}
      className="w-full bg-[#faf8ff] border border-surface-dim rounded-2xl shadow-[0_12px_32px_-8px_rgba(19,27,46,0.06),0_2px_6px_-1px_rgba(19,27,46,0.03)] overflow-hidden text-[#131b2e] select-none text-start font-sans"
    >
      {/* Top Application Browser Bar */}
      <div className="bg-white border-b border-surface-dim px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Window dots & System Identifier */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
          </div>
          <div className="hidden sm:flex items-center gap-2 ms-3 border-s border-surface-dim ps-3">
            <span className="w-2 h-2 rounded-full bg-[#006c49]" />
            <span className="text-xs font-semibold text-[#131b2e] tracking-tight">
              {effectiveCompanyName}
            </span>
          </div>
        </div>

        {/* Global Mockup Search & Top Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-surface-container-low border border-surface-dim rounded-lg px-2.5 py-1 text-xs text-outline w-52">
            <IconSearch className="w-3.5 h-3.5" />
            <span className="truncate">
              {lang === 'ar' ? 'بحث عن موظف، فرع، أو قسم...' : 'Search employee, branch...'}
            </span>
          </div>
          <div className="p-1 text-outline hover:text-[#131b2e] rounded-md transition-colors relative">
            <IconBell className="w-4 h-4" />
            <span className="absolute top-1 inset-e-1 w-1.5 h-1.5 bg-surface-container-low rounded-full" />
          </div>
          <div className="flex items-center gap-2 border-s border-surface-dim ps-2.5">
            <div className="w-7 h-7 rounded-full bg-[#e6f7ef] border border-primary-fixed/70 flex items-center justify-center text-xs font-bold text-[#006c49]">
              {lang === 'ar' ? 'أش' : 'AS'}
            </div>
            <div className="hidden lg:block text-start leading-tight">
              <p className="text-xs font-semibold text-[#131b2e]">
                {lang === 'ar' ? 'أحمد الشريف' : 'Ahmed El-Sherif'}
              </p>
              <p className="text-[10px] text-outline">
                {lang === 'ar' ? 'المدير العام' : 'General Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Shell Workspace: Sidebar + Canvas */}
      <div className="flex min-h-115 bg-[#faf8ff]">
        {/* Mockup Sidebar */}
        <aside className="w-14 sm:w-48 lg:w-56 bg-white border-e border-surface-dim flex flex-col justify-between shrink-0 py-3">
          <div className="space-y-1 px-2">
            <div className="px-2 py-1.5 mb-2 hidden sm:block">
              <span className="text-[11px] font-semibold text-outline tracking-wider uppercase">
                {lang === 'ar' ? 'المساحة الإدارية' : 'Workspace'}
              </span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeNav;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                    ? 'bg-[#e6f7ef] text-[#006c49] font-semibold border border-primary-fixed/70'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-[#131b2e]'
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#006c49]' : 'text-outline'
                      }`}
                  />
                  <span className="hidden sm:inline truncate">{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Sidebar Status Pill */}
          <div className="px-2 pt-2 border-t border-surface-dim hidden sm:block">
            <div className="bg-surface-container-low border border-surface-dim rounded-lg p-2.5 text-[11px]">
              <div className="flex items-center justify-between text-[#131b2e] mb-1 font-medium">
                <span>{lang === 'ar' ? 'حالة السجلات' : 'Record Health'}</span>
                <span className="text-[#006c49] font-bold tabular-nums">98.4%</span>
              </div>
              <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#006c49] h-full rounded-full w-[98.4%]" />
              </div>
              <p className="text-[10px] text-outline mt-1.5">
                {lang === 'ar' ? '248 سجل نشط ومحدث' : '248 active verified profiles'}
              </p>
            </div>
          </div>
        </aside>

        {/* Workspace Canvas */}
        <div className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-x-auto relative">
          {showWatermark && (
            <div className="absolute bottom-2 inset-e-3 pointer-events-none">
              <span className="text-[10px] tracking-wide text-outline font-mono bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-surface-dim">
                {t.demoWatermark}
              </span>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function MockupMetricTile({
  label,
  value,
  subtext,
  trend,
  badgeText,
  variant = 'emerald',
}: {
  label: string;
  value: string | number;
  subtext: string;
  trend?: string;
  badgeText?: string;
  variant?: 'emerald' | 'lime' | 'slate';
}) {
  return (
    <div className="bg-white border border-surface-dim rounded-xl p-3.5 sm:p-4 shadow-[0_1px_3px_0_rgba(19,27,46,0.03)] hover:border-outline-variant transition-all">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-medium text-on-surface-variant">{label}</span>
        {badgeText && (
          <Badge
            variant={variant === 'emerald' ? 'emerald' : variant === 'lime' ? 'lime' : 'slate'}
            size="sm"
          >
            {badgeText}
          </Badge>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight tabular-nums">
          {value}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-outline pt-1 border-t border-surface-container-low">
        <span className="truncate">{subtext}</span>
        {trend && (
          <span className="text-[#006c49] font-semibold text-[11px] shrink-0 flex items-center gap-0.5">
            <IconTrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

export function MockupEmployeeRow({ employee }: { employee: EmployeeDemo }) {
  const { lang } = useLanguage();
  return (
    <tr className="border-b border-surface-container-low hover:bg-surface-container-low/60 transition-colors text-xs">
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#e6f7ef] border border-primary-fixed/70 flex items-center justify-center font-bold text-[#006c49] text-[11px]">
            {employee.avatarSeed}
          </div>
          <div>
            <p className="font-semibold text-[#131b2e] text-xs">{employee.name}</p>
            <p className="text-[10px] text-outline font-mono">{employee.id}</p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3 text-on-surface-variant font-medium hidden sm:table-cell">
        {employee.role}
      </td>
      <td className="py-2.5 px-3 text-outline hidden md:table-cell">
        {employee.branch}
      </td>
      <td className="py-2.5 px-3 text-start">
        {employee.status === 'active' ? (
          <Badge variant="emerald" size="sm">
            <IconCircleCheck className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'نشط' : 'Active'}
          </Badge>
        ) : (
          <Badge variant="amber" size="sm">
            <IconClock className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'إجازة' : 'Leave'}
          </Badge>
        )}
      </td>
    </tr>
  );
}

export function MockupBranchItem({ branch }: { branch: BranchDemo }) {
  const { lang } = useLanguage();
  return (
    <div className="bg-surface-container-low/70 border border-surface-dim rounded-xl p-3 hover:bg-white hover:border-outline-variant transition-all">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <IconGitBranch className="w-3.5 h-3.5 text-[#006c49]" />
          <h4 className="text-xs font-bold text-[#131b2e]">{branch.name}</h4>
        </div>
        <span className="text-[10px] font-mono text-outline bg-white border border-surface-dim px-1.5 py-0.5 rounded">
          {branch.code}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
        <span>
          {lang === 'ar' ? 'المدينة:' : 'City:'} <strong className="text-[#131b2e]">{branch.city}</strong>
        </span>
        <span>
          <strong className="text-[#006c49] tabular-nums font-bold">{branch.employeeCount}</strong>{' '}
          {lang === 'ar' ? 'موظف' : 'employees'}
        </span>
      </div>
    </div>
  );
}

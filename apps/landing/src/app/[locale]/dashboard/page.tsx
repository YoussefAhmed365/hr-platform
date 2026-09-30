'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AuthLanguageProvider, useAuthLanguage } from '../../../../components/auth/auth-language-context';
import {
  MockupAppShell,
  MockupMetricTile,
  MockupEmployeeRow,
  MockupBranchItem,
} from '../../../../components/sections/mockup-primitives';
import { authService, type RegisteredCompany } from '../../../../lib/auth/service';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconRefresh,
  IconLogout,
  IconBuilding,
  IconUsers,
  IconGitBranch,
} from '@tabler/icons-react';

function DashboardContent() {
  const { lang, dir } = useAuthLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'branches'>('overview');
  const [company, setCompany] = useState<RegisteredCompany | null>(null);

  useEffect(() => {
    setCompany(authService.getRegisteredCompany());
  }, []);

  const handleRestartDemo = () => {
    authService.logout();
    window.location.href = `/${lang}/signup`;
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = `/${lang}/login`;
  };

  const companyName = company?.companyName || (lang === 'ar' ? 'شركة لومينا للحلول البرمجية' : 'Lumina Tech Solutions');
  const branchesList = (company?.branches && company.branches.length > 0)
    ? company.branches
    : (lang === 'ar' ? ['المقر الرئيسي - القاهرة', 'فرع الإسكندرية', 'فرع الجيزة'] : ['HQ - Cairo', 'Alexandria Branch', 'Giza Branch']);

  const mockMetrics = [
    {
      id: 'active_staff',
      label: lang === 'ar' ? 'إجمالي قوة العمل' : 'Active Staff Count',
      value: '24',
      subtext: lang === 'ar' ? 'موظف مسجل' : 'Registered members',
      badgeText: lang === 'ar' ? 'مكتمل' : 'Complete',
      variant: 'emerald' as const,
    },
    {
      id: 'branches',
      label: lang === 'ar' ? 'الفروع التشغيلية' : 'Operational Branches',
      value: String(branchesList.length),
      subtext: lang === 'ar' ? 'فروع نشطة' : 'Active locations',
      badgeText: lang === 'ar' ? 'متصل' : 'Connected',
      variant: 'lime' as const,
    },
    {
      id: 'system_status',
      label: lang === 'ar' ? 'جاهزية المنظومة' : 'Platform Readiness',
      value: '100%',
      subtext: lang === 'ar' ? 'مهيأة للتشغيل' : 'Ready to operate',
      badgeText: lang === 'ar' ? 'نشط' : 'Active',
      variant: 'emerald' as const,
    },
  ];

  const mockEmployees = [
    {
      id: '1',
      name: company?.fullName || (lang === 'ar' ? 'أحمد محمود العوضي' : 'Ahmed Mahmoud'),
      role: lang === 'ar' ? 'مدير المنشأة (Super Admin)' : 'Company Administrator',
      department: lang === 'ar' ? 'الإدارة التنفيذية' : 'Executive Management',
      branch: branchesList[0] || (lang === 'ar' ? 'المقر الرئيسي' : 'Headquarters'),
      status: 'active' as const,
      joinedDate: lang === 'ar' ? 'اليوم' : 'Today',
      avatarSeed: 'admin',
    },
    {
      id: '2',
      name: lang === 'ar' ? 'سارة محمد إبراهيم' : 'Sarah Ibrahim',
      role: lang === 'ar' ? 'مدير الموارد البشرية' : 'HR Director',
      department: lang === 'ar' ? 'الموارد البشرية' : 'Human Resources',
      branch: branchesList[0] || (lang === 'ar' ? 'المقر الرئيسي' : 'Headquarters'),
      status: 'active' as const,
      joinedDate: '2026-09-15',
      avatarSeed: 'sarah',
    },
    {
      id: '3',
      name: lang === 'ar' ? 'عمر فاروق الشناوي' : 'Omar El-Shenawy',
      role: lang === 'ar' ? 'مدير العمليات التشغيلية' : 'Operations Manager',
      department: lang === 'ar' ? 'العمليات' : 'Operations',
      branch: branchesList[1] || branchesList[0] || (lang === 'ar' ? 'المقر الرئيسي' : 'Headquarters'),
      status: 'active' as const,
      joinedDate: '2026-09-20',
      avatarSeed: 'omar',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Celebration MVP Banner */}
        <div className="relative rounded-2xl bg-linear-to-r from-[#006c49] via-[#005236] to-[#003824] p-5 sm:p-6 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#9df7cd]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-semibold text-[#9df7cd]">
                <IconCheck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'اكتمل التدفق بنجاح (End-to-End MVP)' : 'Flow Completed Successfully'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {lang === 'ar'
                  ? `مرحباً بك في لوحة تحكم: ${companyName}`
                  : `Welcome to ${companyName} Dashboard`}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                {lang === 'ar'
                  ? 'تم تسجيل الشركة وتأكيد البريد الإلكتروني وإتمام التهيئة الهيكلية بنجاح. هذه هي مساحة العمل الجاهزة للربط مع الـ Backend.'
                  : 'Company registration, email verification, and structural onboarding are all complete. This workspace is ready for backend integration.'}
              </p>
            </div>

            {/* Quick Demo Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleRestartDemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20"
              >
                <IconRefresh className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إعادة تجربة التسجيل' : 'Restart Signup Flow'}</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#006c49] hover:bg-[#e6f7ef] text-xs font-bold transition-colors shadow-xs"
              >
                <IconLogout className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mock Application Workspace Shell */}
        <MockupAppShell
          activeNav={activeTab === 'overview' ? 'dashboard' : activeTab === 'employees' ? 'employees' : 'branches'}
          companyName={companyName}
          showWatermark={false}
        >
          <div className="space-y-6">
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-surface-dim pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-[#006c49] text-white shadow-xs'
                    : 'text-[#3c4a42] hover:bg-[#e6f7ef] hover:text-[#006c49]'
                }`}
              >
                <IconBuilding className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employees')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'employees'
                    ? 'bg-[#006c49] text-white shadow-xs'
                    : 'text-[#3c4a42] hover:bg-[#e6f7ef] hover:text-[#006c49]'
                }`}
              >
                <IconUsers className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'سجل الموظفين' : 'Employees'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('branches')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'branches'
                    ? 'bg-[#006c49] text-white shadow-xs'
                    : 'text-[#3c4a42] hover:bg-[#e6f7ef] hover:text-[#006c49]'
                }`}
              >
                <IconGitBranch className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الفروع التشغيلية' : 'Branches'}</span>
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Metric Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {mockMetrics.map((m) => (
                    <MockupMetricTile
                      key={m.id}
                      label={m.label}
                      value={m.value}
                      subtext={m.subtext}
                      badgeText={m.badgeText}
                      variant={m.variant}
                    />
                  ))}
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Setup Summary Card */}
                  <div className="p-4 rounded-xl border border-surface-dim bg-white space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
                      {lang === 'ar' ? 'تفاصيل المنشأة المسجلة' : 'Registered Organization Details'}
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-surface-container-low">
                        <span className="text-[#3c4a42]">{lang === 'ar' ? 'اسم المنشأة' : 'Company Name'}:</span>
                        <span className="font-semibold text-[#131b2e]">{companyName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-surface-container-low">
                        <span className="text-[#3c4a42]">{lang === 'ar' ? 'مدير الحساب' : 'Admin Name'}:</span>
                        <span className="font-semibold text-[#131b2e]">{company?.fullName || 'أحمد محمود'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-surface-container-low">
                        <span className="text-[#3c4a42]">{lang === 'ar' ? 'البريد الإلكتروني' : 'Admin Email'}:</span>
                        <span dir="ltr" className="font-semibold text-[#006c49]">{company?.email || 'admin@company.com'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#3c4a42]">{lang === 'ar' ? 'الهيكل الإداري' : 'Company Structure'}:</span>
                        <span className="font-semibold text-[#131b2e]">
                          {company?.structure === 'single'
                            ? (lang === 'ar' ? 'مقر واحد فقط' : 'Single Location')
                            : (lang === 'ar' ? `فروع متعددة (${branchesList.length})` : `Multi-Branch (${branchesList.length})`)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Readiness Card */}
                  <div className="p-4 rounded-xl border border-surface-dim bg-white space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
                      {lang === 'ar' ? 'حالة التفعيل والجاهزية' : 'Activation Status'}
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-[#131b2e]">
                        <span className="w-4 h-4 rounded-full bg-[#e6f7ef] text-[#006c49] flex items-center justify-center text-[10px] font-bold">✓</span>
                        <span>{lang === 'ar' ? 'تم إنشاء حساب المسؤول بنجاح' : 'Admin account created successfully'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#131b2e]">
                        <span className="w-4 h-4 rounded-full bg-[#e6f7ef] text-[#006c49] flex items-center justify-center text-[10px] font-bold">✓</span>
                        <span>{lang === 'ar' ? 'تم تأكيد البريد الإلكتروني رسمياً' : 'Official email verified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#131b2e]">
                        <span className="w-4 h-4 rounded-full bg-[#e6f7ef] text-[#006c49] flex items-center justify-center text-[10px] font-bold">✓</span>
                        <span>{lang === 'ar' ? 'تم اعتماد الهيكل التنظيمي والفروع' : 'Structure and branches initialized'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#131b2e]">
                        <span className="w-4 h-4 rounded-full bg-[#f4fce3] text-[#416900] flex items-center justify-center text-[10px] font-bold">✓</span>
                        <span>{lang === 'ar' ? 'المنظومة بانتظار اتصال واجهة برمجة التطبيقات (API)' : 'Ready for API backend integration'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Employees */}
            {activeTab === 'employees' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#131b2e]">
                    {lang === 'ar' ? 'قائمة أعضاء الفريق والمشرفين' : 'Team Members & Staff'}
                  </h3>
                  <Badge variant="emerald" size="sm">
                    {mockEmployees.length} {lang === 'ar' ? 'أعضاء' : 'Members'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {mockEmployees.map((emp) => (
                    <MockupEmployeeRow key={emp.id} employee={emp} />
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Branches */}
            {activeTab === 'branches' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#131b2e]">
                    {lang === 'ar' ? 'الفروع والمقرات التابعة' : 'Branches & Locations'}
                  </h3>
                  <Badge variant="emerald" size="sm">
                    {branchesList.length} {lang === 'ar' ? 'فروع' : 'Branches'}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {branchesList.map((branchName, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-surface-dim bg-white flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#e6f7ef] text-[#006c49] flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#131b2e]">{branchName}</h4>
                          <p className="text-[11px] text-[#6c7a71]">
                            {lang === 'ar' ? 'فرع تشغيلي نشط' : 'Active operational branch'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="emerald" size="sm">
                        {lang === 'ar' ? 'نشط' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </MockupAppShell>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  return (
    <AuthLanguageProvider initialLocale={locale}>
      <DashboardContent />
    </AuthLanguageProvider>
  );
}

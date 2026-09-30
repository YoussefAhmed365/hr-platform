'use client';

import { LanguageProvider } from '../../../components/sections/language-context';
import { AnnouncementBar } from '../../../components/sections/announcement-bar';
import { Navbar } from '../../../components/sections/navbar';
import { Hero } from '../../../components/sections/hero';
import { DashboardPreview } from '../../../components/sections/dashboard-preview';
import { CredibilityStrip } from '../../../components/sections/credibility-strip';
import { ValueProposition } from '../../../components/sections/value-proposition';
import { ProductShowcase } from '../../../components/sections/product-showcase';
import { OrganizationSection } from '../../../components/sections/organization-section';
import { ExcelImportSection } from '../../../components/sections/excel-import-section';
import { SecuritySection } from '../../../components/sections/security-section';
import { GrowthSection } from '../../../components/sections/growth-section';
import { PricingSection } from '../../../components/sections/pricing-section';
import { FaqSection } from '../../../components/sections/faq-section';
import { FinalCta } from '../../../components/sections/final-cta';
import { Footer } from '../../../components/sections/footer';

export default function LandingPage() {
	return (
		<LanguageProvider>
			<div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
				{/* 1. Announcement Bar */}
				<AnnouncementBar />

				{/* 2. Navbar */}
				<Navbar />

				{/* Main Content Flow */}
				<main className="flex-1">
					{/* 3. Hero */}
					<Hero />

					{/* 4. Hero Product Dashboard Preview */}
					<DashboardPreview />

					{/* 5. Credibility / Trust Strip */}
					<CredibilityStrip />

					{/* 6. Value Proposition */}
					<ValueProposition />

					{/* 7 & 8. Company Workspace & Employee Directory Showcases */}
					<ProductShowcase />

					{/* 9. Organization Structure (Company -> Branches -> Employees) */}
					<OrganizationSection />

					{/* 10. Excel Bulk Import */}
					<ExcelImportSection />

					{/* 11. Security / Trust */}
					<SecuritySection />

					{/* 12. Built to Grow (Today vs As Needs Grow) */}
					<GrowthSection />

					{/* 13. Pricing */}
					<PricingSection />

					{/* 14. FAQ */}
					<FaqSection />

					{/* 15. Final CTA */}
					<FinalCta />
				</main>

				{/* 16. Footer */}
				<Footer />
			</div>
		</LanguageProvider>
	);
}
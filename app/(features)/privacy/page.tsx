'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage(): React.JSX.Element {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
                {/* Back Navigation */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>

                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-muted text-sm">
                        Last Updated: January 21, 2026
                    </p>
                </header>

                {/* Content */}
                <article className="typography prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            This Privacy Policy describes how the Quran App (&quot;we,&quot; &quot;our,&quot; or &quot;the Application&quot;)
                            handles information when you use our services. We are committed to protecting your privacy
                            and ensuring transparency about our data practices.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            The Application is designed with privacy as a priority. We collect minimal information necessary
                            to provide our services:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                            <li>
                                <strong>Local Storage Data:</strong> Your preferences (theme, font size, translation choices),
                                bookmarks, reading progress, and planner data are stored locally on your device using browser
                                localStorage. This data never leaves your device.
                            </li>
                            <li>
                                <strong>No Personal Information:</strong> We do not collect, store, or process any personally
                                identifiable information such as names, email addresses, or account credentials.
                            </li>
                            <li>
                                <strong>No Analytics Tracking:</strong> By default, the Application does not use analytics
                                or tracking services to monitor your behavior.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">3. Third-Party Services</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            The Application utilizes the following third-party services to provide Quranic content:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                            <li>
                                <strong>Quran Foundation API:</strong> We retrieve Quranic verses, translations, tafsir,
                                and audio recitations from the Quran Foundation&apos;s public Content APIs. Your requests to
                                this service are subject to the{' '}
                                <a
                                    href="https://quran.foundation/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline"
                                >
                                    Quran Foundation Privacy Policy
                                </a>.
                            </li>
                            <li>
                                <strong>Audio Content:</strong> Audio recitations may be served from external sources
                                including Quran.com CDN and archive.org.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Storage and Security</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            All user preferences, bookmarks, and reading data are stored exclusively in your browser&apos;s
                            localStorage. This data remains on your device and is not transmitted to any server.
                            You may clear this data at any time through your browser settings or by clearing the
                            Application&apos;s site data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">5. Cookies</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            The Application uses a single, non-tracking cookie to store your theme preference (light or dark mode).
                            This cookie is essential for providing a consistent user experience and does not contain any
                            personally identifiable information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">6. Children&apos;s Privacy</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            The Application is suitable for users of all ages. We do not knowingly collect any personal
                            information from children or any other users. The Application provides educational Quranic
                            content without requiring registration or personal data submission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">7. Changes to This Policy</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            We may update this Privacy Policy from time to time. Any changes will be reflected on this page
                            with an updated &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">8. Open Source</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            This Application is open source. You may review the complete source code to verify our
                            privacy practices and data handling procedures.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            If you have any questions or concerns regarding this Privacy Policy, please open an issue
                            on our GitHub repository or contact the project maintainers.
                        </p>
                    </section>
                </article>

                {/* Footer Links */}
                <footer className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-wrap gap-6 text-sm text-muted">
                        <Link href="/terms" className="hover:text-accent transition-colors">
                            Terms of Use
                        </Link>
                        <Link href="/" className="hover:text-accent transition-colors">
                            Home
                        </Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}

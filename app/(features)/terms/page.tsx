'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfUsePage(): React.JSX.Element {
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
                        Terms of Use
                    </h1>
                    <p className="text-muted text-sm">
                        Last Updated: January 21, 2026
                    </p>
                </header>

                {/* Content */}
                <article className="typography prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            By accessing or using the Quran App (&quot;the Application&quot;), you agree to be bound by these
                            Terms of Use. If you do not agree to these terms, please do not use the Application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            The Application provides access to the text of the Holy Quran, translations in multiple languages,
                            tafsir (exegesis), and audio recitations by various reciters. The Application is provided free of
                            charge for educational and spiritual purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">3. Quranic Content</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            The Quranic content provided through this Application is sourced from the Quran Foundation and
                            is subject to the following conditions:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                            <li>
                                The Arabic text of the Quran is presented as received from authoritative sources and must
                                not be modified, altered, or misrepresented.
                            </li>
                            <li>
                                Translations are provided for educational purposes and represent the interpretive work of
                                their respective scholars. They should not be considered a replacement for the original
                                Arabic text.
                            </li>
                            <li>
                                Users are encouraged to consult qualified scholars for detailed understanding and
                                interpretation of Quranic verses.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            You agree to use the Application only for lawful purposes and in accordance with these Terms.
                            You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                            <li>
                                Use the Application in any manner that could damage, disable, overburden, or impair the service.
                            </li>
                            <li>
                                Attempt to gain unauthorized access to any portion of the Application or its related systems.
                            </li>
                            <li>
                                Use the content in any context that is disparaging to Islam, promotes extremist ideology,
                                or misrepresents the teachings of the Quran.
                            </li>
                            <li>
                                Redistribute or commercially exploit the Application&apos;s content without appropriate attribution
                                and compliance with applicable licenses.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            The Application is open source software. The source code is available under its respective
                            license terms. However, the following content has separate ownership and licensing:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                            <li>
                                <strong>Quranic Content:</strong> The Arabic Quranic text, translations, tafsir, and audio
                                recitations are provided by the Quran Foundation and are subject to their terms of service.
                            </li>
                            <li>
                                <strong>Fonts:</strong> Arabic fonts used in the Application may be subject to their own
                                licensing terms.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">6. Third-Party Services</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            The Application relies on third-party APIs and services, including the Quran Foundation API,
                            to provide content. We do not control these services and are not responsible for their
                            availability, accuracy, or the terms under which they operate. Your use of third-party
                            content is subject to those providers&apos; respective terms and policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">7. Disclaimer of Warranties</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            THE APPLICATION IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                            EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APPLICATION WILL BE UNINTERRUPTED,
                            ERROR-FREE, OR FREE OF HARMFUL COMPONENTS. WE MAKE NO WARRANTIES REGARDING THE ACCURACY,
                            RELIABILITY, OR COMPLETENESS OF ANY CONTENT PROVIDED THROUGH THE APPLICATION.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE APPLICATION&apos;S DEVELOPERS AND
                            CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                            OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
                            INDIRECTLY, ARISING FROM YOUR USE OF THE APPLICATION.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">9. Modifications to Terms</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            We reserve the right to modify these Terms of Use at any time. Changes will be effective
                            immediately upon posting to the Application. Your continued use of the Application after
                            any changes indicates your acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">10. Governing Law</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            These Terms of Use shall be governed by and construed in accordance with applicable laws,
                            without regard to conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">11. Attribution</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            Quranic content, translations, tafsir, and audio recitations are provided through the
                            Quran Foundation. We gratefully acknowledge their contribution to making the Quran
                            accessible to people worldwide. For more information, visit{' '}
                            <a
                                href="https://quran.foundation"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                            >
                                quran.foundation
                            </a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">12. Contact</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            If you have any questions regarding these Terms of Use, please open an issue on our
                            GitHub repository or contact the project maintainers.
                        </p>
                    </section>
                </article>

                {/* Footer Links */}
                <footer className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-wrap gap-6 text-sm text-muted">
                        <Link href="/privacy" className="hover:text-accent transition-colors">
                            Privacy Policy
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

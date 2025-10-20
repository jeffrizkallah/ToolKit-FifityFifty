/**
 * Privacy Policy Page
 * 
 * Implements US5.6 - Privacy Compliance
 * Comprehensive privacy policy explaining data collection and usage
 */

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

interface PrivacyPageProps {
  params: {
    locale: 'en' | 'ar';
  };
}

export async function generateMetadata({ params }: PrivacyPageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: 'Privacy' });
  
  return {
    title: `${t('title')} | FiftyFifty ToolKit`,
    description: t('sections.intro'),
  };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = params;
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container max-w-4xl py-12 md:py-20">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="text-gray-600">
            {locale === 'ar' ? 'آخر تحديث: 17 أكتوبر 2025' : 'Last Updated: October 17, 2025'}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          {locale === 'ar' ? (
            <>
              {/* Arabic Content */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">مقدمة</h2>
                <p className="text-gray-700 leading-relaxed">
                  مرحباً بك في مجموعة أدوات فيفتي فيفتي (FiftyFifty ToolKit). نحن ملتزمون بحماية خصوصيتك وضمان أمان بياناتك. توضح سياسة الخصوصية هذه كيفية جمعنا للمعلومات واستخدامها وحمايتها عند استخدامك لموقعنا الإلكتروني.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">البيانات التي نجمعها</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نحن نجمع معلومات محدودة لتحسين تجربتك وفهم كيفية استخدام موقعنا:
                </p>
                <ul className="list-disc pr-8 space-y-2 text-gray-700">
                  <li><strong>بيانات الاستخدام المجهولة:</strong> معلومات حول كيفية تفاعلك مع موقعنا (الصفحات التي تمت زيارتها، الوقت المستغرق، الروابط التي تم النقر عليها)</li>
                  <li><strong>المعلومات الفنية:</strong> نوع المتصفح، نظام التشغيل، عنوان IP (مجهول)، إعدادات اللغة</li>
                  <li><strong>ملفات تعريف الارتباط:</strong> ملفات صغيرة مخزنة على جهازك لتذكر تفضيلاتك (مثل تفضيلات اللغة وموافقة ملفات تعريف الارتباط)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>نحن لا نجمع:</strong> أسماء، عناوين بريد إلكتروني، أرقام هواتف، أو أي معلومات تعريف شخصية (PII) ما لم تتصل بنا مباشرة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">كيف نستخدم البيانات</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نستخدم البيانات المجمعة من أجل:
                </p>
                <ul className="list-disc pr-8 space-y-2 text-gray-700">
                  <li>تحسين محتوى وتصميم موقعنا الإلكتروني</li>
                  <li>فهم احتياجات واهتمامات المستخدمين</li>
                  <li>تحليل أنماط الاستخدام وتحسين التنقل</li>
                  <li>ضمان عمل الموقع بشكل صحيح وآمن</li>
                  <li>تذكر تفضيلاتك (اللغة، موافقة ملفات تعريف الارتباط)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">ملفات تعريف الارتباط والتتبع</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نستخدم نوعين من ملفات تعريف الارتباط:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">1. ملفات تعريف الارتباط الضرورية (إلزامية)</h3>
                    <p className="text-gray-700 leading-relaxed">
                      هذه ضرورية لعمل الموقع بشكل صحيح. تتضمن تفضيلات اللغة الخاصة بك وموافقة ملفات تعريف الارتباط. لا يمكن تعطيلها.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2. ملفات تعريف الارتباط التحليلية (اختيارية)</h3>
                    <p className="text-gray-700 leading-relaxed">
                      نستخدم Google Analytics لفهم كيفية استخدام موقعنا. هذه البيانات مجهولة المصدر ولا تحدد هويتك. يمكنك رفض هذه من خلال لافتة موافقة ملفات تعريف الارتباط.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">خدمات الطرف الثالث</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نستخدم الخدمات الخارجية التالية:
                </p>
                <ul className="list-disc pr-8 space-y-2 text-gray-700">
                  <li>
                    <strong>Google Analytics:</strong> لتحليل استخدام الموقع. تخضع لـ{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      سياسة خصوصية Google
                    </a>
                  </li>
                  <li>
                    <strong>YouTube:</strong> لاستضافة مقاطع الفيديو المضمنة. تخضع لـ{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      سياسة خصوصية Google
                    </a>
                  </li>
                  <li>
                    <strong>Vercel:</strong> استضافة الموقع وتسليم المحتوى. تخضع لـ{' '}
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      سياسة خصوصية Vercel
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">حماية البيانات</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نطبق تدابير أمنية متعددة لحماية بياناتك:
                </p>
                <ul className="list-disc pr-8 space-y-2 text-gray-700">
                  <li>تشفير HTTPS/SSL لجميع اتصالات الموقع</li>
                  <li>تخزين البيانات الآمن وتدابير التحكم في الوصول</li>
                  <li>رؤوس الأمان لمنع الهجمات الإلكترونية الشائعة</li>
                  <li>عمليات تدقيق أمنية منتظمة</li>
                  <li>الامتثال لأفضل ممارسات حماية البيانات</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">حقوقك (GDPR)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  بموجب اللائحة العامة لحماية البيانات (GDPR)، لديك الحقوق التالية:
                </p>
                <ul className="list-disc pr-8 space-y-2 text-gray-700">
                  <li><strong>الحق في الوصول:</strong> طلب نسخة من البيانات التي لدينا عنك</li>
                  <li><strong>الحق في التصحيح:</strong> طلب تصحيح البيانات غير الدقيقة</li>
                  <li><strong>الحق في المحو:</strong> طلب حذف بياناتك</li>
                  <li><strong>الحق في تقييد المعالجة:</strong> طلب تقييد استخدام بياناتك</li>
                  <li><strong>الحق في إمكانية نقل البيانات:</strong> تلقي بياناتك بتنسيق منظم ومشترك</li>
                  <li><strong>الحق في الاعتراض:</strong> الاعتراض على معالجة بياناتك</li>
                  <li><strong>الحق في سحب الموافقة:</strong> سحب موافقتك على ملفات تعريف الارتباط في أي وقت</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  ملاحظة: نظراً لأننا نجمع فقط بيانات مجهولة، فقد تكون بعض الحقوق محدودة. إذا كانت لديك أي أسئلة، يرجى الاتصال بنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">التغييرات على هذه السياسة</h2>
                <p className="text-gray-700 leading-relaxed">
                  قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بنشر أي تغييرات على هذه الصفحة مع تاريخ "آخر تحديث" محدث. نشجعك على مراجعة هذه السياسة بشكل دوري.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">اتصل بنا</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات البيانات الخاصة بنا، يرجى الاتصال بنا:
                </p>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="text-gray-700">
                    <strong>فيفتي فيفتي</strong><br />
                    البريد الإلكتروني: privacy@fiftyfifty.org<br />
                    الموقع الإلكتروني: www.fiftyfifty.org
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
              {/* English Content */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to the FiftyFifty ToolKit. We are committed to protecting your privacy and ensuring the security of your data. This Privacy Policy explains how we collect, use, and safeguard information when you use our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect limited information to improve your experience and understand how our site is used:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-gray-700">
                  <li><strong>Anonymous Usage Data:</strong> Information about how you interact with our site (pages visited, time spent, links clicked)</li>
                  <li><strong>Technical Information:</strong> Browser type, operating system, IP address (anonymized), language preferences</li>
                  <li><strong>Cookies:</strong> Small files stored on your device to remember your preferences (e.g., language preference, cookie consent)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>We do not collect:</strong> Names, email addresses, phone numbers, or any personally identifiable information (PII) unless you contact us directly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Data</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the collected data to:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-gray-700">
                  <li>Improve our website content and design</li>
                  <li>Understand user needs and interests</li>
                  <li>Analyze usage patterns and improve navigation</li>
                  <li>Ensure the site functions properly and securely</li>
                  <li>Remember your preferences (language, cookie consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use two types of cookies:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Essential Cookies (Required)</h3>
                    <p className="text-gray-700 leading-relaxed">
                      These are necessary for the site to function properly. They include your language preference and cookie consent. They cannot be disabled.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Analytics Cookies (Optional)</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We use Google Analytics to understand how our site is used. This data is anonymized and does not identify you personally. You can opt out of these through the cookie consent banner.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the following third-party services:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-gray-700">
                  <li>
                    <strong>Google Analytics:</strong> For website usage analytics. Subject to{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Google's Privacy Policy
                    </a>
                  </li>
                  <li>
                    <strong>YouTube:</strong> For embedded video hosting. Subject to{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Google's Privacy Policy
                    </a>
                  </li>
                  <li>
                    <strong>Vercel:</strong> For website hosting and content delivery. Subject to{' '}
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Vercel's Privacy Policy
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement multiple security measures to protect your data:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-gray-700">
                  <li>HTTPS/SSL encryption for all site communications</li>
                  <li>Secure data storage and access control measures</li>
                  <li>Security headers to prevent common web attacks</li>
                  <li>Regular security audits</li>
                  <li>Compliance with data protection best practices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights (GDPR)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Under the General Data Protection Regulation (GDPR), you have the following rights:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-gray-700">
                  <li><strong>Right to Access:</strong> Request a copy of the data we have about you</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                  <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a structured, common format</li>
                  <li><strong>Right to Object:</strong> Object to processing of your data</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent for cookies at any time</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Note: Since we only collect anonymized data, some rights may be limited. If you have any questions, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will post any changes on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="text-gray-700">
                    <strong>FiftyFifty</strong><br />
                    Email: privacy@fiftyfifty.org<br />
                    Website: www.fiftyfifty.org
                  </p>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href={`/${locale}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg
              className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </a>
        </div>
      </div>
    </main>
  );
}


import './globals.css'

export const metadata = {
  title: 'ACC GS Academy | Competitive Exam Coaching in Bihar',
  description:
    'ACC GS Academy provides structured classroom programs, expert guidance, scholarship examinations, test series, study materials, and academic support for competitive examinations.',
  keywords: [
    'ACC GS Academy',
    'competitive exam coaching',
    'coaching institute Bihar',
    'scholarship examinations',
    'test series',
  ],
  authors: [{ name: 'ACC GS Academy' }],
  creator: 'ACC GS Academy',
  openGraph: {
    title: 'ACC GS Academy',
    description:
      'Structured preparation, expert guidance, and student-centered learning for competitive examinations.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'ACC GS Academy',
  },
  twitter: {
    card: 'summary',
    title: 'ACC GS Academy',
    description:
      'Structured preparation, expert guidance, and student-centered learning for competitive examinations.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-background">
        {children}
      </body>
    </html>
  )
} 
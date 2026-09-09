import AuthForm from '@/components/AuthForm'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await searchParams;
  
  return (
    <div className="flex items-center justify-center min-h-[70vh] py-10">
      <AuthForm error={resolvedParams.error} />
    </div>
  )
}

import AppLayout from '@/layouts/app-layout';

export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">Hello World</h1>
        <p className="mt-3 text-lg text-center">Get started</p>
      </div>
    </AppLayout>
  );
}

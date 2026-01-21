import { BuilderView } from '@/components/builder/BuilderView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Website Builder',
  description: 'Build and edit your website with AI.',
};

export default async function BuilderPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;

  return <BuilderView workspaceId={workspaceId} />;
}
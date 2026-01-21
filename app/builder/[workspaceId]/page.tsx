import { BuilderView } from '@/components/builder/BuilderView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepdora AI Website Builder',
  description: 'Nepdora AI Website Builder',
};

export default async function BuilderPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;

  return <BuilderView workspaceId={workspaceId} />;
}
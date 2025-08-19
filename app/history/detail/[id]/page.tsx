import HistoryDetail from '@/components/view/history/historyDetail';

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HistoryDetail id={id} />;
}

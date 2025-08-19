import HistoryDetail from '@/components/view/history/historyDetail';
import React from 'react';

export default function HistoryDetailPage({ params }: { params: { id: string } }) {
  return <HistoryDetail id={params.id} />;
}


import React from 'react';
import { ShieldCheck } from 'lucide-react';
import MetricSourceCard from '../components/dataintegrity/MetricSourceCard';

const METRICS_MAP = [
  // Dashboard & Command Center Metrics
  {
    title: 'Total Account Balance',
    value: '$150.2M',
    description: 'The sum of all outstanding balances across all debt accounts.',
    area: 'Dashboard / Command Center',
    sources: [
      {
        entity: 'Debt',
        field: 'current_balance',
        logic: 'SUM(current_balance)',
        query: "SELECT SUM(current_balance) FROM Debt;",
      },
    ],
  },
  {
    title: 'Total Account Count',
    value: '53,110',
    description: 'The total number of individual debt accounts in the system.',
    area: 'Dashboard / Command Center',
    sources: [
      {
        entity: 'Debt',
        field: 'id',
        logic: 'COUNT(id)',
        query: "SELECT COUNT(id) FROM Debt;",
      },
    ],
  },
  {
    title: 'Total Collected',
    value: '$5.2M',
    description: 'The total sum of all payments received. Does not account for refunds.',
    area: 'Dashboard',
    sources: [
      {
        entity: 'Payment',
        field: 'payment_amount',
        logic: 'SUM(payment_amount)',
        query: "SELECT SUM(payment_amount) FROM Payment WHERE status = 'processed';",
      },
    ],
  },
  {
    title: 'Average Balance',
    value: '$2,828',
    description: 'The average outstanding balance per debt account.',
    area: 'Command Center',
    sources: [
      {
        entity: 'Debt',
        field: 'current_balance',
        logic: 'AVG(current_balance)',
        query: "SELECT AVG(current_balance) FROM Debt;",
      },
    ],
  },
  // Portfolio Management Metrics
  {
    title: 'Total Portfolio Face Value',
    value: '$250.7M',
    description: 'The sum of the original face value of all purchased portfolios.',
    area: 'Portfolio Management',
    sources: [
      {
        entity: 'Portfolio',
        field: 'original_face_value',
        logic: 'SUM(original_face_value)',
        query: "SELECT SUM(original_face_value) FROM Portfolio;",
      },
    ],
  },
  {
    title: 'Average Collection Rate (Portfolio KPI)',
    value: '21.8%',
    description: 'This is a calculated KPI stored on the portfolio record. It represents (total_collected / original_face_value).',
    area: 'Portfolio Management',
    sources: [
      {
        entity: 'Portfolio',
        field: 'kpis.total_collected, original_face_value',
        logic: 'AVG(kpis.total_collected / original_face_value)',
        query: "This is a denormalized value. For live calculation: SELECT AVG(total_collected / face_value) FROM ...",
      },
    ],
  },
  // Buy Back Center Metrics
  {
    title: 'Buy Back Total Exposure',
    value: '$1.25M',
    description: 'The sum of current balances for all accounts with an active buy back request.',
    area: 'Buy Back Center',
    sources: [
      {
        entity: 'BuyBack',
        field: 'current_balance',
        logic: 'SUM(current_balance)',
        query: "SELECT SUM(current_balance) FROM BuyBack WHERE status IN ('pending_review', 'under_review');",
      },
    ],
  },
  {
    title: 'Buy Back Pending Count',
    value: '15',
    description: 'The number of buy back requests awaiting review.',
    area: 'Buy Back Center',
    sources: [
      {
        entity: 'BuyBack',
        field: 'id',
        logic: "COUNT(id) WHERE status = 'pending_review'",
        query: "SELECT COUNT(id) FROM BuyBack WHERE status = 'pending_review';",
      },
    ],
  },
];

export default function DataIntegrity() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold text-primary">Data Integrity</h1>
          <p className="text-muted-foreground mt-1">Monitor data quality, consistency, and validation across all systems</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {METRICS_MAP.map((metric, index) => (
          <MetricSourceCard 
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            area={metric.area}
            sources={metric.sources}
          />
        ))}
      </div>
    </div>
  );
}

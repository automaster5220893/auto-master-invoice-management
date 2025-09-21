import DashboardLayout from '@/components/Layout/DashboardLayout';
import InvoiceForm from '@/components/Invoice/InvoiceForm';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <InvoiceForm />
    </DashboardLayout>
  );
}

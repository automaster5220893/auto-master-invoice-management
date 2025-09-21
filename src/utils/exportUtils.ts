import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from '@/types';

export const exportToPDF = async (invoiceElement: HTMLElement, invoice: Invoice) => {
  try {
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice-${invoice.sNo}-${invoice.customerName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

export const exportToImage = async (invoiceElement: HTMLElement, invoice: Invoice) => {
  try {
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const link = document.createElement('a');
    link.download = `invoice-${invoice.sNo}-${invoice.customerName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
    alert('Error generating image. Please try again.');
  }
};

export const shareInvoice = async (invoice: Invoice) => {
  const shareData = {
    title: `Invoice #${invoice.sNo} - ${invoice.customerName}`,
    text: `Invoice for ${invoice.customerName} - Total: PKR ${invoice.total.toFixed(2)}`,
    url: window.location.href
  };

  if (navigator.share && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing:', error);
      fallbackShare(invoice);
    }
  } else {
    fallbackShare(invoice);
  }
};

const fallbackShare = (invoice: Invoice) => {
  const shareText = `Invoice #${invoice.sNo} for ${invoice.customerName} - Total: PKR ${invoice.total.toFixed(2)}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Invoice details copied to clipboard!');
    }).catch(() => {
      prompt('Copy this text to share:', shareText);
    });
  } else {
    prompt('Copy this text to share:', shareText);
  }
};

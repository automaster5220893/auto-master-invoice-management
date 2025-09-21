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

export const shareInvoice = async (invoiceElement: HTMLElement, invoice: Invoice) => {
  try {
    // Generate image from invoice element
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png', 0.9);
    });

    // Create file from blob
    const file = new File([blob], `invoice-${invoice.sNo}-${invoice.customerName}.png`, {
      type: 'image/png'
    });

    // Prepare share data with image
    const shareData = {
      title: `Invoice #${invoice.sNo} - ${invoice.customerName}`,
      text: `Invoice for ${invoice.customerName} - Total: PKR ${invoice.total.toFixed(2)}`,
      files: [file]
    };

    // Check if Web Share API supports files
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        console.error('Error sharing with Web Share API:', error);
        // Fall back to image download
        await fallbackShareImage(canvas, invoice);
        return;
      }
    }

    // Check if Web Share API exists but doesn't support files
    if (navigator.share) {
      try {
        // Try sharing without files (text only)
        const textShareData = {
          title: `Invoice #${invoice.sNo} - ${invoice.customerName}`,
          text: `Invoice for ${invoice.customerName} - Total: PKR ${invoice.total.toFixed(2)}`
        };
        
        if (navigator.canShare && navigator.canShare(textShareData)) {
          await navigator.share(textShareData);
          // Also download the image
          await fallbackShareImage(canvas, invoice);
          return;
        }
      } catch (error) {
        console.error('Error sharing text:', error);
      }
    }

    // If Web Share API doesn't support files, fall back to image download
    await fallbackShareImage(canvas, invoice);

  } catch (error) {
    console.error('Error generating image for sharing:', error);
    // Fall back to text sharing
    fallbackShareText(invoice);
  }
};

const fallbackShareImage = async (canvas: HTMLCanvasElement, invoice: Invoice) => {
  // Try to copy image to clipboard first (modern browsers)
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png', 0.9);
      });
      
      const clipboardItem = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([clipboardItem]);
      
      alert('Invoice image copied to clipboard! You can now paste it in any app.');
      return;
    } catch (error) {
      console.log('Clipboard copy failed, falling back to download:', error);
    }
  }
  
  // Download the image as fallback
  const link = document.createElement('a');
  link.download = `invoice-${invoice.sNo}-${invoice.customerName}.png`;
  link.href = canvas.toDataURL();
  link.click();
  
  // Show message to user with better instructions
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    alert('Invoice image downloaded! Check your downloads folder and share it through your preferred app (WhatsApp, Email, etc.).');
  } else {
    alert('Invoice image downloaded! You can now share it from your device.');
  }
};

const fallbackShareText = (invoice: Invoice) => {
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

import React, { useState, useEffect } from 'react';
import { 
  X, Send, CheckCircle2, Clock, ShieldCheck, Palette, Film, Code2, Download, Copy, Check, MessageSquare, ExternalLink, Link as LinkIcon
} from 'lucide-react';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const SERVICE_OPTIONS = [
  { id: 'graphic-design', label: 'Graphic Design & Branding', icon: Palette, color: 'text-blue-400 bg-blue-950/60 border-blue-500/40' },
  { id: 'video-editing', label: 'Video Editing & Motion Cuts', icon: Film, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40' },
  { id: 'web-dev', label: 'Web & Interactive Dev', icon: Code2, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40' },
];

export default function ClientEstimator({ isOpen, onClose, initialService = 'graphic-design' }) {
  const [selectedService, setSelectedService] = useState(initialService);
  const [customServiceText, setCustomServiceText] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    if (initialService) {
      const exists = SERVICE_OPTIONS.some(s => s.id === initialService);
      if (exists) {
        setSelectedService(initialService);
      } else {
        setSelectedService('graphic-design');
      }
    }
  }, [initialService]);

  if (!isOpen) return null;

  const activeServiceObj = SERVICE_OPTIONS.find(s => s.id === selectedService);
  const displayServiceName = customServiceText.trim() || (activeServiceObj ? activeServiceObj.label : 'Custom Creative Project');

  const handleSubmitBrief = async (e) => {
    e.preventDefault();
    if (!contactInfo.trim()) {
      alert('Please enter your Email, Phone or WhatsApp number so we can reach you.');
      return;
    }

    if (!projectDetails.trim()) {
      alert('Please describe your project requirements, vision or timeline.');
      return;
    }

    setIsSubmitting(true);

    const stamp = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `FE-INV-${stamp}`;
    const today = new Date().toLocaleDateString('en-GB');

    setInvoiceId(generatedId);
    setIssueDate(today);

    // 1. Generate Base64 PDF string for Google Drive upload
    let base64String = '';
    let tempDiv = null;
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      
      tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '0px';
      tempDiv.style.top = '0px';
      tempDiv.style.width = '794px';
      tempDiv.style.zIndex = '-9999';
      tempDiv.style.opacity = '0.01';
      tempDiv.style.pointerEvents = 'none';
      tempDiv.innerHTML = `
        <div style="width: 794px; background: #ffffff; color: #1e293b; padding: 45px 50px; font-family: Arial, sans-serif; box-sizing: border-box; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <img src="/framempire_logo_white.png" style="height: 38px; filter: invert(1); display: block;" alt="FramEmpire Logo" />
              <div style="margin-top: 25px;">
                <p style="margin: 0; font-weight: bold; font-size: 15px; color: #1e293b;">Invoice : <span style="color: #64748b; font-weight: normal;">${generatedId}</span></p>
                <p style="margin: 4px 0 0 0; font-weight: bold; font-size: 15px; color: #1e293b;">Date : <span style="color: #64748b; font-weight: normal;">${today}</span></p>
              </div>
            </div>

            <div style="font-size: 40px; font-weight: 900; color: #cbd5e1; letter-spacing: 6px; text-transform: uppercase;">
              INVOICE
            </div>
          </div>

          <div style="border-bottom: 1px solid #e2e8f0; margin: 25px 0;"></div>

          <div style="display: flex; justify-content: space-between; gap: 40px; margin-bottom: 35px;">
            <div style="flex: 1.2;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 800; color: #0f172a;">Invoice To:</h3>
              <p style="margin: 0; font-size: 14px; font-weight: bold; color: #0f172a;">${contactInfo}</p>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.6; white-space: pre-wrap;">
                <strong style="color: #334155;">Service:</strong> ${projectDetails}
              </p>
              ${referenceLinks ? `<p style="margin: 6px 0 0 0; font-size: 11px; color: #0284c7;"><strong>Reference:</strong> ${referenceLinks}</p>` : ''}
            </div>

            <div style="flex: 0.8;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 800; color: #0f172a;">Payment Info:</h3>
              <table style="font-size: 12px; color: #475569; border-collapse: collapse;">
                <tr><td style="padding: 2px 10px 2px 0; font-weight: 600;">Account No :</td><td style="font-weight: bold; color: #0f172a;">0171290001972</td></tr>
                <tr><td style="padding: 2px 10px 2px 0; font-weight: 600;">A/C Name :</td><td style="font-weight: bold; color: #0f172a;">ABDUL MUMIN PABEL</td></tr>
                <tr><td style="padding: 2px 10px 2px 0; font-weight: 600; vertical-align: top;">Bank Details :</td><td style="font-weight: bold; color: #0f172a;">Al-Arafah Islami Bank PLC.<br/><span style="font-size: 10px; color: #64748b; font-weight: normal;">UTTARA MODEL TOWN BRANCH(AD)</span></td></tr>
              </table>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; font-size: 13px;">
            <thead>
              <tr style="color: #94a3b8; text-transform: uppercase; font-size: 12px; font-weight: bold; border-bottom: 2px solid #f1f5f9;">
                <th style="padding: 12px 10px; text-align: left; width: 50px;">SL.</th>
                <th style="padding: 12px 10px; text-align: left;">Product Description</th>
                <th style="padding: 12px 10px; text-align: right; width: 100px;">Price</th>
                <th style="padding: 12px 10px; text-align: center; width: 60px;">Qty</th>
                <th style="padding: 12px 10px; text-align: right; width: 100px;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 10px; font-weight: bold; color: #475569;">01.</td>
                <td style="padding: 14px 10px;">
                  <strong style="color: #0f172a; font-size: 14px;">${displayServiceName}</strong><br/>
                  <span style="font-size: 11px; color: #64748b;">Custom Project Scope & Creative Production</span>
                </td>
                <td style="padding: 14px 10px; text-align: right; font-weight: 600; color: #0f172a;">Custom</td>
                <td style="padding: 14px 10px; text-align: center; color: #0f172a;">1</td>
                <td style="padding: 14px 10px; text-align: right; font-weight: bold; color: #0f172a;">Custom Quote</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 10px; font-weight: bold; color: #475569;">02.</td>
                <td style="padding: 14px 10px; color: #334155;">
                  🐢 Standard Delivery Timeline
                </td>
                <td style="padding: 14px 10px; text-align: right; color: #0f172a;">$0.00</td>
                <td style="padding: 14px 10px; text-align: center; color: #0f172a;">1</td>
                <td style="padding: 14px 10px; text-align: right; font-weight: bold; color: #0f172a;">$0.00</td>
              </tr>
              <tr style="border-bottom: 1px solid #f8fafc; color: #cbd5e1;">
                <td style="padding: 12px 10px;">04.</td>
                <td style="padding: 12px 10px;">-</td>
                <td style="padding: 12px 10px; text-align: right;">-</td>
                <td style="padding: 12px 10px; text-align: center;">-</td>
                <td style="padding: 12px 10px; text-align: right;">-</td>
              </tr>
              <tr style="border-bottom: 1px solid #f8fafc; color: #cbd5e1;">
                <td style="padding: 12px 10px;">05.</td>
                <td style="padding: 12px 10px;">-</td>
                <td style="padding: 12px 10px; text-align: right;">-</td>
                <td style="padding: 12px 10px; text-align: center;">-</td>
                <td style="padding: 12px 10px; text-align: right;">-</td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;">
            <div style="font-size: 12px; color: #64748b; line-height: 1.8;">
              <p style="margin: 0;"><strong style="color: #334155;">Email :</strong> team.framempire@gmail.com</p>
              <p style="margin: 0;"><strong style="color: #334155;">Web :</strong> framempire.com</p>
              <p style="margin: 0;"><strong style="color: #334155;">Address :</strong> Dhaka, Bangladesh</p>
              
              <div style="border-top: 2px solid #334155; margin-top: 15px; padding-top: 10px; max-width: 320px;">
                <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #94a3b8; display: block;">TERMS & CONDITIONS</span>
                <span style="font-size: 10px; color: #94a3b8;">Automated quote invoice. Custom project brief confirmed.</span>
              </div>
            </div>

            <div style="text-align: right;">
              <div style="font-size: 13px; color: #475569; margin-bottom: 25px;">
                <p style="margin: 0 0 6px 0;">Sub Total : <strong style="color: #0f172a;">Custom Quote</strong></p>
                <p style="margin: 0 0 6px 0;">Tax : <strong style="color: #0f172a;">$0.00</strong></p>
                <p style="margin: 0 0 10px 0; color: #16a34a; font-weight: bold;">Discount : <strong style="color: #16a34a;">Custom Quote</strong></p>
                <p style="margin: 0; font-size: 18px; font-weight: 900; color: #16a34a;">Total : Custom Quote</p>
              </div>

              <div style="font-size: 11px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase;">
                SIGNATURE
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(tempDiv);

      const opt = {
        margin: 0.15,
        filename: `Invoice_${generatedId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      const pdfBlob = await window.html2pdf().set(opt).from(tempDiv.children[0]).output('blob');

      base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = function () {
          const res = reader.result ? reader.result.split(',')[1] : '';
          resolve(res);
        };
      });
    } catch (err) {
      console.log('PDF Base64 generation error:', err);
    } finally {
      if (tempDiv && document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    }

    // 2. Dispatch POST payload to Google Apps Script Endpoint
    const googleWebAppUrl = 'https://script.google.com/macros/s/AKfycbwp0iTjxYeJMktukdeqWkzZuMxolf-91_hGGZ0Cml-d5RoXLDoWReEChTsbpSBfwHZD/exec';
    
    const googlePayload = {
      client_email: contactInfo,
      selected_service: displayServiceName,
      package_name: 'Custom Project Brief',
      final_price: 'Custom Quote Request',
      pdfBase64: base64String || '',
      custom_details: projectDetails,
      reference_links: referenceLinks
    };

    try {
      await fetch(googleWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(googlePayload)
      });
    } catch (gasErr) {
      console.log('Google Apps Script submission dispatch error:', gasErr);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleDownloadInvoicePdf = async () => {
    setIsDownloadingPdf(true);
    let tempDiv = null;
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      
      tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '0px';
      tempDiv.style.top = '0px';
      tempDiv.style.width = '794px';
      tempDiv.style.zIndex = '-9999';
      tempDiv.style.opacity = '0.01';
      tempDiv.style.pointerEvents = 'none';
      tempDiv.innerHTML = `
        <div style="width: 794px; background: #ffffff; color: #1e293b; padding: 45px 50px; font-family: Arial, sans-serif; box-sizing: border-box; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <img src="/framempire_logo_white.png" style="height: 38px; filter: invert(1); display: block;" alt="FramEmpire Logo" />
              <div style="margin-top: 25px;">
                <p style="margin: 0; font-weight: bold; font-size: 15px; color: #1e293b;">Invoice : <span style="color: #64748b; font-weight: normal;">${invoiceId}</span></p>
                <p style="margin: 4px 0 0 0; font-weight: bold; font-size: 15px; color: #1e293b;">Date : <span style="color: #64748b; font-weight: normal;">${issueDate}</span></p>
              </div>
            </div>

            <div style="font-size: 40px; font-weight: 900; color: #cbd5e1; letter-spacing: 6px; text-transform: uppercase;">
              INVOICE
            </div>
          </div>

          <div style="border-bottom: 1px solid #e2e8f0; margin: 25px 0;"></div>

          <div style="display: flex; justify-content: space-between; gap: 40px; margin-bottom: 35px;">
            <div style="flex: 1.2;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 800; color: #0f172a;">Invoice To:</h3>
              <p style="margin: 0; font-size: 14px; font-weight: bold; color: #0f172a;">${contactInfo}</p>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.6; white-space: pre-wrap;">
                <strong style="color: #334155;">Service:</strong> ${projectDetails}
              </p>
              ${referenceLinks ? `<p style="margin: 6px 0 0 0; font-size: 11px; color: #0284c7;"><strong>Reference:</strong> ${referenceLinks}</p>` : ''}
            </div>

            <div style="flex: 0.8;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 800; color: #0f172a;">Payment Info:</h3>
              <table style="font-size: 12px; color: #475569; border-collapse: collapse;">
                <tr><td style="padding: 2px 10px 2px 0; font-weight: 600;">Account No :</td><td style="font-weight: bold; color: #0f172a;">0171290001972</td></tr>
                <tr><td style="padding: 2px 10px 2px 0; font-weight: 600;">A/C Name :</td><td style="font-weight: bold; color: #0f172a;">ABDUL MUMIN PABEL</td></tr>
                <tr><td style="padding: 2px 10px 2px 0; font-weight: 600; vertical-align: top;">Bank Details :</td><td style="font-weight: bold; color: #0f172a;">Al-Arafah Islami Bank PLC.<br/><span style="font-size: 10px; color: #64748b; font-weight: normal;">UTTARA MODEL TOWN BRANCH(AD)</span></td></tr>
              </table>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; font-size: 13px;">
            <thead>
              <tr style="color: #94a3b8; text-transform: uppercase; font-size: 12px; font-weight: bold; border-bottom: 2px solid #f1f5f9;">
                <th style="padding: 12px 10px; text-align: left; width: 50px;">SL.</th>
                <th style="padding: 12px 10px; text-align: left;">Product Description</th>
                <th style="padding: 12px 10px; text-align: right; width: 100px;">Price</th>
                <th style="padding: 12px 10px; text-align: center; width: 60px;">Qty</th>
                <th style="padding: 12px 10px; text-align: right; width: 100px;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 10px; font-weight: bold; color: #475569;">01.</td>
                <td style="padding: 14px 10px;">
                  <strong style="color: #0f172a; font-size: 14px;">${displayServiceName}</strong><br/>
                  <span style="font-size: 11px; color: #64748b;">Custom Project Scope & Creative Production</span>
                </td>
                <td style="padding: 14px 10px; text-align: right; font-weight: 600; color: #0f172a;">Custom</td>
                <td style="padding: 14px 10px; text-align: center; color: #0f172a;">1</td>
                <td style="padding: 14px 10px; text-align: right; font-weight: bold; color: #0f172a;">Custom Quote</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 10px; font-weight: bold; color: #475569;">02.</td>
                <td style="padding: 14px 10px; color: #334155;">
                  🐢 Standard Delivery Timeline
                </td>
                <td style="padding: 14px 10px; text-align: right; color: #0f172a;">$0.00</td>
                <td style="padding: 14px 10px; text-align: center; color: #0f172a;">1</td>
                <td style="padding: 14px 10px; text-align: right; font-weight: bold; color: #0f172a;">$0.00</td>
              </tr>
              <tr style="border-bottom: 1px solid #f8fafc; color: #cbd5e1;">
                <td style="padding: 12px 10px;">04.</td>
                <td style="padding: 12px 10px;">-</td>
                <td style="padding: 12px 10px; text-align: right;">-</td>
                <td style="padding: 12px 10px; text-align: center;">-</td>
                <td style="padding: 12px 10px; text-align: right;">-</td>
              </tr>
              <tr style="border-bottom: 1px solid #f8fafc; color: #cbd5e1;">
                <td style="padding: 12px 10px;">05.</td>
                <td style="padding: 12px 10px;">-</td>
                <td style="padding: 12px 10px; text-align: right;">-</td>
                <td style="padding: 12px 10px; text-align: center;">-</td>
                <td style="padding: 12px 10px; text-align: right;">-</td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;">
            <div style="font-size: 12px; color: #64748b; line-height: 1.8;">
              <p style="margin: 0;"><strong style="color: #334155;">Email :</strong> team.framempire@gmail.com</p>
              <p style="margin: 0;"><strong style="color: #334155;">Web :</strong> framempire.com</p>
              <p style="margin: 0;"><strong style="color: #334155;">Address :</strong> Dhaka, Bangladesh</p>
              
              <div style="border-top: 2px solid #334155; margin-top: 15px; padding-top: 10px; max-width: 320px;">
                <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #94a3b8; display: block;">TERMS & CONDITIONS</span>
                <span style="font-size: 10px; color: #94a3b8;">Automated quote invoice. Custom project brief confirmed.</span>
              </div>
            </div>

            <div style="text-align: right;">
              <div style="font-size: 13px; color: #475569; margin-bottom: 25px;">
                <p style="margin: 0 0 6px 0;">Sub Total : <strong style="color: #0f172a;">Custom Quote</strong></p>
                <p style="margin: 0 0 6px 0;">Tax : <strong style="color: #0f172a;">$0.00</strong></p>
                <p style="margin: 0 0 10px 0; color: #16a34a; font-weight: bold;">Discount : <strong style="color: #16a34a;">Custom Quote</strong></p>
                <p style="margin: 0; font-size: 18px; font-weight: 900; color: #16a34a;">Total : Custom Quote</p>
              </div>

              <div style="font-size: 11px; font-weight: 900; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase;">
                SIGNATURE
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(tempDiv);

      const opt = {
        margin: 0.15,
        filename: `Invoice_${invoiceId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      const pdfBlob = await window.html2pdf().set(opt).from(tempDiv.children[0]).output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Invoice_${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      console.error('Download PDF error:', err);
    } finally {
      if (tempDiv && document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoiceId);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const resetFormState = () => {
    setIsSubmitting(false);
    setIsDownloadingPdf(false);
    setSubmitted(false);
    setContactInfo('');
    setProjectDetails('');
    setReferenceLinks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl p-5 sm:p-7 bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_60px_rgba(0,243,255,0.25)] text-left overflow-hidden my-auto space-y-5">
        
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Always-Active Close Button */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 relative z-30">
          <div className="flex items-center gap-3">
            <img src="/framempire_logo_white.png" alt="FramEmpire Studio" className="h-8 sm:h-9 object-contain drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
            <div>
              <h3 className="font-['Creato_Display'] text-base sm:text-lg font-bold text-white tracking-wide">
                PROJECT BRIEF & QUOTE REQUEST
              </h3>
              <p className="text-[11px] text-cyan-400 font-mono">FramEmpire Studio • Zero Hassle Onboarding</p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetFormState}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700 relative z-50 shadow-lg"
            title="Close Window"
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        {/* Form Body vs Submitted State */}
        {!submitted ? (
          <form onSubmit={handleSubmitBrief} className="space-y-5 relative z-10">
            
            {/* Service Selector Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. Select Desired Service
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SERVICE_OPTIONS.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = selectedService === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedService(opt.id);
                        setCustomServiceText('');
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? `${opt.color} shadow-[0_0_15px_rgba(0,243,255,0.2)] scale-[1.02]`
                          : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-cyan-500/30 hover:text-slate-200'
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Contact Info Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Your Contact Details <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Enter your Email address, Phone or WhatsApp number..."
                required
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>

            {/* Custom Project Details Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
                <span>3. Project Requirements & Vision <span className="text-cyan-400">*</span></span>
                <span className="text-[10px] text-slate-400 font-normal">Describe in your own words</span>
              </label>
              <textarea
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                rows={4}
                placeholder="Describe your project requirements, goals, preferred timeline, budget ideas, or instructions..."
                required
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors leading-relaxed shadow-inner resize-none"
              />
            </div>

            {/* Reference Links Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>4. Reference Links / Moodboard (Optional)</span>
              </label>
              <input
                type="url"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
                placeholder="Paste Google Drive, Dropbox, Pinterest, or YouTube link..."
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Instant Confirmation & Custom Quote</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl flex items-center gap-2 shadow-[0_0_25px_rgba(0,243,255,0.35)] hover:shadow-[0_0_35px_rgba(0,243,255,0.5)] transition-all cursor-pointer border border-cyan-400 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Brief...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>Submit Project Brief 🚀</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* SUBMITTED SUCCESS & OFFICIAL INVOICE CARD MATCHING USER DESIGN SCREEN */
          <div className="space-y-4 relative z-10 animate-fade-in text-left max-h-[75vh] overflow-y-auto pr-1">
            
            <div className="flex items-center justify-between bg-cyan-950/80 border border-cyan-500/40 p-3.5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Creato_Display'] text-sm sm:text-base font-extrabold text-white">
                    PROJECT BRIEF SUBMITTED SUCCESSFULLY! 🎉
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    We will review your brief and contact you within <strong className="text-cyan-300">2-4 hours</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyInvoiceNumber}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedInvoice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInvoice ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>

            {/* EXACT OFFICIAL FRAMEMPIRE INVOICE CONTAINER MATCHING USER IMAGE */}
            <div className="bg-white text-slate-800 p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-2xl relative overflow-hidden font-sans space-y-6">
              
              {/* Top Header: Logo + Invoice ID + Vertical Watermark */}
              <div className="flex items-start justify-between">
                <div>
                  <img src="/framempire_logo_white.png" alt="FramEmpire Logo" className="h-9 sm:h-10 object-contain filter invert block" />
                  <div className="mt-5 space-y-1">
                    <p className="text-sm font-bold text-slate-900">Invoice : <span className="font-normal text-slate-600">{invoiceId}</span></p>
                    <p className="text-sm font-bold text-slate-900">Date : <span className="font-normal text-slate-600">{issueDate}</span></p>
                  </div>
                </div>

                {/* INVOICE Watermark Header */}
                <div className="text-3xl sm:text-4xl font-black text-slate-300 tracking-[6px] uppercase leading-none select-none">
                  INVOICE
                </div>
              </div>

              <div className="border-b border-slate-200"></div>

              {/* Grid: Invoice To vs Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                
                {/* Left: Invoice To */}
                <div className="sm:col-span-7 space-y-2">
                  <h4 className="text-base font-extrabold text-slate-900">Invoice To:</h4>
                  <p className="text-sm font-bold text-slate-900">{contactInfo}</p>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    <strong className="text-slate-800">Service:</strong> {projectDetails}
                  </p>
                  {referenceLinks && (
                    <p className="text-xs text-cyan-600 font-semibold truncate">
                      <strong>Reference:</strong> {referenceLinks}
                    </p>
                  )}
                </div>

                {/* Right: Payment Info */}
                <div className="sm:col-span-5 space-y-2">
                  <h4 className="text-base font-extrabold text-slate-900">Payment Info:</h4>
                  <table className="text-xs text-slate-600 space-y-1 border-collapse">
                    <tbody>
                      <tr><td className="pr-3 font-semibold text-slate-700 py-0.5">Account No :</td><td className="font-bold text-slate-900 py-0.5">0171290001972</td></tr>
                      <tr><td className="pr-3 font-semibold text-slate-700 py-0.5">A/C Name :</td><td className="font-bold text-slate-900 py-0.5">ABDUL MUMIN PABEL</td></tr>
                      <tr><td className="pr-3 font-semibold text-slate-700 py-0.5 align-top">Bank Details :</td><td className="font-bold text-slate-900 py-0.5">Al-Arafah Islami Bank PLC.<br/><span className="text-[10px] font-normal text-slate-500">UTTARA MODEL TOWN BRANCH(AD)</span></td></tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Invoice Product Description Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase border-b-2 border-slate-100 text-[11px]">
                      <th className="py-2.5 px-2 w-10">SL.</th>
                      <th className="py-2.5 px-2">Product Description</th>
                      <th className="py-2.5 px-2 text-right w-24">Price</th>
                      <th className="py-2.5 px-2 text-center w-14">Qty</th>
                      <th className="py-2.5 px-2 text-right w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-3 px-2 font-bold text-slate-800">01.</td>
                      <td className="py-3 px-2">
                        <strong className="text-slate-900 text-sm block">{displayServiceName}</strong>
                        <span className="text-[11px] text-slate-500">Custom Project Scope & Creative Production</span>
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-slate-900">Custom</td>
                      <td className="py-3 px-2 text-center text-slate-900">1</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-900">Custom Quote</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-bold text-slate-800">02.</td>
                      <td className="py-3 px-2 text-slate-700">
                        🐢 Standard Delivery Timeline
                      </td>
                      <td className="py-3 px-2 text-right text-slate-900">$0.00</td>
                      <td className="py-3 px-2 text-center text-slate-900">1</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-900">$0.00</td>
                    </tr>
                    <tr className="text-slate-300">
                      <td className="py-2.5 px-2">04.</td>
                      <td className="py-2.5 px-2">-</td>
                      <td className="py-2.5 px-2 text-right">-</td>
                      <td className="py-2.5 px-2 text-center">-</td>
                      <td className="py-2.5 px-2 text-right">-</td>
                    </tr>
                    <tr className="text-slate-300">
                      <td className="py-2.5 px-2">05.</td>
                      <td className="py-2.5 px-2">-</td>
                      <td className="py-2.5 px-2 text-right">-</td>
                      <td className="py-2.5 px-2 text-center">-</td>
                      <td className="py-2.5 px-2 text-right">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Invoice Footer Details & Totals */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-6 pt-2">
                
                {/* Bottom Left Contact & Terms */}
                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong className="text-slate-700">Email :</strong> team.framempire@gmail.com</p>
                  <p><strong className="text-slate-700">Web :</strong> framempire.com</p>
                  <p><strong className="text-slate-700">Address :</strong> Dhaka, Bangladesh</p>

                  <div className="border-t-2 border-slate-700 pt-2.5 mt-3 max-w-xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">TERMS & CONDITIONS</span>
                    <p className="text-[10px] text-slate-400">Automated quote invoice. Custom project brief confirmed.</p>
                  </div>
                </div>

                {/* Bottom Right Totals & Signature */}
                <div className="text-right space-y-4">
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Sub Total : <strong className="text-slate-900">Custom Quote</strong></p>
                    <p>Tax : <strong className="text-slate-900">$0.00</strong></p>
                    <p className="text-emerald-600 font-bold">Discount : <strong className="text-emerald-600">Custom Quote</strong></p>
                    <p className="text-lg font-black text-emerald-600 pt-1">Total : Custom Quote</p>
                  </div>

                  <div className="text-[11px] font-black text-slate-400 tracking-[2px] uppercase">
                    SIGNATURE
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Action Buttons: WhatsApp Chat & Download PDF */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href={`https://wa.me/8801615288259?text=Hi%20FramEmpire%20Studio!%20I%20just%20submitted%20a%20project%20brief%20(${invoiceId})%20for%20${encodeURIComponent(displayServiceName)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Direct</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadInvoicePdf}
                disabled={isDownloadingPdf}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className={`w-4 h-4 text-cyan-400 ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
                <span>{isDownloadingPdf ? 'Downloading PDF...' : 'Download Brief PDF'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

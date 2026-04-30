'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

export default function DownloadLedgerButton({ customer, challans, payments, totalBilled, totalPaid, totalPending }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - margin * 2
      let y = margin

      const checkPageBreak = (needed) => {
        if (y + needed > pageHeight - margin) {
          pdf.addPage()
          y = margin
        }
      }

      // Header
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Swastik Plywood', margin, y)
      y += 8

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Customer Ledger', margin, y)
      y += 10

      // Customer info
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`Customer: ${customer.name}`, margin, y)
      y += 6
      pdf.setFont('helvetica', 'normal')
      if (customer.phone) {
        pdf.text(`Phone: ${customer.phone}`, margin, y)
        y += 6
      }

      const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      pdf.text(`Date: ${today}`, margin, y)
      y += 10

      // Divider
      pdf.setDrawColor(200)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 8

      const formatAmt = (amt) => `Rs. ${Number(amt).toLocaleString('en-IN')}`

      // Divider
      pdf.setDrawColor(200)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 8

      // Challans Table
      if (challans.length > 0) {
        pdf.setFontSize(13)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Challans', margin, y)
        y += 8

        // Table header
        const challanCols = [
          { label: 'Challan #', x: margin, width: 35 },
          { label: 'Date', x: margin + 40, width: 45 },
          { label: 'Amount', x: pageWidth - margin - 40, width: 40, align: 'right' },
        ]

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setFillColor(245, 245, 245)
        pdf.rect(margin, y - 4, contentWidth, 8, 'F')
        challanCols.forEach(col => {
          if (col.align === 'right') {
            pdf.text(col.label, col.x + col.width, y, { align: 'right' })
          } else {
            pdf.text(col.label, col.x, y)
          }
        })
        y += 8

        pdf.setFont('helvetica', 'normal')
        challans.forEach((challan) => {
          checkPageBreak(8)
          const dateStr = new Date(challan.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          pdf.text(String(challan.challan_number), challanCols[0].x, y)
          pdf.text(dateStr, challanCols[1].x, y)
          pdf.text(formatAmt(challan.total_amount), challanCols[2].x + challanCols[2].width, y, { align: 'right' })
          y += 7
        })

        y += 5
        pdf.setDrawColor(200)
        pdf.line(margin, y, pageWidth - margin, y)
        y += 8
      }

      // Payment History Table
      if (payments.length > 0) {
        checkPageBreak(20)
        pdf.setFontSize(13)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Payment History', margin, y)
        y += 8

        const payCols = [
          { label: 'Date', x: margin, width: 35 },
          { label: 'Amount', x: margin + 40, width: 35 },
          { label: 'Method', x: margin + 80, width: 30 },
          { label: 'Notes', x: margin + 115, width: 50 },
        ]

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setFillColor(245, 245, 245)
        pdf.rect(margin, y - 4, contentWidth, 8, 'F')
        payCols.forEach(col => pdf.text(col.label, col.x, y))
        y += 8

        pdf.setFont('helvetica', 'normal')
        payments.forEach((payment) => {
          checkPageBreak(8)
          const dateStr = new Date(payment.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          pdf.text(dateStr, payCols[0].x, y)
          pdf.text(formatAmt(payment.amount), payCols[1].x, y)
          pdf.text(payment.payment_method || '', payCols[2].x, y)
          const notes = payment.notes || '-'
          const truncated = notes.length > 30 ? notes.substring(0, 27) + '...' : notes
          pdf.text(truncated, payCols[3].x, y)
          y += 7
        })
      }

      // Account Summary — right-aligned at bottom
      y += 5
      checkPageBreak(35)
      pdf.setDrawColor(200)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 8

      const rightX = pageWidth - margin
      const labelX = rightX - 70

      pdf.setFontSize(13)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Account Summary', rightX, y, { align: 'right' })
      y += 8

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Total Billed:', labelX, y)
      pdf.text(formatAmt(totalBilled), rightX, y, { align: 'right' })
      y += 7

      pdf.text('Total Paid:', labelX, y)
      pdf.setTextColor(34, 139, 34)
      pdf.text(formatAmt(totalPaid), rightX, y, { align: 'right' })
      pdf.setTextColor(0)
      y += 7

      pdf.setFont('helvetica', 'bold')
      pdf.text('Total Pending:', labelX, y)
      if (totalPending > 0) pdf.setTextColor(220, 120, 0)
      pdf.text(formatAmt(totalPending), rightX, y, { align: 'right' })
      pdf.setTextColor(0)

      pdf.save(`Ledger_${customer.name.replace(/\s+/g, '_')}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-dark disabled:opacity-50 font-medium text-sm transition-colors"
    >
      <Download size={18} />
      {loading ? 'Generating...' : 'Download Ledger PDF'}
    </button>
  )
}

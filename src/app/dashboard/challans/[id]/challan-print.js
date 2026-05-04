'use client'

import { Printer } from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export default function ChallanPrint({ challan }) {

  async function generatePDF() {
    const element = document.querySelector('.print-challan')
    if (!element) return

    const originalBorder = element.style.border
    const originalBorderRadius = element.style.borderRadius
    const originalPadding = element.style.padding
    const originalMargin = element.style.margin
    const originalWidth = element.style.width
    const originalMaxWidth = element.style.maxWidth

    element.style.border = 'none'
    element.style.borderRadius = '0'
    element.style.padding = '0'
    element.style.margin = '0'
    element.style.width = '130mm'
    element.style.maxWidth = '130mm'

    await new Promise(resolve => setTimeout(resolve, 100))

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    })

    element.style.border = originalBorder
    element.style.borderRadius = originalBorderRadius
    element.style.padding = originalPadding
    element.style.margin = originalMargin
    element.style.width = originalWidth
    element.style.maxWidth = originalMaxWidth

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    })

    const pdfWidth = 148
    const pdfHeight = 210
    const imgWidth = 130
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const xOffset = (pdfWidth - imgWidth) / 2
    const yOffset = 5

    // If content fits on one page
    if (imgHeight <= pdfHeight - 10) {
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
    } else {
      // Multi-page: slice the canvas into page-sized chunks
      const pageContentHeight = pdfHeight - 10 // usable height per page
      const scaleFactor = canvas.width / imgWidth
      const pageCanvasHeight = pageContentHeight * scaleFactor
      let remainingHeight = canvas.height
      let sourceY = 0

      while (remainingHeight > 0) {
        const sliceHeight = Math.min(pageCanvasHeight, remainingHeight)
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = sliceHeight
        const ctx = pageCanvas.getContext('2d')
        ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)

        const pageImgData = pageCanvas.toDataURL('image/png')
        const pageImgHeight = (sliceHeight * imgWidth) / canvas.width

        if (sourceY > 0) {
          pdf.addPage()
        }
        pdf.addImage(pageImgData, 'PNG', xOffset, yOffset, imgWidth, pageImgHeight)

        sourceY += sliceHeight
        remainingHeight -= sliceHeight
      }
    }

    pdf.save(`Challan_${challan.challan_number}.pdf`)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div>
      {/* Action Buttons */}
      <div className="mb-6 print-hidden">
        <div className="flex gap-3 mb-3">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-medium transition-colors"
          >
            <Printer size={20} />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors"
          >
            <Printer size={20} />
            Print
          </button>
        </div>
      </div>

      <ChallanTemplate challan={challan} />
    </div>
  )
}

// Separate component for challan template
function ChallanTemplate({ challan }) {
  return (
    <div className="print-challan bg-white border border-neutral-200 rounded-xl p-6 mb-6 print:border-0 print:p-0 print:mb-0 print:rounded-none">
      <div className="max-w-[140mm] mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold text-red-800 mb-1">
            Sastika Ply and Laminates
          </h1>
          <p className="text-[10px] mb-1 leading-tight">
            EXCLUSIVE SHOWROOM OF DESIGNER LAMINATES, VENEERS, WALLPAPERS
          </p>
          <p className="text-[9px] text-neutral-600 leading-tight">
            Shop No 1, S. V. Road, Opp. Canara Bank, Dahisar (E), Mumbai 400068.
          </p>
          <p className="text-[9px] text-neutral-600">Tel.: 7977833752</p>
        </div>

        <h2 className="text-sm font-bold text-center mb-4">DELIVERY CHALLAN</h2>

        {/* Challan Details */}
        <div className="flex justify-between mb-3 text-xs">
          <div>
            <span className="font-normal">No.</span>{' '}
            <span className="font-bold">{challan.challan_number}</span>
          </div>
          <div>
            <span className="font-normal">Date</span>{' '}
            <span className="font-bold">{new Date(challan.date).toLocaleDateString('en-IN')}</span>
          </div>
        </div>

        <div className="mb-4 text-xs">
          <span className="font-normal">M/s</span>{' '}
          <span className="font-bold">{challan.customer_name}</span>

          {challan.site_address && (
            <div className="mt-1">
              <span className="font-normal">Site:</span>{' '}
              <span className="font-bold">{challan.site_address}</span>
            </div>
          )}

          {(challan.phone || challan.additional_phone) && (
            <div className="mt-1">
              <span className="font-normal">Phone:</span>{' '}
              <span className="font-bold">
                {[challan.phone, challan.additional_phone].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse text-[11px] mb-3">
          <thead>
            <tr className="bg-neutral-100">
              <th className="border border-neutral-300 px-2 py-1.5 text-left font-bold">Description</th>
              <th className="border border-neutral-300 px-2 py-1.5 text-center w-[15mm] font-bold">Qty</th>
              <th className="border border-neutral-300 px-2 py-1.5 text-right w-[22mm] font-bold">Rate</th>
              <th className="border border-neutral-300 px-2 py-1.5 text-right w-[25mm] font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {challan.challan_items.map((item) => (
              <tr key={item.id}>
                <td className="border border-neutral-300 px-2 py-1.5">{item.description}</td>
                <td className="border border-neutral-300 px-2 py-1.5 text-center">{item.quantity}</td>
                <td className="border border-neutral-300 px-2 py-1.5 text-right">
                  {item.rate ? `₹${Number(item.rate).toFixed(2)}` : ''}
                </td>
                <td className="border border-neutral-300 px-2 py-1.5 text-right">
                  {item.amount ? `₹${Number(item.amount).toFixed(2)}` : ''}
                </td>
              </tr>
            ))}
            {/* Subtotal */}
            <tr className="bg-neutral-50">
              <td colSpan="3" className="border border-neutral-300 px-2 py-1.5 text-right font-bold">
                Subtotal
              </td>
              <td className="border border-neutral-300 px-2 py-1.5 text-right font-semibold">
                {challan.subtotal ? `₹${challan.subtotal.toFixed(2)}` : ''}
              </td>
            </tr>
            {/* CGST */}
            {challan.cgst_percentage > 0 && (
              <tr>
                <td colSpan="3" className="border border-neutral-300 px-2 py-1.5 text-right">
                  CGST ({challan.cgst_percentage}%)
                </td>
                <td className="border border-neutral-300 px-2 py-1.5 text-right">
                  ₹{(challan.cgst_amount || 0).toFixed(2)}
                </td>
              </tr>
            )}
            {/* SGST */}
            {challan.sgst_percentage > 0 && (
              <tr>
                <td colSpan="3" className="border border-neutral-300 px-2 py-1.5 text-right">
                  SGST ({challan.sgst_percentage}%)
                </td>
                <td className="border border-neutral-300 px-2 py-1.5 text-right">
                  ₹{(challan.sgst_amount || 0).toFixed(2)}
                </td>
              </tr>
            )}
            {/* Transport */}
            {challan.transport_charges > 0 && (
              <tr>
                <td colSpan="3" className="border border-neutral-300 px-2 py-1.5 text-right">
                  Transport
                </td>
                <td className="border border-neutral-300 px-2 py-1.5 text-right">
                  ₹{(challan.transport_charges || 0).toFixed(2)}
                </td>
              </tr>
            )}
            {/* Labour Charges */}
            {challan.labour_charges > 0 && (
              <tr>
                <td colSpan="3" className="border border-neutral-300 px-2 py-1.5 text-right">
                  Labour
                </td>
                <td className="border border-neutral-300 px-2 py-1.5 text-right">
                  ₹{(challan.labour_charges || 0).toFixed(2)}
                </td>
              </tr>
            )}
            {/* Total */}
            <tr className="bg-neutral-100 font-bold">
              <td colSpan="3" className="border border-neutral-300 px-2 py-2 text-right">
                Total
              </td>
              <td className="border border-neutral-300 px-2 py-2 text-right">
                {challan.total_amount ? `₹${challan.total_amount.toFixed(2)}` : ''}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between text-[10px] mt-4">
          <div>
            <p className="font-semibold mb-1">GSTIN No. 27AFDFS8990M1Z1</p>
            <p className="text-[9px] text-neutral-600 leading-tight">
              Bill will be made on confirmation of this<br />
              memo and approval of goods.
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">For Sastika Ply and</p>
            <p className="font-semibold">Laminates</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react';
import { Copy, Check, Smartphone } from 'lucide-react';

interface UpiPaytmCardProps {
  amount: number;
  customQrImageUrl?: string;
  merchantName?: string;
  upiId?: string;
  onPaidClick?: () => void;
  isSubmitting?: boolean;
}

export const UpiPaytmCard: React.FC<UpiPaytmCardProps> = ({
  amount,
  customQrImageUrl,
  merchantName = 'FIT BISTRO',
  upiId = 'paytm.s23wfpb@pty',
  onPaidClick,
  isSubmitting = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedAmount = amount.toFixed(2);
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${formattedAmount}&cu=INR&tn=The%20Kitchen24%20Order`;

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      {/* Outer Card Styled Identically to the Paytm QR Standee Screenshot */}
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200">
        {/* Top Header: Paytm se UPI */}
        <div className="pt-5 pb-3 px-6 text-center bg-white flex flex-col items-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-[#002e6e]">
              pay<span className="text-[#00baf2]">tm</span>
            </span>
            <span className="text-xs font-bold text-stone-500 mx-0.5">से</span>
            <span className="text-lg font-black tracking-tight text-[#002e6e] flex items-center">
              UPI
              <span className="inline-block w-2.5 h-2.5 ml-0.5 bg-gradient-to-tr from-[#00baf2] to-[#002e6e] rotate-45 transform origin-center" />
            </span>
          </div>

          {/* Merchant Name */}
          <h3 className="text-xl font-black text-stone-900 tracking-wider uppercase mt-2">
            {merchantName}
          </h3>
        </div>

        {/* Custom Image override if admin uploaded one */}
        {customQrImageUrl ? (
          <div className="px-5 pb-5">
            <div className="border-4 border-[#00baf2] rounded-2xl overflow-hidden bg-white p-2">
              <img
                src={customQrImageUrl}
                alt="UPI QR Code"
                className="w-full h-auto object-contain max-h-[380px] rounded-lg"
              />
            </div>
          </div>
        ) : (
          /* Exact Replica of the Paytm Cashback Standee Card from Screenshot */
          <div className="relative bg-gradient-to-b from-[#ffd100] via-[#ffd61a] to-[#ffda33] pt-3 px-3 pb-0">
            {/* Cashback ribbon banner with confetti flair */}
            <div className="relative text-center pb-3">
              <span className="text-[10px] font-black tracking-wider uppercase text-stone-800 block">
                Get Assured
              </span>
              <div className="inline-block bg-gradient-to-r from-[#0051a8] to-[#00baf2] text-white px-4 py-0.5 rounded-md font-black text-sm tracking-wider uppercase shadow-xs -rotate-1 mt-0.5">
                CASHBACK
              </div>
              <div className="mt-1">
                <span className="inline-block bg-white text-[#002e6e] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Scan in Paytm App
                </span>
              </div>
            </div>

            {/* Inner White Box with Sky Blue (#00baf2) Border */}
            <div className="bg-white rounded-2xl border-[3px] border-[#00baf2] p-4 flex flex-col items-center shadow-md">
              {/* Paytm Logo inside */}
              <div className="mb-2">
                <span className="text-xl font-black text-[#002e6e]">
                  pay<span className="text-[#00baf2]">tm</span>
                </span>
              </div>

              {/* QR Code Container */}
              <div className="relative p-2 bg-white rounded-xl border border-stone-200 shadow-inner flex items-center justify-center">
                {/* SVG High-Contrast QR Code for paytm.s23wfpb@pty */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-52 h-52 sm:w-56 sm:h-56"
                  shapeRendering="crispEdges"
                >
                  <rect width="200" height="200" fill="#ffffff" />
                  {/* Outer corner finders */}
                  {/* Top-Left */}
                  <rect x="15" y="15" width="45" height="45" fill="#000000" />
                  <rect x="21" y="21" width="33" height="33" fill="#ffffff" />
                  <rect x="27" y="27" width="21" height="21" fill="#000000" />

                  {/* Top-Right */}
                  <rect x="140" y="15" width="45" height="45" fill="#000000" />
                  <rect x="146" y="21" width="33" height="33" fill="#ffffff" />
                  <rect x="152" y="27" width="21" height="21" fill="#000000" />

                  {/* Bottom-Left */}
                  <rect x="15" y="140" width="45" height="45" fill="#000000" />
                  <rect x="21" y="146" width="33" height="33" fill="#ffffff" />
                  <rect x="27" y="152" width="21" height="21" fill="#000000" />

                  {/* Timing patterns */}
                  <line x1="65" y1="36" x2="135" y2="36" stroke="#000000" strokeWidth="3" strokeDasharray="6,6" />
                  <line x1="36" y1="65" x2="36" y2="135" stroke="#000000" strokeWidth="3" strokeDasharray="6,6" />

                  {/* Alignment pattern */}
                  <rect x="145" y="145" width="25" height="25" fill="#000000" />
                  <rect x="150" y="150" width="15" height="15" fill="#ffffff" />
                  <rect x="155" y="155" width="5" height="5" fill="#000000" />

                  {/* QR Data modules matching realistic layout */}
                  <g fill="#000000">
                    {/* Top quadrant details */}
                    <rect x="70" y="18" width="8" height="8" />
                    <rect x="85" y="18" width="16" height="8" />
                    <rect x="110" y="18" width="8" height="8" />
                    <rect x="125" y="18" width="8" height="8" />

                    <rect x="70" y="30" width="14" height="6" />
                    <rect x="92" y="30" width="8" height="12" />
                    <rect x="115" y="30" width="12" height="6" />

                    <rect x="68" y="46" width="8" height="14" />
                    <rect x="80" y="46" width="24" height="8" />
                    <rect x="120" y="46" width="8" height="14" />

                    {/* Center body */}
                    <rect x="18" y="70" width="14" height="8" />
                    <rect x="42" y="70" width="8" height="16" />
                    <rect x="58" y="70" width="14" height="8" />
                    <rect x="80" y="65" width="40" height="8" />
                    <rect x="130" y="70" width="8" height="16" />
                    <rect x="145" y="70" width="18" height="8" />
                    <rect x="172" y="70" width="12" height="16" />

                    <rect x="18" y="85" width="8" height="14" />
                    <rect x="32" y="85" width="14" height="8" />
                    <rect x="52" y="85" width="16" height="8" />
                    <rect x="75" y="80" width="12" height="18" />
                    <rect x="95" y="80" width="16" height="18" />
                    <rect x="120" y="85" width="12" height="14" />
                    <rect x="140" y="85" width="14" height="8" />
                    <rect x="160" y="85" width="12" height="14" />

                    {/* Center center matrix */}
                    <rect x="25" y="105" width="16" height="8" />
                    <rect x="48" y="102" width="10" height="14" />
                    <rect x="68" y="105" width="18" height="8" />
                    <rect x="92" y="102" width="14" height="14" />
                    <rect x="114" y="105" width="14" height="8" />
                    <rect x="136" y="102" width="12" height="14" />
                    <rect x="156" y="105" width="26" height="8" />

                    <rect x="18" y="120" width="10" height="12" />
                    <rect x="36" y="120" width="22" height="8" />
                    <rect x="65" y="120" width="12" height="12" />
                    <rect x="85" y="120" width="18" height="8" />
                    <rect x="110" y="120" width="14" height="12" />
                    <rect x="130" y="120" width="16" height="8" />
                    <rect x="155" y="120" width="10" height="12" />
                    <rect x="172" y="120" width="12" height="12" />

                    {/* Bottom body */}
                    <rect x="68" y="140" width="8" height="16" />
                    <rect x="85" y="140" width="18" height="8" />
                    <rect x="110" y="140" width="10" height="16" />
                    <rect x="128" y="140" width="12" height="8" />

                    <rect x="70" y="162" width="18" height="8" />
                    <rect x="95" y="158" width="12" height="18" />
                    <rect x="115" y="162" width="14" height="8" />
                    <rect x="135" y="158" width="8" height="18" />

                    <rect x="68" y="176" width="10" height="10" />
                    <rect x="85" y="176" width="22" height="10" />
                    <rect x="115" y="176" width="16" height="10" />
                    <rect x="140" y="176" width="40" height="10" />
                  </g>
                </svg>

                {/* Center Paytm Mini-Badge */}
                <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center border-2 border-[#00baf2] shadow-sm">
                  <span className="text-[10px] font-black text-[#002e6e] leading-none">
                    p<span className="text-[#00baf2]">t</span>m
                  </span>
                </div>
              </div>

              {/* Exact UPI ID Text */}
              <div className="mt-3 text-center">
                <span className="text-xs font-semibold text-stone-500 block">UPI ID:</span>
                <div className="inline-flex items-center gap-1.5 mt-0.5 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-md">
                  <span className="text-xs sm:text-sm font-mono font-bold text-stone-900 select-all">
                    {upiId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="text-stone-500 hover:text-stone-800 p-0.5 transition-colors"
                    title="Copy UPI ID"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {copied && (
                  <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                    UPI ID copied to clipboard!
                  </span>
                )}
              </div>

              {/* Supported payment badges matching bottom of screenshot */}
              <div className="w-full border-t border-stone-100 mt-4 pt-3 flex items-center justify-between text-[10px] text-stone-600 font-medium px-1">
                <span className="flex items-center gap-1 font-bold text-[#002e6e]">
                  <span className="text-xs">₹</span> Paytm Postpaid
                </span>
                <span className="h-3 w-[1px] bg-stone-200" />
                <span className="font-bold text-stone-700">UPI</span>
                <span className="h-3 w-[1px] bg-stone-200" />
                <span className="font-bold text-stone-700">UPI LITE</span>
              </div>
            </div>

            {/* Navy Bottom Bar with curved edge as in Paytm standee */}
            <div className="h-4 bg-[#002e6e] rounded-b-2xl mt-1.5" />
          </div>
        )}

        {/* Amount to Pay Breakdown */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 text-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block">
            Total Amount to Pay
          </span>
          <div className="text-3xl font-extrabold text-stone-900 mt-1 font-mono">
            ₹{formattedAmount}
          </div>

          <p className="text-xs text-stone-500 mt-2">
            Scan using any UPI app (Paytm, Google Pay, PhonePe, Cred, BHIM)
          </p>

          {/* Quick Pay via UPI App (on mobile) */}
          <div className="mt-3">
            <a
              href={upiIntentUrl}
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Open UPI App directly
            </a>
          </div>

          {/* MANDATORY: "I have paid" button */}
          {onPaidClick && (
            <div className="mt-4 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={onPaidClick}
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                {isSubmitting ? 'Confirming Order...' : 'I have paid'}
              </button>
              <span className="text-[11px] text-stone-500 block mt-2">
                Tap above only after completing payment in your UPI app.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

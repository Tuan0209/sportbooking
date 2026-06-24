import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { walletService } from '../services/walletService';
import { formatPrice } from '../../../shared/utils/formatDate';

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

const formatDateTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const Wallet = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(null); // mệnh giá đang nạp (loading)

  const applyResult = (result) => {
    if (!result) return;
    setBalance(result.balance || 0);
    setTransactions(result.transactions || []);
  };

  useEffect(() => {
    setLoading(true);
    walletService
      .getWallet()
      .then((res) => applyResult(res.data?.result))
      .finally(() => setLoading(false));
  }, []);

  const handleTopUp = async (amount) => {
    if (topUpAmount) return;
    setTopUpAmount(amount);
    try {
      const res = await walletService.topUp(amount);
      applyResult(res.data?.result);
      setShowTopUp(false);
    } catch (e) {
      alert(e.response?.data?.message || 'Nạp coin thất bại, vui lòng thử lại.');
    } finally {
      setTopUpAmount(null);
    }
  };

  return (
    <div className="min-h-screen bg-chalk pb-28">
      {/* Header */}
      <div className="stadium pitch-lines text-white">
        <div className="h-14 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-[18px] font-display font-bold tracking-tight">Ví của tôi</h1>
        </div>

        {/* Thẻ số dư nổi bật */}
        <div className="px-4 pb-6 -mb-8">
          <div className="bg-white rounded-4xl shadow-card p-6 animate-fade-up">
            <div className="flex items-center gap-2 text-muted">
              <WalletIcon size={16} className="text-pitch" />
              <span className="text-[13px] font-semibold">Số dư hiện tại</span>
            </div>
            <div className="mt-2 flex items-end gap-1.5">
              <span className="font-display font-extrabold text-pitch text-[34px] leading-none tracking-tight">
                {formatPrice(balance)}
              </span>
              <span className="text-pitch/70 font-display font-bold text-sm pb-1">Coin</span>
            </div>
            <button
              onClick={() => setShowTopUp((s) => !s)}
              className="mt-5 w-full h-12 rounded-2xl bg-pitch text-white font-semibold shadow-glow hover:bg-pitch-deep transition flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Nạp coin
            </button>

            {/* Khu chọn nhanh mệnh giá */}
            {showTopUp && (
              <div className="mt-4 animate-fade-up">
                <p className="text-[12px] text-muted font-semibold mb-2">Chọn nhanh mệnh giá</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {QUICK_AMOUNTS.map((amount) => {
                    const isLoading = topUpAmount === amount;
                    return (
                      <button
                        key={amount}
                        onClick={() => handleTopUp(amount)}
                        disabled={!!topUpAmount}
                        className={`h-12 rounded-2xl border font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
                          isLoading
                            ? 'border-pitch bg-pitch-soft text-pitch'
                            : 'border-line bg-chalk text-ink hover:border-pitch hover:bg-pitch-soft'
                        } ${topUpAmount && !isLoading ? 'opacity-50' : ''}`}
                      >
                        {isLoading && <Loader2 size={15} className="animate-spin" />}
                        {formatPrice(amount)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lịch sử giao dịch */}
      <div className="max-w-2xl mx-auto p-4 pt-12 space-y-3">
        <h2 className="font-display font-bold text-ink text-[15px] px-1">Lịch sử giao dịch</h2>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-pitch" size={32} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-pitch-soft flex items-center justify-center text-pitch mx-auto mb-3">
              <WalletIcon size={26} />
            </div>
            <p className="font-display text-ink font-bold">Chưa có giao dịch nào</p>
            <p className="text-muted text-sm mt-1">Nạp coin để bắt đầu sử dụng ví của bạn.</p>
          </div>
        ) : (
          transactions.map((tx, idx) => {
            const isAdd = tx.type === 'ADD';
            return (
              <div
                key={idx}
                className="bg-white border border-line rounded-2xl shadow-card p-4 flex items-center gap-3"
              >
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isAdd ? 'bg-pitch-soft text-pitch' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {isAdd ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink text-sm truncate">{tx.reason}</p>
                  <p className="text-[12px] text-muted">{formatDateTime(tx.createdAt)}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`font-display font-extrabold text-sm ${
                      isAdd ? 'text-pitch' : 'text-red-600'
                    }`}
                  >
                    {isAdd ? '+' : '-'}
                    {formatPrice(tx.amount)}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">Số dư: {formatPrice(tx.balanceAfter)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Wallet;

import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "@/entities/transaction/api/transaction";
import { Loader2, Coffee, ShoppingBag, Zap, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const getIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "food":
      return Coffee;
    case "shopping":
      return ShoppingBag;
    case "utilities":
      return Zap;
    default:
      return CreditCard;
  }
};

export function TransactionList() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        거래 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((t, i) => {
        const Icon = getIcon(t.category);
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                <Icon size={18} />
              </div>
              <div>
                <p className="font-medium">{t.description}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(t.date).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
            <span
              className={`font-medium ${
                t.amount > 0 ? "text-emerald-500" : "text-destructive"
              }`}
            >
              {t.amount > 0 ? "+" : ""}₩{Math.abs(t.amount).toLocaleString()}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

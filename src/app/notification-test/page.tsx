"use client";

import { useState } from "react";
import { notificationApi } from "@/entities/notification/api/notification";
import { Send, AlertCircle, Gift, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationTestPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "alert" | "recommendation">("info");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message) {
      alert("제목과 메시지를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await notificationApi.create({
        type,
        title,
        message,
      });

      setTitle("");
      setMessage("");
      setType("info");
      setSuccessMessage("알림이 생성되었습니다!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to create notification:", error);
      alert("알림 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">알림 테스트</h1>
        <p className="text-muted-foreground">
          테스트용 알림을 생성하여 알림 기능을 확인할 수 있습니다.
        </p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="space-y-6 bg-card border border-border rounded-2xl p-8">
        <form onSubmit={handleCreateNotification} className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">알림 유형</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: "info" as const,
                  icon: Info,
                  label: "정보",
                  color: "bg-green-50 border-green-200",
                },
                {
                  value: "alert" as const,
                  icon: AlertCircle,
                  label: "경고",
                  color: "bg-red-50 border-red-200",
                },
                {
                  value: "recommendation" as const,
                  icon: Gift,
                  label: "추천",
                  color: "bg-blue-50 border-blue-200",
                },
              ].map(({ value, icon: Icon, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    type === value
                      ? `${color} border-current`
                      : "border-border hover:border-muted"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 새로운 추천 상품이 있습니다"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Message Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">메시지</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="예: 최근 지출 패턴을 분석하여 높은 이자율의 정기예금 상품을 추천드립니다."
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Send size={18} />
                알림 생성하기
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900">💡 사용 안내</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            • 위 양식을 통해 생성한 알림은 헤더의 알림 버튼에서 확인할 수
            있습니다.
          </li>
          <li>
            • 알림은 최신순으로 정렬되며 읽음/읽지 않음 상태를 관리할 수
            있습니다.
          </li>
          <li>• 각 알림은 개별 삭제하거나 모두 삭제할 수 있습니다.</li>
          <li>
            • 실제 서비스에서는 서버에서 알림을 발송하는 로직이 필요합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}

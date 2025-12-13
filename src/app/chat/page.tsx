import { ChatWindow } from '@/features/chat/ui/ChatWindow'

export default function ChatPage() {
  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6">AI Financial Advisor</h1>
      <ChatWindow />
    </div>
  )
}

/**
 * نظام إدارة السياق الذكي لـ ChatRaqim
 * يدير conversation history بذكاء لتجنب تجاوز context window
 */

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  tokens?: number; // optional token count
  timestamp?: Date;
}

interface ContextConfig {
  maxMessages?: number; // الحد الأقصى لعدد الرسائل
  maxTokens?: number; // الحد الأقصى للتوكنات
  preserveRecent?: number; // عدد الرسائل الأخيرة المحفوظة دائماً
  summarizeOld?: boolean; // هل نلخص الرسائل القديمة؟
}

/**
 * تقدير عدد التوكنات (تقريبي)
 * القاعدة: كل 4 أحرف ≈ 1 token للعربية
 */
function estimateTokens(text: string): number {
  // للعربية: نستخدم نسبة أعلى لأن التوكنات أقل كفاءة
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const otherChars = text.length - arabicChars;
  
  return Math.ceil((arabicChars / 2) + (otherChars / 4));
}

/**
 * تلخيص الرسائل القديمة
 */
function summarizeMessages(messages: Message[]): string {
  if (messages.length === 0) return '';
  
  // استخرج النقاط الرئيسية
  const topics = new Set<string>();
  const keyInfo: string[] = [];
  
  messages.forEach(msg => {
    if (msg.role === 'user') {
      // استخرج الكلمات المفتاحية من أسئلة المستخدم
      const keywords = msg.content.split(/\s+/).slice(0, 3);
      if (keywords.length > 0) {
        topics.add(keywords.join(' '));
      }
    } else if (msg.role === 'assistant') {
      // استخرج الجمل المهمة من ردود المساعد
      const sentences = msg.content.split(/[.!?]/);
      const firstSentence = sentences[0]?.trim();
      if (firstSentence && firstSentence.length < 100) {
        keyInfo.push(firstSentence);
      }
    }
  });
  
  let summary = '📋 **ملخص المحادثة السابقة**:\n';
  
  if (topics.size > 0) {
    summary += '\n**المواضيع المطروحة**:\n';
    Array.from(topics).slice(0, 3).forEach(topic => {
      summary += `- ${topic}\n`;
    });
  }
  
  if (keyInfo.length > 0) {
    summary += '\n**نقاط رئيسية**:\n';
    keyInfo.slice(0, 3).forEach(info => {
      summary += `- ${info}\n`;
    });
  }
  
  return summary;
}

/**
 * إدارة السياق بذكاء
 */
export class ContextManager {
  private config: Required<ContextConfig>;
  
  constructor(config: ContextConfig = {}) {
    this.config = {
      maxMessages: config.maxMessages || 20,
      maxTokens: config.maxTokens || 4000,
      preserveRecent: config.preserveRecent || 4,
      summarizeOld: config.summarizeOld ?? true,
    };
  }
  
  /**
   * تنظيم الرسائل والحفاظ على السياق
   */
  optimizeMessages(messages: Message[]): Message[] {
    if (messages.length === 0) return [];
    
    // 1. احسب التوكنات لكل رسالة
    const messagesWithTokens = messages.map(msg => ({
      ...msg,
      tokens: msg.tokens || estimateTokens(msg.content),
    }));
    
    // 2. احسب المجموع الكلي
    const totalTokens = messagesWithTokens.reduce((sum, msg) => sum + (msg.tokens || 0), 0);
    
    // 3. إذا كنا ضمن الحدود، أعد الرسائل كما هي
    if (
      messages.length <= this.config.maxMessages &&
      totalTokens <= this.config.maxTokens
    ) {
      return messages;
    }
    
    // 4. نحتاج إلى تقليص السياق
    return this.reduceContext(messagesWithTokens);
  }
  
  /**
   * تقليص السياق بذكاء
   */
  private reduceContext(messages: Message[]): Message[] {
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');
    
    // احتفظ بالرسائل الأخيرة دائماً
    const recentMessages = conversationMessages.slice(-this.config.preserveRecent);
    const oldMessages = conversationMessages.slice(0, -this.config.preserveRecent);
    
    // إذا كان التلخيص مفعلاً، لخص الرسائل القديمة
    if (this.config.summarizeOld && oldMessages.length > 0) {
      const summary = summarizeMessages(oldMessages);
      
      return [
        ...(systemMessage ? [systemMessage] : []),
        {
          role: 'assistant' as const,
          content: summary,
          timestamp: new Date(),
        },
        ...recentMessages,
      ];
    }
    
    // خلاف ذلك، احتفظ بالرسائل الأخيرة فقط
    return [
      ...(systemMessage ? [systemMessage] : []),
      ...recentMessages,
    ];
  }
  
  /**
   * تحديد ما إذا كنا بحاجة لتنظيف السياق
   */
  needsOptimization(messages: Message[]): boolean {
    const totalTokens = messages.reduce(
      (sum, msg) => sum + (msg.tokens || estimateTokens(msg.content)),
      0
    );
    
    return (
      messages.length > this.config.maxMessages ||
      totalTokens > this.config.maxTokens
    );
  }
  
  /**
   * الحصول على إحصائيات السياق
   */
  getContextStats(messages: Message[]) {
    const totalTokens = messages.reduce(
      (sum, msg) => sum + (msg.tokens || estimateTokens(msg.content)),
      0
    );
    
    return {
      messageCount: messages.length,
      totalTokens,
      remainingTokens: this.config.maxTokens - totalTokens,
      utilizationPercent: (totalTokens / this.config.maxTokens) * 100,
      needsOptimization: this.needsOptimization(messages),
    };
  }
}

/**
 * مدير السياق الذكي - Sliding Window مع الذاكرة
 */
export class SmartContextManager extends ContextManager {
  private importantMessages: Set<number> = new Set(); // رسائل مهمة لا تحذف
  
  /**
   * وضع علامة على رسالة كمهمة
   */
  markAsImportant(messageIndex: number) {
    this.importantMessages.add(messageIndex);
  }
  
  /**
   * تقليص ذكي مع الحفاظ على الرسائل المهمة
   */
  optimizeMessages(messages: Message[]): Message[] {
    const optimized = super.optimizeMessages(messages);
    
    // احتفظ بالرسائل المهمة
    const importantMsgs = Array.from(this.importantMessages)
      .map(idx => messages[idx])
      .filter(Boolean);
    
    return [...importantMsgs, ...optimized];
  }
}

// دالة مساعدة للتكامل مع tRPC
export function prepareMessagesForLLM(
  conversationHistory: Array<{ role: string; content: string }>,
  newMessage: string,
  systemPrompt: string,
  config?: ContextConfig
): Message[] {
  const manager = new ContextManager(config);
  
  const messages: Message[] = [
    {
      role: 'system',
      content: systemPrompt,
      timestamp: new Date(),
    },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(),
    })),
    {
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    },
  ];
  
  return manager.optimizeMessages(messages);
}

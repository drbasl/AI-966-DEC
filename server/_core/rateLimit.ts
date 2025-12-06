// server/_core/rateLimit.ts
import { TRPCError } from "@trpc/server";

// تخزين في الذاكرة: IP -> { عدد الطلبات, وقت أول طلب }
const requestCounts = new Map<string, { count: number; startTime: number }>();

// الإعدادات: 10 طلبات كل 1 دقيقة (زيادة قليلة للمستخدمين العاديين)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; 

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record) {
    requestCounts.set(ip, { count: 1, startTime: now });
    return;
  }

  // إذا انتهت مدة النافذة الزمنية، قم بتصفير العداد
  if (now - record.startTime > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, startTime: now });
    return;
  }

  // إذا تجاوز العدد المسموح
  if (record.count >= MAX_REQUESTS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "عذراً، لقد تجاوزت الحد المسموح من الرسائل. يرجى الانتظار قليلاً.",
    });
  }

  // زيادة العداد
  record.count += 1;
}

// دالة تنظيف دورية (اختيارية لمنع امتلاء الذاكرة)
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  requestCounts.forEach((record, ip) => {
    if (now - record.startTime > RATE_LIMIT_WINDOW) {
      keysToDelete.push(ip);
    }
  });
  
  keysToDelete.forEach(ip => requestCounts.delete(ip));
}, RATE_LIMIT_WINDOW * 2);

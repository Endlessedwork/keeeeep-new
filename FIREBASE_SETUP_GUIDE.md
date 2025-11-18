# 🔥 คู่มือการตั้งค่า Firebase สำหรับ Keeeeep App

## 📋 สิ่งที่ได้ทำเสร็จแล้ว

### ✅ 1. Firebase Authentication
- ลงชื่อเข้าใช้/สมัครสมาชิกด้วยอีเมลและรหัสผ่าน
- ลงชื่อเข้าใช้/สมัครสมาชิกด้วย Google
- ข้อมูลผู้ใช้ถูกเก็บใน Firestore

### ✅ 2. Firebase Firestore
- ข้อมูล bookmarks ถูกเก็บใน Firestore
- ข้อมูล categories ถูกเก็บใน Firestore
- ข้อมูลซิงค์ข้ามอุปกรณ์

### ✅ 3. Firebase Cloud Functions
- `scrapeWebsite` - ดึง metadata จากเว็บไซต์
- `summarizeContent` - สรุปเนื้อหาด้วย OpenAI API
- `scrapeAndSummarize` - รวมการ scrape และสรุปในครั้งเดียว

---

## 🔐 การตั้งค่า Firestore Security Rules

ไปที่ Firebase Console → Firestore Database → Rules

แทนที่เนื้อหาด้วยกฎนี้:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own bookmarks
    match /bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only read/write their own categories
    match /categories/{categoryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

จากนั้นกด **Publish**

---

## 🚀 การใช้งาน Firebase Cloud Functions

### หลัง Deploy เสร็จ:

Firebase จะแสดง URL ของ functions:
```
✔  Deploy complete!

Function URL (scrapeWebsite): https://us-central1-sample-firebase-ai-app-a92b1.cloudfunctions.net/scrapeWebsite
Function URL (summarizeContent): https://us-central1-sample-firebase-ai-app-a92b1.cloudfunctions.net/summarizeContent
Function URL (scrapeAndSummarize): https://us-central1-sample-firebase-ai-app-a92b1.cloudfunctions.net/scrapeAndSummarize
```

### อัพเดต URL ในแอป:

ตั้งค่า ENV ให้ชี้ไปที่ Functions ที่ deploy แล้ว (ไฟล์ `.env`):
```
EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION=us-central1
EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-sample-firebase-ai-app-a92b1.cloudfunctions.net
```
ถ้าไม่ตั้งค่า `EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL` ระบบจะใช้ค่า region + project id อัตโนมัติ

---

## 🧪 การทดสอบ Functions

### ทดสอบด้วย curl:

```bash
# ทดสอบ scrapeAndSummarize
curl -X POST https://us-central1-sample-firebase-ai-app-a92b1.cloudfunctions.net/scrapeAndSummarize \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### ทดสอบในแอป:

1. เปิดแอป
2. ลงชื่อเข้าใช้ (หรือสมัครสมาชิก)
3. กดปุ่ม "+" เพื่อเพิ่ม bookmark
4. ใส่ URL ของเว็บไซต์
5. กดปุ่ม "ดึงข้อมูล" หรือ "สรุปเนื้อหา"
6. รอสักครู่ AI จะสรุปเนื้อหาให้

---

## 💰 ค่าใช้จ่าย (Free Tier)

| Service | Free Tier | ราคาหลัง Free Tier |
|---------|-----------|-------------------|
| Functions Invocations | 2M ครั้ง/เดือน | $0.40 ต่อล้านครั้ง |
| Outbound Networking | 5GB/เดือน | $0.12/GB |
| Cloud Build | 120 นาที/วัน | $0.003/นาที |
| OpenAI API | - | ~$0.01-0.05/สรุป |

**สำหรับการใช้งานส่วนตัว: ฟรีแน่นอนครับ!**

---

## 🆘 การแก้ไขปัญหา

### ปัญหา: "Missing or insufficient permissions"
- ตั้งค่า Firestore Security Rules ตามด้านบน
- ตรวจสอบว่า login สำเร็จแล้ว

### ปัญหา: "CORS error"
- ใช้ Firebase Cloud Functions แทนการเรียก API ตรงๆ
- Functions จะจัดการ CORS ให้อัตโนมัติ

### ปัญหา: "OpenAI API error"
- ตรวจสอบว่าตั้งค่า `OPENAI_API_KEY` ใน Firebase Functions แล้ว
- รันคำสั่ง: `firebase functions:config:get`

---

## 📚 เอกสารเพิ่มเติม

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Cloud Functions](https://firebase.google.com/docs/functions)
- [OpenAI API](https://platform.openai.com/docs)

---

## 🎯 สรุป

**✅ ระบบพร้อมใช้งานแล้ว:**
- Firebase Authentication (Email & Google)
- Firestore Database
- Cloud Functions สำหรับ AI สรุปเนื้อหา
- ข้อมูลซิงค์ข้ามอุปกรณ์

**🎉 ขอแสดงความยินดี! คุณได้ย้ายระบบไป Firebase สำเร็จแล้วครับ!**

# Firebase Cloud Functions for Keeeeep App

ฟังก์ชันสำหรับ scrape เว็บไซต์และสรุปเนื้อหาด้วย AI

## 📦 ฟังก์ชันที่มี

### 1. `scrapeWebsite`
- **URL**: `https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/scrapeWebsite`
- **Method**: `POST`
- **Body**: `{ "url": "https://example.com" }`
- **Response**: Metadata ของเว็บไซต์ (title, description, image, favicon, content)

### 2. `summarizeContent`
- **URL**: `https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/summarizeContent`
- **Method**: `POST`
- **Body**: `{ "content": "...", "url": "...", "title": "..." }`
- **Response**: สรุปเนื้อหาภาษาไทยจาก OpenAI

### 3. `scrapeAndSummarize`
- **URL**: `https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/scrapeAndSummarize`
- **Method**: `POST`
- **Body**: `{ "url": "https://example.com" }`
- **Response**: ข้อมูลเว็บไซต์ + สรุปเนื้อหา

## 🚀 วิธี Deploy

### ขั้นตอนที่ 1: ติดตั้ง Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### ขั้นตอนที่ 2: ตั้งค่าโปรเจกต์
```bash
cd functions
firebase init functions
# เลือกโปรเจกต์ของคุณ
# เลือก "Use an existing project"
```

### ขั้นตอนที่ 3: ติดตั้ง dependencies
```bash
cd functions
npm install
```

### ขั้นตอนที่ 4: ตั้งค่า Environment Variables
```bash
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
```
หรือสร้างไฟล์ `.env` ในโฟลเดอร์ functions:
```
OPENAI_API_KEY=sk-xxx...
```

### ขั้นตอนที่ 5: Deploy functions
```bash
firebase deploy --only functions
```

## 🔧 การทดสอบในเครื่อง (Local Testing)

```bash
cd functions
npm run serve
```

Functions จะรันอยู่ที่ `http://localhost:5001/YOUR-PROJECT/us-central1/`

## 📋 การใช้งานในแอปพลิเคชัน

```javascript
// ตัวอย่างการเรียกใช้ scrapeAndSummarize
const response = await fetch(
  'https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/scrapeAndSummarize',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: 'https://example.com' }),
  }
);

const data = await response.json();
console.log(data); // { title, description, imageUrl, faviconUrl, summary, url }
```

## ⚠️ การตั้งค่า CORS

ฟังก์ชันได้ตั้งค่า CORS ให้สามารถเรียกใช้จากโดเมนใดก็ได้แล้ว (`cors({ origin: true })`)

## 🔐 ความปลอดภัย

สำหรับ production ควร:
1. จำกัด CORS ให้เฉพาะโดเมนของแอปพลิเคชัน
2. เพิ่มการตรวจสอบสิทธิ์ (authentication) ก่อนเรียกใช้ functions
3. จำกัดขนาด content ที่ส่งมาเพื่อป้องกัน abuse

## 📝 การตั้งค่า Firestore Security Rules

อย่าลืมตั้งค่า Firestore Security Rules ใน Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /categories/{categoryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 💰 ค่าใช้จ่าย

- **Firebase Functions**: มี free tier (2M invocations/month)
- **OpenAI API**: คิดค่าบริการตามการใช้งาน (ประมาณ $0.01-0.05 ต่อการสรุป 1 เว็บไซต์)

## 🆘 การแก้ไขปัญหา

ถ้าเกิด error "Function failed on loading user code":
```bash
cd functions
rm -rf node_modules package-lock.json
npm install
firebase deploy --only functions --debug
```

ถ้าเกิด error "Memory limit exceeded":
- เพิ่ม memory allocation ใน `functions/index.js`:
```javascript
exports.scrapeAndSummarize = functions
  .runWith({ memory: '1GB' })
  .https.onRequest((req, res) => { ... });
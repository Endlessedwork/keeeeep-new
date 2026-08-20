# 🚀 คู่มือ Build และอัพ Keeeeep ขึ้น Google Play Store

## 📋 สิ่งที่ต้องเตรียม

### ✅ เอกสารที่พร้อมแล้ว:
- [x] Privacy Policy URL: `https://keeeeep.sky168.info/privacy-policy.html`
- [x] OpenAI API Key: ใส่ใน `.env` แล้ว
- [x] App icon (PNG): สร้างแล้ว
- [x] Feature Graphic: `assets/feature-graphic.png`
- [x] Play Store Description: `PLAY_STORE_DESCRIPTION.txt`

### 📸 สิ่งที่คุณต้องทำเอง:
- [ ] Screenshots (2-8 รูป) - ดูวิธีใน `SCREENSHOT_GUIDE.md`
- [ ] Google Play Developer Account ($25 ค่าสมัครครั้งเดียว)

---

## 🔧 ส่วนที่ 1: เตรียมพร้อม Build

### ขั้นตอนที่ 1: ติดตั้ง EAS CLI (ถ้ายังไม่มี)

```bash
npm install -g eas-cli
```

### ขั้นตอนที่ 2: Login เข้า Expo

```bash
eas login
```

**ถ้ายังไม่มีบัญชี Expo:**
1. ไปที่ https://expo.dev
2. สมัครบัญชีฟรี (ใช้ email ของคุณ)
3. กลับมา login ใหม่

### ขั้นตอนที่ 3: Configure EAS Build

```bash
cd /home/user/workspace
eas build:configure
```

**ระหว่างนี้จะถาม:**
- "Would you like to create a new EAS project?" → กด **Yes**
- ระบบจะสร้าง Project ID ใหม่และอัปเดต `app.json` ให้อัตโนมัติ

### ขั้นตอนที่ 4: เช็คว่าโปรเจคพร้อมหรือยัง

```bash
eas build:inspect -p android --profile production
```

---

## 📦 ส่วนที่ 2: Build แอป (AAB สำหรับ Play Store)

### ขั้นตอนที่ 1: Build Production

```bash
eas build --platform android --profile production
```

**สิ่งที่จะเกิดขึ้น:**
1. ถาม "Generate a new Android Keystore?" → กด **Yes** (ครั้งแรก)
2. อัปโหลดโค้ดไปยัง EAS Build
3. Build บน Cloud (ใช้เวลา 10-20 นาที)
4. เสร็จแล้วจะได้ลิงก์ดาวน์โหลด `.aab` file

**💡 เคล็ดลับ:**
- Build บน Cloud ฟรี (มี Free tier)
- ไม่ต้องมี Android Studio
- ไม่ต้องมี Mac หรือ Windows

### ขั้นตอนที่ 2: ดาวน์โหลดไฟล์ AAB

เมื่อ build เสร็จ:
1. เข้า https://expo.dev/accounts/your-username/projects/keeeeep/builds
2. คลิก build ล่าสุด
3. ดาวน์โหลด `.aab` file
4. เก็บไว้ในคอมพิวเตอร์

---

## 🎮 ส่วนที่ 3: สมัคร Google Play Developer Account

### ขั้นตอนที่ 1: สมัครบัญชี

1. ไปที่ https://play.google.com/console/signup
2. กรอกข้อมูล:
   - ชื่อ Developer: **Endlessedwork** (หรือตามที่ต้องการ)
   - Email: **endlessedwork@gmail.com**
3. ยอมรับข้อตกลง
4. **จ่ายค่าสมัคร $25** (ครั้งเดียวตลอดชีพ)
5. รอ 1-2 วันให้ Google อนุมัติ

---

## 📱 ส่วนที่ 4: สร้าง App Listing ใน Play Console

### ขั้นตอนที่ 1: สร้างแอปใหม่

1. เข้า https://play.google.com/console
2. คลิก **Create app**
3. กรอกข้อมูล:
   - **App name**: Keeeeep
   - **Default language**: Thai (ไทย)
   - **App or game**: App
   - **Free or paid**: Free
4. ยอมรับ Policy
5. คลิก **Create app**

### ขั้นตอนที่ 2: Store presence → Main store listing

#### 📝 **App details:**
- **App name**: Keeeeep
- **Short description** (80 characters):
  ```
  จัดเก็บเว็บไซต์ที่ชอบ พร้อม AI สรุปเนื้อหาภาษาไทยอัตโนมัติ
  ```
  
- **Full description** (4000 characters):
  ```
  Copy จากไฟล์ PLAY_STORE_DESCRIPTION.txt
  ```

#### 🎨 **Graphics:**
- **App icon** (512x512): อัปโหลด `assets/icon.png` (resize เป็น 512x512 ก่อน)
- **Feature graphic** (1024x500): อัปโหลด `assets/feature-graphic.png`
- **Phone screenshots** (2-8 รูป): ถ่ายตาม `SCREENSHOT_GUIDE.md`

#### 📋 **Categorization:**
- **App category**: Productivity
- **Tags**: bookmark, productivity, AI, note-taking

#### 📧 **Contact details:**
- **Email**: endlessedwork@gmail.com
- **Website**: https://keeeeep.sky168.info/ (optional)
- **Privacy Policy URL**: https://keeeeep.sky168.info/privacy-policy.html

### ขั้นตอนที่ 3: Store settings

#### **App access:**
- เลือก: **All functionality is available without restrictions**
- (เพราะแอปไม่มี login required หรือ payment)

#### **Ads:**
- เลือก: **No, my app does not contain ads**

#### **Content ratings:**
1. คลิก **Start questionnaire**
2. เลือก **Email address**: endlessedwork@gmail.com
3. **Category**: Utility, Productivity, Communication, or Other
4. ตอบคำถาม (ส่วนใหญ่ตอบ "No"):
   - Does your app contain violence? → No
   - Does your app contain sexual content? → No
   - Does your app contain bad language? → No
   - etc.
5. Submit → จะได้ rating: **Everyone** (ทุกคนใช้ได้)

#### **Target audience:**
- **Target age**: 13+ (หรือ 18+)

#### **News app:**
- เลือก: **No, my app is not a news app**

#### **Data safety:**
1. คลิก **Start**
2. ตอบว่าแอปเก็บข้อมูลอะไรบ้าง:
   - **Does your app collect or share user data?** → Yes
   - **Email addresses** → Yes (เก็บไว้ใน local)
   - **Name** → Yes (optional, เก็บไว้ใน local)
   - **Bookmarks/URLs** → Yes (เก็บไว้ใน local)
3. **Is all data encrypted?** → No (เพราะเก็บ local ไม่ส่งไปยัง server)
4. **Can users request data deletion?** → Yes (ลบแอปได้)
5. Submit

#### **Government apps:**
- เลือก: **No, my app is not a government app**

---

## 📦 ส่วนที่ 5: อัปโหลด AAB File

### ขั้นตอนที่ 1: Production → Countries/regions

1. ไปที่ **Production** → **Countries/regions**
2. เลือก **Add countries/regions**
3. เลือก:
   - ✅ **Thailand** (หรือทั่วโลก)
   - (Optional: เลือกประเทศอื่นๆ ที่ต้องการ)

### ขั้นตอนที่ 2: Production → Create release

1. ไปที่ **Production** → **Releases**
2. คลิก **Create new release**
3. **Upload** ไฟล์ `.aab` ที่ได้จาก EAS Build
4. **Release name**: 1 (1.0.0)
5. **Release notes** (เขียนเป็นภาษาไทย):
   ```
   🎉 เวอร์ชันแรก!
   
   ✨ ฟีเจอร์:
   • จัดเก็บ bookmark ด้วย URL
   • AI สรุปเนื้อหาภาษาไทยอัตโนมัติ
   • จัดระเบียบด้วยหมวดหมู่และแท็ก
   • ค้นหาและกรอง bookmark ได้ง่าย
   • แสดงสถิติการใช้งาน
   ```
6. คลิก **Save**

### ขั้นตอนที่ 3: Review and rollout

1. เช็คว่าทุกอย่างครบถ้วนหรือยัง
2. คลิก **Start rollout to Production**
3. ยืนยัน → **Rollout**

---

## ⏰ ส่วนที่ 6: รอ Google Review

### สิ่งที่จะเกิดขึ้น:
1. Google จะตรวจสอบแอป (ใช้เวลา **1-7 วัน**)
2. ระหว่างนี้สถานะจะเป็น "Pending publication"
3. Google จะเช็ค:
   - แอปทำงานได้จริงไหม
   - ไม่มี malware
   - ไม่ละเมิด policy
   - Privacy Policy ครบถ้วน

### ถ้าผ่าน:
- จะได้อีเมลแจ้ง "Your app is now live"
- แอปจะปรากฏใน Play Store
- URL: `https://play.google.com/store/apps/details?id=com.endlessedwork.keeeeep`

### ถ้าไม่ผ่าน:
- จะได้อีเมลบอกสาเหตุ
- แก้ไขตามที่แจ้ง
- Upload version ใหม่

---

## 🎯 ส่วนที่ 7: อัปเดตแอปในอนาคต

### เมื่อต้องการอัปเดต:

1. **แก้โค้ด** ในโปรเจค
2. **เพิ่ม version** ใน `app.json`:
   ```json
   "version": "1.0.1",  // เปลี่ยนจาก 1.0.0
   "versionCode": 2     // เพิ่มจาก 1
   ```
3. **Build ใหม่**:
   ```bash
   eas build --platform android --profile production
   ```
4. **อัปโหลด** `.aab` ใหม่ใน Play Console → Production → Create release
5. เขียน **Release notes** ว่าอัปเดตอะไร
6. **Rollout** → รอ review อีกครั้ง (เร็วกว่าครั้งแรก 1-2 วัน)

---

## 📊 ติดตามสถิติ

### ใน Play Console ดูได้:
- จำนวนดาวน์โหลด
- จำนวนผู้ใช้งาน
- Rating และ Reviews
- Crash reports
- Update retention

---

## ⚠️ ข้อควรระวัง

### 1. **API Key**
- เช็คว่า OpenAI API key ยังใช้ได้
- ตั้ง Usage Limit ป้องกันค่าใช้จ่ายเกิน
- เช็คยอดใช้งานบ่อยๆ

### 2. **Privacy Policy**
- ถ้าเปลี่ยนการเก็บข้อมูล ต้องอัปเดต Privacy Policy
- อัปเดตทั้งในเว็บและใน Play Store

### 3. **User Reviews**
- ตอบ review ของผู้ใช้ (ดีและไม่ดี)
- แก้ไข bug ที่ถูกรายงาน
- อัปเดตตาม feedback

### 4. **Compliance**
- ปฏิบัติตาม Google Play Policy
- อัปเดต SDK และ dependencies เป็นประจำ
- ตรวจสอบ security issues

---

## 🎉 Checklist สุดท้าย

ก่อนกด Submit:

- [ ] Build แอปสำเร็จแล้ว (.aab file)
- [ ] มี Google Play Developer Account ($25)
- [ ] อัปโหลด icon และ feature graphic แล้ว
- [ ] อัปโหลด screenshots 2-8 รูปแล้ว
- [ ] กรอก description (short + full) แล้ว
- [ ] ใส่ Privacy Policy URL แล้ว
- [ ] ทำ Content rating แล้ว (Everyone)
- [ ] ทำ Data safety form แล้ว
- [ ] เลือก countries/regions แล้ว
- [ ] เขียน release notes แล้ว
- [ ] เช็ค OpenAI API key ใช้งานได้

---

## 📞 ติดปัญหา?

### ปัญหาที่พบบ่อย:

**1. Build failed:**
- เช็ค error log ใน EAS
- อาจต้องแก้ไข `app.json` หรือ `eas.json`

**2. Upload AAB failed:**
- เช็คว่า version code เพิ่มขึ้นหรือยัง
- เช็คว่า package name ตรงกับที่ตั้งไว้

**3. App rejected:**
- อ่านอีเมลจาก Google ให้ละเอียด
- แก้ไขตามที่แจ้ง
- Upload version ใหม่

**4. Privacy Policy error:**
- เช็คว่า URL เปิดได้
- ต้องมีเนื้อหาครบตาม Google requirement

---

## 🎯 เมื่อแอปขึ้น Play Store แล้ว

### แชร์แอปของคุณ!

**Play Store URL:**
```
https://play.google.com/store/apps/details?id=com.endlessedwork.keeeeep
```

**โปรโมทแอป:**
- แชร์ใน social media
- บอกเพื่อนๆ
- ขอ review จากผู้ใช้
- สร้าง landing page (optional)

---

## 🚀 ขั้นตอนย่อ (TL;DR)

```bash
# 1. Login Expo
eas login

# 2. Configure
eas build:configure

# 3. Build
eas build --platform android --profile production

# 4. ดาวน์โหลด .aab file

# 5. อัปโหลดไปยัง Play Console

# 6. กรอกข้อมูลแอป + screenshots

# 7. Submit for review

# 8. รอ 1-7 วัน

# 9. เสร็จ! 🎉
```

---

**พร้อมแล้ว! ขอให้โชคดีกับการอัพแอปขึ้น Play Store นะครับ! 🚀**

ถ้ามีคำถามหรือติดปัญหา บอกผมได้เลยครับ! 😊

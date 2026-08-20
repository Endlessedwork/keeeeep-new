# 🚀 เผยแพร่ Privacy Policy เป็น URL สำหรับ Play Store

Play Store ต้องการ **URL สาธารณะ** ของนโยบายความเป็นส่วนตัว (หน้าในแอปใช้แทนไม่ได้)
ไฟล์หน้าเว็บถูกเตรียมไว้ในโฟลเดอร์ `docs/` ของ repo นี้แล้ว เหลือแค่เปิด GitHub Pages

## ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|------|---------|
| `docs/index.html` | หน้านโยบายความเป็นส่วนตัว (ภาษาไทย) — หน้าหลักที่จะถูกเสิร์ฟ |
| `docs/privacy-policy.html` | redirect ไปที่ `index.html` เผื่อมีคนใช้ลิงก์เดิม |
| `docs/.nojekyll` | บอก GitHub Pages ให้เสิร์ฟไฟล์ตรงๆ ไม่ต้องผ่าน Jekyll |

## ขั้นตอนเปิด GitHub Pages (ทำครั้งเดียว)

1. merge branch นี้เข้า `main` ก่อน (Pages จะอ่านจาก branch `main`)
2. ไปที่ https://github.com/Endlessedwork/keeeeep-new/settings/pages
3. ที่หัวข้อ **Build and deployment → Source** เลือก **Deploy from a branch**
4. **Branch**: เลือก `main` และโฟลเดอร์ **`/docs`**
5. กด **Save** แล้วรอประมาณ 1-3 นาที

## URL ที่จะได้

```
https://endlessedwork.github.io/keeeeep-new/
```

นำ URL นี้ไปใส่ใน Play Console → **Policy → App content → Privacy policy**

> repo นี้เป็น Public อยู่แล้ว จึงใช้ GitHub Pages ได้ฟรี

## ตรวจสอบ

เปิด URL ในเบราว์เซอร์ ต้องเห็นหน้านโยบายภาษาไทย มีหัวข้อครบตั้งแต่ "บทนำ" ถึง "ติดต่อเรา"

## เวลาแก้เนื้อหานโยบาย

แก้ให้ตรงกันทั้ง 3 ที่ เพื่อไม่ให้ข้อมูลขัดกัน:

1. `docs/index.html` — หน้าเว็บ (URL ที่ Play Store ใช้)
2. `src/screens/PrivacyPolicyScreen.tsx` — หน้าในแอป
3. `PRIVACY_POLICY.md` — เอกสารในโปรเจกต์

commit และ push ขึ้น `main` แล้ว GitHub Pages จะอัปเดตให้อัตโนมัติภายในไม่กี่นาที

## ❓ ถ้ามีปัญหา

- **404** → เช็คว่าเลือกโฟลเดอร์ `/docs` (ไม่ใช่ `/ (root)`) และไฟล์ชื่อ `index.html`
- **ยังไม่ขึ้น** → รอ 5-10 นาที แล้ว hard refresh (Ctrl/Cmd + Shift + R)
- **หน้าเก่าค้าง** → เป็น cache ของเบราว์เซอร์ ลองเปิดโหมดไม่ระบุตัวตน

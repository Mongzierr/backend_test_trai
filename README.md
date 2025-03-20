# การติดตั้งและรันโปรเจค

## 1. Clone โปรเจค
ทำการ clone โปรเจคจาก GitHub ไปยังเครื่องของคุณ

```bash
git clone https://github.com/Mongzierr/backend_test_trai.git
```

## 2. ติดตั้ง Dependencies
ติดตั้ง dependencies ที่โปรเจคต้องการ

```bash
npm install
```

## 3. สร้างไฟล์ .env

สร้างไฟล์ `.env` ในโปรเจคและเพิ่มข้อมูลเชื่อมต่อฐานข้อมูล

```ini
DATABASE_URL="postgresql://<username>:<password>@<host>:5432/<DBname>?schema=public"
```

ตัวอย่างการตั้งค่าฐานข้อมูลที่รันที่ localhost:5432

```ini
DATABASE_URL="postgresql://postgres:1234@localhost:5432/test?schema=public"
```

## 4. การตั้งค่าฐานข้อมูล
ให้สร้างฐานข้อมูล PostgreSQL และใช้ Prisma สำหรับการตั้งค่า Schema และ Migrations

```bash
npx prisma migrate dev  # ถ้าไม่ได้ให้ใช้ sudo npx
```

## 5. รัน Seed ข้อมูล
เพื่อให้ฐานข้อมูลมีข้อมูลเริ่มต้น คุณสามารถรันคำสั่งดังนี้:

```bash
npm run seed
```

## 6. ตรวจสอบข้อมูล
คุณสามารถใช้ Prisma Studio เพื่อตรวจสอบข้อมูลในฐานข้อมูล

```bash
npx prisma studio
```

## 7. การรันโปรเจค
หลังจากที่ติดตั้งทุกอย่างเรียบร้อยแล้ว คุณสามารถรันโปรเจคโดยใช้คำสั่ง

```bash
npm start
```

## 8. ทดสอบ API ด้วย Postman
ไฟล์ `apitest.postman.json` จะมีตัวอย่างการทดสอบ API ซึ่งสามารถ import เข้า Postman ได้เลย

```ini
apitest.postman.json
```

### ตัวอย่างการทดสอบจาก Postman

#### 9. ทดสอบ POST register
- **Method:** POST  
- **URL:** `/users/register`

**Body:**
```json
{
    "username": "johnsnoop",
    "email": "test02@example.com",
    "phone_number": "0123456789",
    "password": "abcdefghgffdgdfg"
}
```

**Expected Response:**  
201 Created, ข้อมูลที่ถูกเพิ่มเข้าไป

#### 10. ทดสอบ POST login
- **Method:** POST  
- **URL:** `/users/login`

**Body:**
```json
{
    "name": "John Doe",
    "email": "johndoe@example.com"
}
```

**Expected Response:**  
201 Created, เข้าสู่ระบบสำเร็จ

#### 11. ทดสอบ POST sellorder
- **Method:** POST  
- **URL:** `/sellOrders`

**Body:**
```json
{
    "userId": 1,
    "cryptoId": 1,
    "amount": 0.1,
    "fiatAmount": 1000
}
```

**Expected Response:**  
201 Created, เพิ่มรายการขาย

#### 12. ทดสอบ POST buyorder
- **Method:** POST  
- **URL:** `/buyOrders`

**Body:**
```json
{
    "buyerId": 2,
    "sellOrderId": 1,
    "fiatAmount": 10
}
```

**Expected Response:**  
201 Created, บันทึกรายการซื้อ

#### 13. ทดสอบ POST deposit
- **Method:** POST  
- **URL:** `/fiat/deposit`

**Body:**
```json
{
    "userId": 2,
    "amount": 1000,
    "fiatType": "THB"
}
```

**Expected Response:**  
201 Created, ฝากเงินาำเร็จ

#### 14. ทดสอบ POST withdraw
- **Method:** POST  
- **URL:** `/fiat/withdraw`

**Body:**
```json
{
    "userId": 2,
    "amount": 1000,
    "fiatType": "USD"
}
```

**Expected Response:**  
201 Created, ถอนเงินสำเร็จ

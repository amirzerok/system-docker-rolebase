import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const API_URL = 'http://nestjs:3001/users'; // آدرس بک‌اند

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];

  // بررسی وجود توکن
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // دریافت اطلاعات کاربر
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.status(200).json(response.data);
    } else if (req.method === 'PUT') {
      // به‌روزرسانی اطلاعات کاربر
      const response = await axios.put(API_URL, req.body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.status(200).json(response.data);
    } else {
      // اگر متد معتبر نیست
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);

    // بررسی اینکه آیا error از نوع AxiosError است
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || 'An error occurred',
      });
    } else {
      // برای خطاهای غیر Axios
      return res.status(500).json({ message: 'Unexpected error occurred' });
    }
  }
}

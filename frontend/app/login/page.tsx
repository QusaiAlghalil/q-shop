'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { formState, register, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const errors = formState.errors;

  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    try {
      const { email, password } = data;
      const res = await api.post(`/auth/login`, { email, password });
      const { user, token } = res.data.data;
      toast.success('Login success');
      setAuth(user, token);
      router.push('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      toast.error('Login failed', {
        description: errorMessage ?? '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <div href="/" className="text-2xl font-bold">
              E-Shop
            </div>
          </CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col justify-center items-center gap-5 w-full">
              <div className="w-full">
                <Label>Email</Label>
                <input
                  type="email"
                  {...register('email')}
                  className="border rounded-md w-full h-10 p-2"
                  placeholder="Qusai@q-shop.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="w-full">
                <Label>Password</Label>
                <input
                  type="password"
                  {...register('password')}
                  className="border rounded-md w-full h-10 p-2"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full max-w-md">
              <div className="flex gap-3 justify-center items-center">
                {loading ? <Spinner /> : 'Login'}
              </div>
            </Button>
            <p className="text-gray-500">
              Don't have an account?{' '}
              <Link href={'/register'} className="font-semibold text-black">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

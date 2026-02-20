'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
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
import { useState } from 'react';
import api from '@/lib/api';
import { RegisterFormData, registerSchema } from '@/lib/schemas';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const { name, email, password, address } = data;
    setLoading(true);
    setRegisterError('');
    try {
      const res = await api.post(`/auth/register`, {
        name,
        email,
        password,
        address,
      });

      const { user, token } = res.data.data;
      setAuth(user, token);
      router.push('/');
    } catch (err) {
      setRegisterError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-full flex justify-center items-center bg-gray-50 p-2">
      <Card className="w-full max-w-2xl h-full overflow-auto">
        <CardHeader className="pt-2">
          <CardTitle>
            <div href="/" className="text-2xl font-bold">
              Q-Shop
            </div>
          </CardTitle>
          <CardDescription>Register new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="overflow-auto max-h-max">
            <div className="flex flex-col w-full">
              <div className="flex flex-col justify-center items-center gap-y-2">
                <div className="w-full max-w-lg">
                  <Label>Name</Label>
                  <input
                    {...register('name')}
                    className="border rounded-md w-full h-10 p-2"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-lg">
                  <Label>Email</Label>
                  <input
                    type="email"
                    {...register('email')}
                    className="border rounded-md w-full h-10 p-2"
                    placeholder="Qusai@q-shop.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-lg">
                  <Label>Password</Label>
                  <input
                    {...register('password')}
                    type="password"
                    className="border rounded-md w-full h-10 p-2"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-lg">
                  <Label>Confirm Password</Label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className="border rounded-md w-full h-10 p-2"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <Separator className="my-5 bg-gray-300" />
              {/** Address form */}
              <Label className="text-center font-semibold mb-4">Address</Label>
              <div className="flex flex-wrap gap-x-3 justify-center gap-y-2">
                <div className="w-full max-w-64">
                  <Label>Street</Label>
                  <input
                    {...register('address.street')}
                    className="border rounded-md w-full h-10 p-2"
                  />
                  {errors.address?.street && (
                    <p className="text-red-600 text-sm">
                      {errors.address.street.message}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-64">
                  <Label>City</Label>
                  <input
                    {...register('address.city')}
                    className="border rounded-md w-full h-10 p-2"
                  />
                  {errors.address?.city && (
                    <p className="text-red-600 text-sm">
                      {errors.address.city.message}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-64">
                  <Label>Zip Code</Label>
                  <input
                    {...register('address.zipCode')}
                    className="border rounded-md w-full h-10 p-2"
                  />
                  {errors.address?.zipCode && (
                    <p className="text-red-600 text-sm">
                      {errors.address.zipCode.message}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-64">
                  <Label>Country</Label>
                  <input
                    {...register('address.country')}
                    className="border rounded-md w-full h-10 p-2"
                  />
                  {errors.address?.country && (
                    <p className="text-red-600 text-sm">
                      {errors.address.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pb-2">
            <Button type="submit" className="w-full max-w-md">
              <div className="flex gap-3 justify-center items-center">
                {loading ? <Spinner /> : 'Register'}
              </div>
            </Button>
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link href={'/login'} className="font-semibold text-black">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store';
import {
  CreditCardIcon,
  LogOutIcon,
  LogInIcon,
  SettingsIcon,
  User,
  UserIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const UserDropdownMenu = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const isUser = useAuthStore.getState().isAuthenticated();
  console.log(isUser);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSignin = () => {
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isUser ? (
          <>
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCardIcon />
              orders
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              variant="destructive"
              className="cursor-pointer"
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={handleSignin}
              variant="destructive"
              className="cursor-pointer"
            >
              <LogOutIcon />
              Sign in
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

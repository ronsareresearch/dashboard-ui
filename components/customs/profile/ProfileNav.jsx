import { AUTH_SERVER } from '@/app/constant/constant'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import axios from 'axios'
import { LogOut, UserIcon } from 'lucide-react'
import React, { useEffect } from 'react'

const ProfileNav = ({ handleLogout }) => {
  const [userData, setUserData] = React.useState(null);

  useEffect(() => {
    const fun = async () => {
      try {
        const res = await axios.get(`${AUTH_SERVER}/me`, {
          withCredentials: true,
        });
        setUserData(res.data);
        console.log('User data:', res.data);
      } catch (error) {
        console.log(error)
      }
    }
    fun();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer relative z-50 pl-2 pr-4 py-2 bg-gray-200 border border-black/10 shadow-inner rounded-full min-w-[200px]">
          {/* Avatar */}
          <div className="relative">
            <div className="h-10 w-10 border shadow-inner rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-black" />
            </div>
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-orange-300"
            />
          </div>

          {/* Name & Email */}
          <div className="flex flex-col overflow-hidden">
            <div className="text-sm font-medium text-gray-800 truncate">
           <div className="text-sm font-medium text-gray-800 truncate">
  {userData ? (
    userData.role
  ) : (
    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
  )}
</div>
<div className="text-xs text-gray-500 truncate">
  {userData ? (
    userData.email
  ) : (
    <div className="h-3 w-32 bg-gray-300 rounded animate-pulse mt-1" />
  )}
</div>

            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-36 bg-white shadow-md rounded-xl border border-gray-200 p-2 z-50"
        align="end"
      >
        {/* Single-line full email with horizontal scroll if too long */}
        <div className="text-sm text-gray-600 mb-2 whitespace-nowrap overflow-x-auto">
          {userData?.email || 'user@example.com'}
        </div>

        <Button
          variant="ghost"
          className="flex items-center justify-start gap-2 text-sm w-full text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export default ProfileNav
